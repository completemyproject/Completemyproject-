import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContractorAuth } from "@/hooks/useContractorAuth";
import { useContractorJobs } from "@/hooks/useContractorJobs";
import { JobAddForm } from "@/components/trades/JobAddForm";
import { TradesSettingsPanel } from "@/components/trades/TradesSettingsPanel";
import {
  JOB_STATUS_OPTIONS,
  MAX_INVOICES_PER_JOB,
  formatJobForUi,
  validateInvoiceFiles,
  type JobFormValues,
  type JobStatus,
  getSupabaseErrorMessage,
  getDocumentSignedUrl,
  type ContractorDocument,
} from "@/lib/contractorJobs";
import {
  Plus,
  Upload,
  FileText,
  Trash2,
  Download,
  LogOut,
  Briefcase,
  LayoutDashboard,
  ClipboardList,
  FolderOpen,
  Settings,
  Search,
  CheckCircle2,
  Clock,
  PoundSterling,
  TrendingUp,
  UserCircle2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Status = JobStatus;

const STATUS_STYLE: Record<Status, string> = {
  "Site visit arranged": "bg-blue-50 text-blue-700 border-blue-200",
  "Prepare quotation": "bg-amber-50 text-amber-700 border-amber-200",
  "Client received quotation": "bg-violet-50 text-violet-700 border-violet-200",
  "Quote accepted": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Invoiced": "bg-accent/10 text-accent border-accent/30",
  "Paid": "bg-green-50 text-green-700 border-green-200",
};

const STATUS_DOT: Record<Status, string> = {
  "Site visit arranged": "bg-blue-500",
  "Prepare quotation": "bg-amber-500",
  "Client received quotation": "bg-violet-500",
  "Quote accepted": "bg-emerald-500",
  "Invoiced": "bg-accent",
  "Paid": "bg-green-500",
};

type Tab = "overview" | "jobs" | "documents" | "settings";

export default function TradesDashboard() {
  const { toast } = useToast();
  const {
    loading: authLoading,
    profile,
    isApproved,
    isPending,
    isRejected,
    signOutAndRedirect,
    refreshProfile,
  } = useContractorAuth();

  const {
    jobs: rawJobs,
    documents,
    loading: jobsLoading,
    saving,
    addJob,
    changeJobStatus,
    removeJob,
    uploadDocuments,
    removeDocument,
    addInvoicesToJob,
  } = useContractorJobs(profile?.user_id, isApproved);

  const jobs = useMemo(() => rawJobs.map(formatJobForUi), [rawJobs]);

  const jobDocsByJobId = useMemo(() => {
    const map = new Map<string, ContractorDocument[]>();
    for (const job of rawJobs) {
      map.set(job.id, job.contractor_documents ?? []);
    }
    return map;
  }, [rawJobs]);

  const customerNameByJobId = useMemo(() => {
    const map = new Map<string, string>();
    for (const job of rawJobs) {
      map.set(job.id, job.customer_name);
    }
    return map;
  }, [rawJobs]);

  const openDocument = async (doc: ContractorDocument) => {
    const url = await getDocumentSignedUrl(doc.file_path);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else toast({ title: "Could not open file", variant: "destructive" });
  };

  const [tab, setTab] = useState<Tab>("overview");
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState<string>("all");
  const [jobInvoiceFilter, setJobInvoiceFilter] = useState<"all" | "with" | "without">("all");
  const [showAdd, setShowAdd] = useState(false);

  const stats = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter((j) => j.status !== "Invoiced" && j.status !== "Paid").length;
    const accepted = jobs.filter((j) => j.status === "Quote accepted").length;
    const invoiced = jobs.filter((j) => j.status === "Invoiced").length;
    return { total, active, accepted, invoiced };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const q = jobSearch.trim().toLowerCase();
    return jobs.filter((j) => {
      if (jobStatusFilter !== "all" && j.status !== jobStatusFilter) return false;
      const docCount = jobDocsByJobId.get(j.id)?.length ?? 0;
      if (jobInvoiceFilter === "with" && docCount === 0) return false;
      if (jobInvoiceFilter === "without" && docCount > 0) return false;
      if (!q) return true;
      return (
        j.customerName.toLowerCase().includes(q) ||
        j.postcode.toLowerCase().includes(q) ||
        j.status.toLowerCase().includes(q) ||
        (j.comments?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [jobs, jobSearch, jobStatusFilter, jobInvoiceFilter, jobDocsByJobId]);

  const jobFiltersActive =
    jobSearch.trim() !== "" || jobStatusFilter !== "all" || jobInvoiceFilter !== "all";

  const clearJobFilters = () => {
    setJobSearch("");
    setJobStatusFilter("all");
    setJobInvoiceFilter("all");
  };

  const handleAddJob = async (values: JobFormValues, invoiceFiles: File[]) => {
    if (!profile) return;
    try {
      await addJob(profile.id, values, invoiceFiles, {
        businessName: profile.business_name,
        email: profile.email,
      });
      toast({
        title: "Job saved",
        description: `${values.customerName} added to your pipeline.`,
      });
      setShowAdd(false);
      setTab("jobs");
    } catch (err) {
      toast({
        title: "Could not save job",
        description: getSupabaseErrorMessage(err),
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateStatus = async (id: string, status: Status) => {
    try {
      await changeJobStatus(id, status);
    } catch {
      toast({ title: "Update failed", description: "Could not update job status.", variant: "destructive" });
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await removeJob(id);
      toast({ title: "Job deleted" });
    } catch {
      toast({ title: "Delete failed", description: "Could not delete job.", variant: "destructive" });
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const validationError = validateInvoiceFiles(list);
    if (validationError) {
      toast({ title: "Upload failed", description: validationError, variant: "destructive" });
      return;
    }
    try {
      await uploadDocuments(list);
      toast({
        title: "Files uploaded",
        description: `${files.length} file${files.length > 1 ? "s" : ""} saved.`,
      });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: getSupabaseErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  const handleAddInvoice = async (jobId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      await addInvoicesToJob(jobId, Array.from(files));
      toast({
        title: "Invoice added successfully",
      });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: getSupabaseErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  const deleteDoc = async (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    try {
      await removeDocument(doc);
      toast({ title: "Document removed" });
    } catch {
      toast({ title: "Delete failed", description: "Could not remove document.", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await signOutAndRedirect();
    toast({ title: "Logged out" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-warm-100 flex items-center justify-center">
        <p className="text-sm text-ink-500">Verifying access…</p>
      </div>
    );
  }

  if (isPending || isRejected) {
    return (
      <div className="min-h-screen bg-warm-100 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white rounded-2xl border border-warm-200 shadow-lifted p-8 text-center">
            <div
              className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${
                isRejected ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              <Clock className="w-7 h-7" />
            </div>
            <h1 className="font-display text-xl font-bold text-ink-900 mb-2">
              {isRejected ? "Application not approved" : "Application under review"}
            </h1>
            <p className="text-sm text-ink-500 leading-relaxed mb-2">
              {isRejected
                ? "Unfortunately your application was not approved at this time. Contact our team if you have questions."
                : "Thanks for applying. Our team is reviewing your company details and will respond within 72 hours."}
            </p>
            {profile && (
              <p className="text-xs text-ink-400 mb-6">
                {profile.business_name} · {profile.email}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-11 px-5 rounded-xl border border-warm-200 text-sm font-semibold text-ink-900 hover:bg-warm-50"
              >
                Contact support
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-ink-900 text-white text-sm font-semibold hover:bg-ink-900/90"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isApproved) {
    return null;
  }

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "jobs", label: "Jobs", icon: ClipboardList },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const pageMeta: Record<Tab, { kicker: string; title: string }> = {
    overview: { kicker: "Dashboard", title: "Welcome back" },
    jobs: { kicker: "Pipeline", title: "Your jobs" },
    documents: { kicker: "Files", title: "Invoices & documents" },
    settings: { kicker: "Account", title: "User settings" },
  };

  return (
    <div className="min-h-screen bg-warm-100">
      {/* Sidebar — fixed full viewport height so background never gaps below content */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col bg-ink-900 text-white">
        <div className="shrink-0 px-6 py-5 border-b border-white/10">
          <Link to="/trades-dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-display font-extrabold text-ink-900">
              C
            </div>
            <div className="leading-tight">
              <p className="font-display font-extrabold text-sm">CompleteMyProject</p>
              <p className="text-[10px] uppercase tracking-widest text-white/50">Trade portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-accent text-ink-900"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-col min-w-0 lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-warm-50/95 backdrop-blur border-b border-warm-200">
          <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 h-16">
            <div className="lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-ink-900 text-white flex items-center justify-center font-display font-extrabold">
                  C
                </div>
              </Link>
            </div>

          

            <div className="flex-1 sm:hidden" />

            <div className="flex items-end justify-end w-full gap-2">
             
              <div className="flex items-center gap-2 pl-2 pr-3 h-10 rounded-lg border border-warm-200 bg-white">
                <UserCircle2 className="w-5 h-5 text-ink-700" />
                <span className="text-sm font-semibold text-ink-900 hidden sm:inline truncate max-w-[140px]">
                  {profile?.business_name || "My business"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="lg:hidden w-10 h-10 rounded-lg border border-warm-200 bg-white hover:bg-warm-100 flex items-center justify-center text-ink-700 transition"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="lg:hidden border-t border-warm-200 px-4 sm:px-6 flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                      active
                        ? "border-accent text-ink-900"
                        : "border-transparent text-ink-500 hover:text-ink-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {jobsLoading && tab !== "settings" && (
            <div className="flex items-center justify-center gap-2 py-12 text-ink-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading your data…</span>
            </div>
          )}

          {(tab === "settings" || !jobsLoading) && (
            <>
          {/* Page header */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent mb-1">
                {pageMeta[tab].kicker}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-900">
                {pageMeta[tab].title}
              </h1>
              {tab !== "settings" && (
                <p className="text-sm text-ink-500 mt-1">
                  {new Date().toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              {tab === "settings" && (
                <p className="text-sm text-ink-500 mt-1">
                  Manage your business profile and sign-in security.
                </p>
              )}
            </div>

            {(tab === "overview" || tab === "jobs") && (
              <button
                onClick={() => setShowAdd((s) => !s)}
                className="inline-flex items-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold px-4 h-10 rounded-lg text-sm transition"
              >
                <Plus className="w-4 h-4" />
                {showAdd ? "Close form" : "New job"}
              </button>
            )}
          </div>

          {showAdd && (tab === "overview" || tab === "jobs") && (
            <JobAddForm
              saving={saving}
              onSubmit={handleAddJob}
              onCancel={() => setShowAdd(false)}
            />
          )}

          {/* OVERVIEW */}
          {tab === "overview" && (
            <>
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total jobs",
                    value: stats.total,
                    icon: Briefcase,
                    tint: "bg-blue-50 text-blue-700",
                  },
                  {
                    label: "Active",
                    value: stats.active,
                    icon: Clock,
                    tint: "bg-amber-50 text-amber-700",
                  },
                  {
                    label: "Quotes accepted",
                    value: stats.accepted,
                    icon: CheckCircle2,
                    tint: "bg-emerald-50 text-emerald-700",
                  },
                  {
                    label: "Invoiced",
                    value: stats.invoiced,
                    icon: PoundSterling,
                    tint: "bg-accent/10 text-accent",
                  },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="bg-white rounded-2xl border border-warm-200 shadow-sm p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.tint}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          <TrendingUp className="w-3 h-3" />
                          live
                        </span>
                      </div>
                      <p className="font-display text-3xl font-extrabold text-ink-900 leading-none">
                        {s.value}
                      </p>
                      <p className="text-xs font-semibold text-ink-500 mt-2 uppercase tracking-wider">
                        {s.label}
                      </p>
                    </div>
                  );
                })}
              </section>

              <section className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-warm-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="font-display text-base font-extrabold text-ink-900">
                        Recent activity
                      </h2>
                      <p className="text-xs text-ink-500 mt-0.5">
                        Your 5 most recent jobs across all statuses.
                      </p>
                    </div>
                    {jobs.length > 0 && (
                      <button
                        onClick={() => setTab("jobs")}
                        className="text-xs font-semibold text-accent hover:underline"
                      >
                        View all →
                      </button>
                    )}
                  </div>
                  {jobs.length === 0 ? (
                    <EmptyState
                      icon={Briefcase}
                      title="No jobs yet"
                      body="Add your first job to start tracking customer enquiries."
                      action={
                        <button
                          onClick={() => setShowAdd(true)}
                          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 h-10 rounded-lg text-sm transition"
                        >
                          <Plus className="w-4 h-4" />
                          Add a job
                        </button>
                      }
                    />
                  ) : (
                    <ul className="divide-y divide-warm-100">
                      {jobs.slice(0, 5).map((j) => (
                        <li key={j.id} className="py-3 flex items-center gap-3">
                          <span
                            className={`w-2 h-2 rounded-full ${STATUS_DOT[j.status]} shrink-0`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink-900 truncate">
                              {j.customerName}
                            </p>
                            <p className="text-xs text-ink-500">
                              {j.postcode} · {j.status}
                            </p>
                          </div>
                          <span className="text-xs text-ink-500 hidden sm:inline">
                            {new Date(j.createdAt).toLocaleDateString("en-GB")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-6">
                  <h2 className="font-display text-base font-extrabold text-ink-900 mb-1">
                    Pipeline breakdown
                  </h2>
                  <p className="text-xs text-ink-500 mb-5">Jobs by current status.</p>
                  <ul className="space-y-3">
                    {JOB_STATUS_OPTIONS.map((s) => {
                      const count = jobs.filter((j) => j.status === s).length;
                      const pct = jobs.length ? (count / jobs.length) * 100 : 0;
                      return (
                        <li key={s}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-2 h-2 rounded-full ${STATUS_DOT[s]} shrink-0`}
                              />
                              <span className="text-xs font-medium text-ink-700 truncate">
                                {s}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-ink-900 tabular-nums">
                              {count}
                            </span>
                          </div>
                          <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${STATUS_DOT[s]} transition-all`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            </>
          )}

          {/* JOBS */}
          {tab === "jobs" && (
            <section className="bg-white rounded-2xl border border-warm-200 shadow-sm">
              <div className="p-6 border-b border-warm-100 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-base font-extrabold text-ink-900">
                    All jobs{" "}
                    <span className="text-ink-500 font-medium">
                      ({filteredJobs.length}
                      {jobFiltersActive ? ` of ${jobs.length}` : ""})
                    </span>
                  </h2>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Search and filter your pipeline, or edit status inline in the table.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <div className="relative flex-1 sm:flex-none sm:w-56 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" />
                    <input
                      type="text"
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      placeholder="Search customer, postcode, comments…"
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-warm-200 bg-white text-sm placeholder:text-ink-500/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    />
                  </div>
                  <Select value={jobStatusFilter} onValueChange={setJobStatusFilter}>
                    <SelectTrigger className="w-44 h-9 border-warm-200 text-sm">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      {JOB_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={jobInvoiceFilter}
                    onValueChange={(v) => setJobInvoiceFilter(v as "all" | "with" | "without")}
                  >
                    <SelectTrigger className="w-36 h-9 border-warm-200 text-sm">
                      <SelectValue placeholder="Invoices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All invoices</SelectItem>
                      <SelectItem value="with">With invoice</SelectItem>
                      <SelectItem value="without">No invoice</SelectItem>
                    </SelectContent>
                  </Select>
                  {jobFiltersActive && (
                    <button
                      type="button"
                      onClick={clearJobFilters}
                      className="h-9 px-3 rounded-lg border border-warm-200 text-xs font-semibold text-ink-700 hover:bg-warm-100"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {jobs.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={Briefcase}
                    title="No jobs yet"
                    body="Add your first job to start tracking enquiries."
                  />
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={Briefcase}
                    title="No matches"
                    body="Try a different search or filter."
                  />
                  <button
                    type="button"
                    onClick={clearJobFilters}
                    className="mt-4 text-sm font-semibold text-accent hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-warm-100/50">
                      <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500">
                        <th className="py-3 px-6 font-semibold">Customer</th>
                        <th className="py-3 px-4 font-semibold">Postcode</th>
                        <th className="py-3 px-4 font-semibold">Inspection</th>
                        <th className="py-3 px-4 font-semibold">Comments</th>
                        <th className="py-3 px-4 font-semibold">Invoices</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-6 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm-100">
                      {filteredJobs.map((j) => (
                        <tr key={j.id} className="hover:bg-warm-50 transition">
                          <td className="py-4 px-6">
                            <p className="font-semibold text-ink-900">{j.customerName}</p>
                            <p className="text-xs text-ink-500 mt-0.5">
                              Added {new Date(j.createdAt).toLocaleDateString("en-GB")}
                            </p>
                          </td>
                          <td className="py-4 px-4 text-ink-700 font-mono text-xs">
                            {j.postcode}
                          </td>
                          <td className="py-4 px-4 text-ink-700">
                            {j.inspectionDate
                              ? new Date(j.inspectionDate).toLocaleDateString("en-GB")
                              : "—"}
                          </td>
                          <td className="py-4 px-4 text-ink-500 max-w-xs">
                            <p className="line-clamp-2">{j.comments || "—"}</p>
                          </td>
                          <td className="py-4 px-4">
                            {(jobDocsByJobId.get(j.id)?.length ?? 0) > 0 && (
                              <ul className="space-y-1 mb-1.5">
                                {jobDocsByJobId.get(j.id)!.map((doc) => (
                                  <li key={doc.id}>
                                    <button
                                      type="button"
                                      onClick={() => openDocument(doc)}
                                      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline max-w-[140px]"
                                      title={doc.file_name}
                                    >
                                      <FileText className="w-3 h-3 shrink-0" />
                                      <span className="truncate">{doc.file_name}</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {(jobDocsByJobId.get(j.id)?.length ?? 0) < MAX_INVOICES_PER_JOB && (
                              <label className="inline-flex items-center gap-1 text-xs font-medium text-ink-500 hover:text-accent cursor-pointer">
                                <Plus className="w-3 h-3 shrink-0" />
                                Add invoice
                                <input
                                  type="file"
                                  multiple
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                                  onChange={(e) => {
                                    handleAddInvoice(j.id, e.target.files);
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={j.status}
                              onChange={(e) => updateStatus(j.id, e.target.value as Status)}
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border ${STATUS_STYLE[j.status]} cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30`}
                            >
                              {JOB_STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => deleteJob(j.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600 transition"
                              aria-label="Delete job"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* SETTINGS */}
          {tab === "settings" && profile && (
            <TradesSettingsPanel
              profile={profile}
              onProfileUpdated={() => {
                void refreshProfile();
              }}
            />
          )}

          {/* DOCUMENTS */}
          {tab === "documents" && (
            <section className="bg-white rounded-2xl border border-warm-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-base font-extrabold text-ink-900">
                    Invoices & documents{" "}
                    <span className="text-ink-500 font-medium">({documents.length})</span>
                  </h2>
                  <p className="text-xs text-ink-500 mt-0.5">
                    All uploaded files appear here. Invoices attached when adding a job show as
                    &quot;linked to job&quot; and also under that job in the Jobs table.
                  </p>
                </div>
              </div>

              <label
                htmlFor="doc-upload"
                className="block border-2 border-dashed border-warm-200 hover:border-accent/60 hover:bg-warm-50 rounded-xl p-10 text-center cursor-pointer transition"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-ink-900">
                  Click to upload or drag files here
                </p>
                <p className="text-xs text-ink-500 mt-1">
                  PDF, JPG, PNG, DOCX, XLSX · multiple files allowed
                </p>
                <input
                  id="doc-upload"
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>

              {documents.length > 0 ? (
                <ul className="mt-6 divide-y divide-warm-100">
                  {documents.map((d) => (
                    <li key={d.id} className="flex items-center gap-3 py-3">
                      <div className="w-10 h-10 rounded-lg bg-warm-100 border border-warm-200 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink-900 truncate">{d.file_name}</p>
                        <p className="text-xs text-ink-500">
                          {(d.file_size / 1024).toFixed(1)} KB ·{" "}
                          {new Date(d.created_at).toLocaleDateString("en-GB")}
                          {d.job_id
                            ? ` · Job: ${customerNameByJobId.get(d.job_id) ?? "linked"}`
                            : " · General upload"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openDocument(d)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-ink-500 hover:bg-warm-100 hover:text-accent transition"
                        aria-label={`Download ${d.file_name}`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDoc(d.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600 transition"
                        aria-label="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-ink-500 text-center mt-5">
                  No documents uploaded yet.
                </p>
              )}
            </section>
          )}

            </>
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: typeof Briefcase;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-10">
      <div className="w-12 h-12 rounded-xl bg-warm-100 text-ink-500 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-display font-extrabold text-ink-900">{title}</p>
      <p className="text-sm text-ink-500 mt-1 mb-4">{body}</p>
      {action}
    </div>
  );
}