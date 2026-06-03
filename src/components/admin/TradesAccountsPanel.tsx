import { useMemo, useState } from "react";
import {
  Building2,
  Eye,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  User,
  UserCheck,
  UserX,
  Hash,
  Calendar,
  Users,
} from "lucide-react";
import type { ContractorProfile } from "@/lib/auth";
import { formatStatusLabel } from "@/lib/formatStatusLabel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export type AdminConfirmRequest = {
  title: string;
  description: string;
  confirmLabel: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
};

type Props = {
  accounts: ContractorProfile[];
  loading: boolean;
  defaultStatusFilter?: string;
  onApprove: (profile: ContractorProfile) => Promise<void>;
  onReject: (profile: ContractorProfile) => Promise<void>;
  onRefresh: () => void;
  onRequestConfirm: (options: AdminConfirmRequest) => void;
};

export function TradesAccountsPanel({
  accounts,
  loading,
  defaultStatusFilter = "all",
  onApprove,
  onReject,
  onRefresh,
  onRequestConfirm,
}: Props) {
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<ContractorProfile | null>(null);
  const [acting, setActing] = useState(false);

  const stats = useMemo(
    () => ({
      total: accounts.length,
      pending: accounts.filter((a) => a.status === "pending").length,
      approved: accounts.filter((a) => a.status === "approved").length,
      rejected: accounts.filter((a) => a.status === "rejected").length,
    }),
    [accounts],
  );

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (typeFilter !== "all" && a.business_type !== typeFilter) return false;
      return true;
    });
  }, [accounts, statusFilter, typeFilter]);

  const formatBusinessType = (type: string) =>
    type === "ltd" ? "Ltd company" : type === "sole_trader" ? "Sole trader" : type.replace("_", " ");

  const confirmApprove = (profile: ContractorProfile) => {
    onRequestConfirm({
      title: "Approve application?",
      description: `Are you sure you want to approve ${profile.business_name}? They will get access to the trades dashboard.`,
      confirmLabel: "Approve",
      onConfirm: async () => {
        setActing(true);
        try {
          await onApprove(profile);
          setSelected((prev) =>
            prev?.id === profile.id ? { ...prev, status: "approved" } : prev,
          );
        } finally {
          setActing(false);
        }
      },
    });
  };

  const confirmReject = (profile: ContractorProfile) => {
    onRequestConfirm({
      title: "Reject application?",
      description: `Are you sure you want to reject ${profile.business_name}? They will not be able to access the trades dashboard.`,
      confirmLabel: "Reject",
      variant: "destructive",
      onConfirm: async () => {
        setActing(true);
        try {
          await onReject(profile);
          setSelected((prev) =>
            prev?.id === profile.id ? { ...prev, status: "rejected" } : prev,
          );
        } finally {
          setActing(false);
        }
      },
    });
  };

  return (
    <>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Total accounts" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Rejected" value={stats.rejected} />
      </section>

      <section className="bg-white rounded-2xl border border-warm-200 shadow-sm min-w-0">
        <div className="p-4 sm:p-6 border-b border-warm-100 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-base font-extrabold text-ink-900">
              Sign-up applications{" "}
              <span className="text-ink-500 font-medium">({filtered.length})</span>
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">
              All fields from the trades sign-up form — use Details for the full record.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36 h-9 border-warm-200 text-sm">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-36 h-9 border-warm-200 text-sm">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="ltd">Ltd company</SelectItem>
                <SelectItem value="sole_trader">Sole trader</SelectItem>
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={onRefresh}
              className="h-9 w-9 rounded-lg border border-warm-200 hover:bg-warm-100 flex items-center justify-center text-ink-700"
              aria-label="Refresh accounts"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-ink-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading accounts…</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-ink-500 p-6">
            {statusFilter !== "all" || typeFilter !== "all"
              ? "No accounts match your filters."
              : "No tradesperson sign-ups yet."}
          </p>
        ) : (
          <>
            <div className="md:hidden divide-y divide-warm-100">
              {filtered.map((app) => (
                <article key={app.id} className="p-4 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-900">{app.business_name}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{formatBusinessType(app.business_type)}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${STATUS_STYLE[app.status] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                    >
                      {formatStatusLabel(app.status)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-ink-900">{app.contact_name}</p>
                    {app.contact_phone && (
                      <p className="text-xs text-ink-500">{app.contact_phone}</p>
                    )}
                    <p className="text-xs text-ink-600 break-all mt-1">{app.email}</p>
                  </div>
                  <p className="text-xs text-ink-500">
                    {new Date(app.created_at).toLocaleString("en-GB")}
                  </p>
                  <AccountActions
                    profile={app}
                    acting={acting}
                    onDetails={() => setSelected(app)}
                    onApprove={() => confirmApprove(app)}
                    onReject={() => confirmReject(app)}
                    mobile
                  />
                </article>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-warm-100/50">
                  <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500">
                    <th className="py-3 px-4 font-semibold">Business</th>
                    <th className="py-3 px-4 font-semibold">Contact</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Applied</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-100">
                  {filtered.map((app) => (
                    <tr key={app.id} className="hover:bg-warm-50 transition align-top">
                      <td className="py-4 px-4">
                        <p className="font-semibold text-ink-900">{app.business_name}</p>
                        <p className="text-xs text-ink-500 mt-0.5">{formatBusinessType(app.business_type)}</p>
                      </td>
                      <td className="py-4 px-4 font-medium text-ink-900">
                        <p>{app.contact_name}</p>
                        {app.contact_phone && (
                          <p className="text-xs text-ink-500 font-normal mt-0.5">{app.contact_phone}</p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-ink-900 text-xs break-all max-w-[180px]">{app.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${STATUS_STYLE[app.status] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                        >
                          {formatStatusLabel(app.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-ink-500 whitespace-nowrap text-xs">
                        {new Date(app.created_at).toLocaleString("en-GB")}
                      </td>
                      <td className="py-4 px-4">
                        <AccountActions
                          profile={app}
                          acting={acting}
                          onDetails={() => setSelected(app)}
                          onApprove={() => confirmApprove(app)}
                          onReject={() => confirmReject(app)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto border-warm-200">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl flex flex-wrap items-center gap-3">
                  Application details
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[selected.status] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                  >
                    {formatStatusLabel(selected.status)}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <section>
                  <h3 className="text-sm font-semibold text-ink-900 mb-3">Business information</h3>
                  <ul className="space-y-3 text-sm">
                    <DetailRow icon={Building2} label="Business name" value={selected.business_name} />
                    <DetailRow
                      icon={Hash}
                      label="Company number"
                      value={selected.company_number || "—"}
                    />
                    <DetailRow
                      icon={Building2}
                      label="Business type"
                      value={formatBusinessType(selected.business_type)}
                    />
                    <DetailRow
                      icon={Users}
                      label="Number of directors"
                      value={
                        selected.number_of_directors != null
                          ? String(selected.number_of_directors)
                          : "—"
                      }
                    />
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-ink-900 mb-3">Contact information</h3>
                  <ul className="space-y-3 text-sm">
                    <DetailRow icon={User} label="Contact name" value={selected.contact_name} />
                    <DetailRow
                      icon={Phone}
                      label="Contact number"
                      value={selected.contact_phone || "—"}
                    />
                    <DetailRow icon={Mail} label="Email address" value={selected.email} />
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-ink-900 mb-3">Submitted</h3>
                  <ul className="space-y-3 text-sm">
                    <DetailRow
                      icon={Calendar}
                      label="Applied"
                      value={new Date(selected.created_at).toLocaleString("en-GB")}
                    />
                  </ul>
                </section>

                {selected.status === "pending" && (
                  <div className="flex gap-2 pt-2 border-t border-warm-100">
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => confirmApprove(selected)}
                      className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-semibold disabled:opacity-50"
                    >
                      <UserCheck className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => confirmReject(selected)}
                      className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-warm-200 text-ink-700 hover:bg-warm-100 text-sm font-semibold disabled:opacity-50"
                    >
                      <UserX className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-ink-500 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-ink-500">{label}</p>
        <p className={`font-medium text-ink-900 break-all ${mono ? "font-mono text-xs" : ""}`}>
          {value}
        </p>
      </div>
    </li>
  );
}

function AccountActions({
  profile,
  acting,
  onDetails,
  onApprove,
  onReject,
  mobile,
}: {
  profile: ContractorProfile;
  acting: boolean;
  onDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
  mobile?: boolean;
}) {
  return (
    <div className={`flex gap-2 flex-wrap ${mobile ? "justify-stretch" : "justify-end"}`}>
      <button
        type="button"
        onClick={onDetails}
        className={`inline-flex items-center justify-center gap-1 h-9 px-3 rounded-lg text-accent hover:bg-accent/10 text-xs font-semibold transition ${mobile ? "flex-1 min-w-[5rem]" : ""}`}
      >
        <Eye className="w-3.5 h-3.5" />
        Details
      </button>
      {profile.status === "pending" && (
        <>
          <button
            type="button"
            disabled={acting}
            onClick={onApprove}
            className={`inline-flex items-center justify-center gap-1 h-9 px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition disabled:opacity-50 ${mobile ? "flex-1 min-w-[5rem]" : ""}`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Approve
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={onReject}
            className={`inline-flex items-center justify-center gap-1 h-9 px-3 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition disabled:opacity-50 ${mobile ? "flex-1 min-w-[5rem]" : ""}`}
          >
            <UserX className="w-3.5 h-3.5" />
            Reject
          </button>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-4 sm:p-5 min-w-0">
      <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none">{value}</p>
      <p className="text-[10px] sm:text-xs font-semibold text-ink-500 mt-1.5 sm:mt-2 uppercase tracking-wider leading-tight">
        {label}
      </p>
    </div>
  );
}
