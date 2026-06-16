import { useCallback, useEffect, useState } from "react";
import {
  addJobInvoices,
  createContractorJob,
  deleteContractorDocument,
  deleteContractorJob,
  fetchContractorDocuments,
  fetchContractorJobs,
  type ContractorDocument,
  type ContractorJobWithDocs,
  type JobFormValues,
  type JobStatus,
  updateContractorJobStatus,
  uploadStandaloneDocuments,
} from "@/lib/contractorJobs";

export function useContractorJobs(userId: string | undefined, enabled: boolean) {
  const [jobs, setJobs] = useState<ContractorJobWithDocs[]>([]);
  const [documents, setDocuments] = useState<ContractorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId || !enabled) {
      setJobs([]);
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [jobsData, docsData] = await Promise.all([
        fetchContractorJobs(userId),
        fetchContractorDocuments(userId),
      ]);
      setJobs(jobsData);
      setDocuments(docsData);
    } finally {
      setLoading(false);
    }
  }, [userId, enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addJob = async (
    contractorProfileId: string,
    values: JobFormValues,
    invoiceFiles: File[],
    contractorMeta?: { businessName: string; email: string },
  ) => {
    if (!userId) throw new Error("Not signed in");
    setSaving(true);
    try {
      const created = await createContractorJob(
        userId,
        contractorProfileId,
        values,
        invoiceFiles,
        contractorMeta,
      );
      setJobs((prev) => [created, ...prev]);
      if (created.contractor_documents.length > 0) {
        setDocuments((prev) => [...created.contractor_documents, ...prev]);
      }
      return created;
    } finally {
      setSaving(false);
    }
  };

  const changeJobStatus = async (jobId: string, status: JobStatus) => {
    if (!userId) return;
    await updateContractorJobStatus(userId, jobId, status);
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status } : j)));
  };

  const removeJob = async (jobId: string) => {
    if (!userId) return;
    await deleteContractorJob(userId, jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setDocuments((prev) => prev.filter((d) => d.job_id !== jobId));
  };

  const uploadDocuments = async (files: File[]) => {
    if (!userId) throw new Error("Not signed in");
    setSaving(true);
    try {
      const uploaded = await uploadStandaloneDocuments(userId, files);
      setDocuments((prev) => [...uploaded, ...prev]);
      return uploaded;
    } finally {
      setSaving(false);
    }
  };

  const removeDocument = async (document: ContractorDocument) => {
    if (!userId) return;
    await deleteContractorDocument(userId, document);
    setDocuments((prev) => prev.filter((d) => d.id !== document.id));
  };

  const addInvoicesToJob = async (jobId: string, files: File[]) => {
    if (!userId) throw new Error("Not signed in");
    const existingCount = jobs.find((j) => j.id === jobId)?.contractor_documents.length ?? 0;
    setSaving(true);
    try {
      const uploaded = await addJobInvoices(userId, jobId, existingCount, files);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, contractor_documents: [...j.contractor_documents, ...uploaded] }
            : j,
        ),
      );
      setDocuments((prev) => [...uploaded, ...prev]);
      return uploaded;
    } finally {
      setSaving(false);
    }
  };

  return {
    jobs,
    documents,
    loading,
    saving,
    refresh,
    addJob,
    changeJobStatus,
    removeJob,
    uploadDocuments,
    removeDocument,
    addInvoicesToJob,
  };
}
