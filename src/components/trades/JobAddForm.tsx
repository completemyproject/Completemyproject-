import { useRef, useState } from "react";
import { Plus, Upload, X, FileText } from "lucide-react";
import {
  jobFormSchema,
  JOB_STATUS_OPTIONS,
  validateInvoiceFiles,
  MAX_INVOICES_PER_JOB,
  type JobFormErrors,
  type JobFormValues,
  type JobStatus,
} from "@/lib/contractorJobs";

const inputCls =
  "w-full h-10 px-3 rounded-lg border bg-white text-sm text-ink-900 placeholder:text-ink-500/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition";
const inputErrorCls = "border-red-300 focus:border-red-400 focus:ring-red-200/50";
const labelCls = "block text-xs font-semibold text-ink-700 mb-1.5";

const defaultValues: JobFormValues = {
  customerName: "",
  postcode: "",
  inspectionDate: "",
  comments: "",
  status: "Site visit arranged",
};

type Props = {
  saving: boolean;
  onSubmit: (values: JobFormValues, invoiceFiles: File[]) => Promise<void>;
  onCancel: () => void;
};

export function JobAddForm({ saving, onSubmit, onCancel }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<JobFormValues>(defaultValues);
  const [errors, setErrors] = useState<JobFormErrors>({});
  const [invoiceFiles, setInvoiceFiles] = useState<File[]>([]);

  const setField = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const addInvoiceFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const merged = [...invoiceFiles, ...Array.from(files)].slice(0, MAX_INVOICES_PER_JOB);
    const invoiceError = validateInvoiceFiles(merged);
    if (invoiceError) {
      setErrors((prev) => ({ ...prev, invoices: invoiceError }));
      return;
    }
    setInvoiceFiles(merged);
    setErrors((prev) => ({ ...prev, invoices: undefined }));
  };

  const removeInvoiceFile = (index: number) => {
    setInvoiceFiles((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => ({ ...prev, invoices: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = jobFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: JobFormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof JobFormValues;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const invoiceError = validateInvoiceFiles(invoiceFiles);
    if (invoiceError) {
      setErrors({ invoices: invoiceError });
      return;
    }

    await onSubmit(parsed.data, invoiceFiles);
    setValues(defaultValues);
    setInvoiceFiles([]);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="bg-white rounded-2xl border border-warm-200 shadow-sm p-6 mb-8">
      <div className="mb-5">
        <h2 className="font-display text-base font-extrabold text-ink-900">Add a new job</h2>
        <p className="text-xs text-ink-500 mt-0.5">
          Track a customer enquiry through your pipeline. Required fields are marked *.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4" noValidate>
        <div>
          <label className={labelCls} htmlFor="customerName">
            Customer name *
          </label>
          <input
            id="customerName"
            type="text"
            value={values.customerName}
            onChange={(e) => setField("customerName", e.target.value)}
            className={`${inputCls} ${errors.customerName ? inputErrorCls : "border-warm-200"}`}
            placeholder="John Smith"
            aria-invalid={Boolean(errors.customerName)}
          />
          {errors.customerName && (
            <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label className={labelCls} htmlFor="postcode">
            Postcode *
          </label>
          <input
            id="postcode"
            type="text"
            value={values.postcode}
            onChange={(e) => setField("postcode", e.target.value.toUpperCase())}
            className={`${inputCls} ${errors.postcode ? inputErrorCls : "border-warm-200"}`}
            placeholder="HD1 1JP"
            aria-invalid={Boolean(errors.postcode)}
          />
          {errors.postcode && <p className="text-xs text-red-600 mt-1">{errors.postcode}</p>}
        </div>

        <div>
          <label className={labelCls} htmlFor="inspectionDate">
            Inspection date
          </label>
          <input
            id="inspectionDate"
            type="date"
            value={values.inspectionDate || ""}
            onChange={(e) => setField("inspectionDate", e.target.value)}
            className={`${inputCls} ${errors.inspectionDate ? inputErrorCls : "border-warm-200"}`}
          />
          {errors.inspectionDate && (
            <p className="text-xs text-red-600 mt-1">{errors.inspectionDate}</p>
          )}
        </div>

        <div>
          <label className={labelCls} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={values.status}
            onChange={(e) => setField("status", e.target.value as JobStatus)}
            className={`${inputCls} border-warm-200`}
          >
            {JOB_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="comments">
            Comments
          </label>
          <textarea
            id="comments"
            value={values.comments || ""}
            onChange={(e) => setField("comments", e.target.value)}
            rows={3}
            className={`${inputCls} h-auto py-2.5 resize-none border-warm-200`}
            placeholder="Scope, materials, access notes…"
          />
          {errors.comments && <p className="text-xs text-red-600 mt-1">{errors.comments}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Invoice / supporting documents</label>
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
              errors.invoices
                ? "border-red-300 bg-red-50/50"
                : "border-warm-200 hover:border-accent/60 hover:bg-warm-50"
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mx-auto mb-2">
              <Upload className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-ink-900">Attach invoices (optional)</p>
            <p className="text-xs text-ink-500 mt-1">
              Optional · up to {MAX_INVOICES_PER_JOB} files · 10 MB each
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
            >
              <Plus className="w-4 h-4" />
              Choose files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              onChange={(e) => {
                addInvoiceFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
          {errors.invoices && <p className="text-xs text-red-600 mt-1">{errors.invoices}</p>}

          {invoiceFiles.length > 0 && (
            <ul className="mt-3 space-y-2">
              {invoiceFiles.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-warm-200 bg-warm-50 px-3 py-2"
                >
                  <FileText className="w-4 h-4 text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
                    <p className="text-xs text-ink-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInvoiceFile(index)}
                    className="w-8 h-8 rounded-lg hover:bg-red-50 text-ink-500 hover:text-red-600 flex items-center justify-center"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="sm:col-span-2 flex gap-2 justify-end pt-2 border-t border-warm-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 h-10 rounded-lg text-sm font-semibold text-ink-700 hover:bg-warm-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-5 h-10 rounded-lg text-sm transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {saving ? "Saving…" : "Save job"}
          </button>
        </div>
      </form>
    </section>
  );
}
