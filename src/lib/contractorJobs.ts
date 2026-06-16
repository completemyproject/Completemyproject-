import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { notifyTradeJobCreated } from "@/lib/emailService";
import type { Tables } from "@/integrations/supabase/types";

export const JOB_STATUS_OPTIONS = [
  "Site visit arranged",
  "Prepare quotation",
  "Client received quotation",
  "Quote accepted",
  "Invoiced",
  "Paid",
] as const;

export type JobStatus = (typeof JOB_STATUS_OPTIONS)[number];

export type ContractorJob = Tables<"contractor_jobs">;
export type ContractorDocument = Tables<"contractor_documents">;

export type ContractorJobWithDocs = ContractorJob & {
  contractor_documents: ContractorDocument[];
};

export type AdminContractorJob = ContractorJob & {
  contractor_profiles: {
    business_name: string;
    contact_name: string;
    email: string;
  } | null;
  contractor_documents: ContractorDocument[];
};

export const MAX_INVOICE_BYTES = 10 * 1024 * 1024;
export const MAX_INVOICES_PER_JOB = 5;

export const jobFormSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  postcode: z.string().trim().min(1, "Postcode is required"),
  inspectionDate: z.string().optional(),
  comments: z.string().optional(),
  status: z.enum(JOB_STATUS_OPTIONS),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

export type JobFormErrors = Partial<Record<keyof JobFormValues | "invoices", string>>;

export function getSupabaseErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    const msg = String((err as { message: string }).message);
    if (msg.includes("contractor_jobs") && msg.includes("schema cache")) {
      return "Database tables not ready. Run: npm run db:push";
    }
    if (msg.includes("row-level security") || msg.includes("RLS")) {
      return "Permission denied. Make sure your tradesperson account is approved.";
    }
    if (msg.includes("Bucket not found") || msg.includes("contractor-documents")) {
      return "File storage not set up. Run npm run db:push or RUN_IN_DASHBOARD.sql in Supabase.";
    }
    return msg;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

function mimeTypeForUpload(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  const byExt: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
  return byExt[ext || ""] || "application/pdf";
}

export function validateInvoiceFiles(files: File[]): string | null {
  if (files.length > MAX_INVOICES_PER_JOB) {
    return `Maximum ${MAX_INVOICES_PER_JOB} files.`;
  }
  for (const file of files) {
    if (file.size > MAX_INVOICE_BYTES) {
      return `"${file.name}" is too large (max 10 MB).`;
    }
  }
  return null;
}

function mapJob(row: ContractorJob): ContractorJob {
  return row;
}

export async function fetchContractorJobs(userId: string): Promise<ContractorJobWithDocs[]> {
  const { data, error } = await supabase
    .from("contractor_jobs")
    .select("*, contractor_documents(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map((row) => ({
    ...mapJob(row),
    contractor_documents: row.contractor_documents || [],
  }));
}

export async function fetchContractorDocuments(userId: string): Promise<ContractorDocument[]> {
  const { data, error } = await supabase
    .from("contractor_documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchAdminContractorJobs(): Promise<AdminContractorJob[]> {
  const { data, error } = await supabase
    .from("contractor_jobs")
    .select(
      `
      *,
      contractor_profiles (
        business_name,
        contact_name,
        email
      ),
      contractor_documents (
        id,
        file_name,
        file_path,
        file_size,
        mime_type,
        created_at,
        job_id,
        user_id
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map((row) => ({
    ...(row as ContractorJob & {
      contractor_profiles: AdminContractorJob["contractor_profiles"];
    }),
    contractor_documents: row.contractor_documents ?? [],
  }));
}

export async function createContractorJob(
  userId: string,
  contractorProfileId: string,
  values: JobFormValues,
  invoiceFiles: File[],
  contractorMeta?: { businessName: string; email: string },
): Promise<ContractorJobWithDocs> {
  const parsed = jobFormSchema.parse(values);
  const invoiceError = validateInvoiceFiles(invoiceFiles);
  if (invoiceError) throw new Error(invoiceError);

  const { data: job, error: jobError } = await supabase
    .from("contractor_jobs")
    .insert({
      user_id: userId,
      contractor_profile_id: contractorProfileId,
      customer_name: parsed.customerName,
      postcode: parsed.postcode.trim().toUpperCase(),
      inspection_date: parsed.inspectionDate || null,
      comments: parsed.comments?.trim() || "",
      status: parsed.status,
    })
    .select()
    .single();

  if (jobError) throw jobError;

  try {
    const documents = await uploadJobDocuments(userId, job.id, invoiceFiles);
    if (contractorMeta) {
      notifyTradeJobCreated({
        businessName: contractorMeta.businessName,
        contractorEmail: contractorMeta.email,
        customerName: parsed.customerName,
        postcode: parsed.postcode.trim().toUpperCase(),
        status: parsed.status,
        inspectionDate: parsed.inspectionDate,
        comments: parsed.comments?.trim(),
      });
    }
    return { ...job, contractor_documents: documents };
  } catch (uploadError) {
    await supabase.from("contractor_jobs").delete().eq("id", job.id).eq("user_id", userId);
    throw uploadError;
  }
}

export async function uploadJobDocuments(
  userId: string,
  jobId: string,
  files: File[],
): Promise<ContractorDocument[]> {
  if (files.length === 0) return [];

  const uploaded: ContractorDocument[] = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${userId}/${jobId}/${Date.now()}-${safeName}`;

    const { error: storageError } = await supabase.storage
      .from("contractor-documents")
      .upload(filePath, file, { upsert: false, contentType: mimeTypeForUpload(file) });

    if (storageError) throw storageError;

    const { data: doc, error: docError } = await supabase
      .from("contractor_documents")
      .insert({
        user_id: userId,
        job_id: jobId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type || null,
      })
      .select()
      .single();

    if (docError) throw docError;
    uploaded.push(doc);
  }

  return uploaded;
}

export async function addJobInvoices(
  userId: string,
  jobId: string,
  existingCount: number,
  files: File[],
): Promise<ContractorDocument[]> {
  if (existingCount + files.length > MAX_INVOICES_PER_JOB) {
    throw new Error(`Maximum ${MAX_INVOICES_PER_JOB} files per job.`);
  }
  const invoiceError = validateInvoiceFiles(files);
  if (invoiceError) throw new Error(invoiceError);

  return uploadJobDocuments(userId, jobId, files);
}

export async function updateContractorJobStatus(
  userId: string,
  jobId: string,
  status: JobStatus,
): Promise<void> {
  const { error } = await supabase
    .from("contractor_jobs")
    .update({ status })
    .eq("id", jobId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function deleteContractorJob(userId: string, jobId: string): Promise<void> {
  const { data: docs, error: docsError } = await supabase
    .from("contractor_documents")
    .select("file_path")
    .eq("job_id", jobId)
    .eq("user_id", userId);

  if (docsError) throw docsError;

  if (docs?.length) {
    const { error: storageError } = await supabase.storage
      .from("contractor-documents")
      .remove(docs.map((d) => d.file_path));

    if (storageError) throw storageError;
  }

  const { error } = await supabase
    .from("contractor_jobs")
    .delete()
    .eq("id", jobId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function uploadStandaloneDocuments(
  userId: string,
  files: File[],
): Promise<ContractorDocument[]> {
  const invoiceError = validateInvoiceFiles(files);
  if (invoiceError) throw new Error(invoiceError);

  const uploaded: ContractorDocument[] = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${userId}/general/${Date.now()}-${safeName}`;

    const { error: storageError } = await supabase.storage
      .from("contractor-documents")
      .upload(filePath, file, { upsert: false, contentType: mimeTypeForUpload(file) });

    if (storageError) throw storageError;

    const { data: doc, error: docError } = await supabase
      .from("contractor_documents")
      .insert({
        user_id: userId,
        job_id: null,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type || null,
      })
      .select()
      .single();

    if (docError) throw docError;
    uploaded.push(doc);
  }

  return uploaded;
}

export async function deleteContractorDocument(
  userId: string,
  document: ContractorDocument,
): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from("contractor-documents")
    .remove([document.file_path]);

  if (storageError) throw storageError;

  const { error } = await supabase
    .from("contractor_documents")
    .delete()
    .eq("id", document.id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function getDocumentSignedUrl(filePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("contractor-documents")
    .createSignedUrl(filePath, 60 * 60);

  if (error) {
    console.error("getDocumentSignedUrl:", error);
    return null;
  }
  return data.signedUrl;
}

export function formatJobForUi(job: ContractorJob) {
  return {
    id: job.id,
    customerName: job.customer_name,
    postcode: job.postcode,
    inspectionDate: job.inspection_date || "",
    comments: job.comments,
    status: job.status as JobStatus,
    createdAt: job.created_at,
  };
}
