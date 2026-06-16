import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  LogOut,
  RefreshCw,
  Users,
  LayoutDashboard,
  ClipboardList,
  UserPlus,
  Loader2,
  TrendingUp,
  Briefcase,
  FileText,
  Handshake,
  MessageSquare,
  FileCheck,
  Mail,
  Gift,
} from "lucide-react";
import type { ContractorProfile } from "@/lib/auth";
import {
  notifyAccountApproved,
  notifyAccountRejected,
  notifyEnquiryStatusUpdated,
  notifyReferralStatusUpdated,
  sendCustomEmail,
  smtpTest,
} from "@/lib/emailService";
import {
  fetchAdminContractorJobs,
  getDocumentSignedUrl,
  JOB_STATUS_OPTIONS,
  type AdminContractorJob,
} from "@/lib/contractorJobs";
import {
  fetchContactMessages,
  isPartnershipMessage,
  partnershipTypeFromTopic,
  companyFromPartnershipMessage,
  partnershipMessageBody,
  messageBody,
  type ContactMessage,
} from "@/lib/adminInbox";
import { formatStatusLabel } from "@/lib/formatStatusLabel";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { TradesAccountsPanel } from "@/components/admin/TradesAccountsPanel";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  project_type: string;
  description: string;
  status: string;
  created_at: string;
};

type AdminTab = "overview" | "applications" | "jobs" | "quotes" | "partnerships" | "referrals" | "contact" | "email";

type Referral = {
  id: string;
  referrer_name: string;
  referrer_email: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  status: string;
  created_at: string;
};

const ENQUIRY_STATUS_STYLE: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  quoted: "bg-violet-50 text-violet-700 border-violet-200",
  in_progress: "bg-accent/10 text-accent border-accent/30",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const JOB_STATUS_STYLE: Record<string, string> = {
  "Site visit arranged": "bg-blue-50 text-blue-700 border-blue-200",
  "Prepare quotation": "bg-amber-50 text-amber-700 border-amber-200",
  "Client received quotation": "bg-violet-50 text-violet-700 border-violet-200",
  "Quote accepted": "bg-emerald-50 text-emerald-700 border-emerald-200",
  Invoiced: "bg-accent/10 text-accent border-accent/30",
  Paid: "bg-green-50 text-green-700 border-green-200",
};

const ADMIN_PAGE_SIZE = 10;

const PARTNERSHIP_STATUS_OPTIONS = ["pending", "accepted", "rejected"] as const;

const PARTNERSHIP_STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const REFERRAL_STATUS_OPTIONS = ["pending", "accepted", "rejected"] as const;

const REFERRAL_STATUS_STYLE: Record<string, string> = PARTNERSHIP_STATUS_STYLE;

const ENQUIRY_STATUS_OPTIONS = [
  "new",
  "contacted",
  "quoted",
  "in_progress",
  "completed",
  "cancelled",
] as const;

/** contact_messages defaults to "new" — treat that as "pending" for partnerships. */
function partnershipStatus(m: ContactMessage): string {
  return m.status === "new" ? "pending" : m.status;
}

export default function Admin() {
  const { authChecked, logout } = useAdminAuth();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [jobTradespersonFilter, setJobTradespersonFilter] = useState("all");
  const [jobInvoiceFilter, setJobInvoiceFilter] = useState<"all" | "with" | "without">("all");
  const [jobSearch, setJobSearch] = useState("");
  const [emailConsoleTo, setEmailConsoleTo] = useState("");
  const [emailConsoleSubject, setEmailConsoleSubject] = useState("");
  const [emailConsoleText, setEmailConsoleText] = useState("");
  const [emailConsoleHtml, setEmailConsoleHtml] = useState("");
  const [sendingEmailConsole, setSendingEmailConsole] = useState(false);
  const [confirm, setConfirm] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    variant?: "default" | "destructive";
    onConfirm: () => void | Promise<void>;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [applications, setApplications] = useState<ContractorProfile[]>([]);
  const [contractorJobs, setContractorJobs] = useState<AdminContractorJob[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [selectedPartnership, setSelectedPartnership] = useState<ContactMessage | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [referralStatusFilter, setReferralStatusFilter] = useState<string>("all");
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>("all");
  const [contactTopicFilter, setContactTopicFilter] = useState<string>("all");

  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [loadingContractorJobs, setLoadingContractorJobs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingReferrals, setLoadingReferrals] = useState(true);

  const partnershipMessages = useMemo(
    () => contactMessages.filter(isPartnershipMessage),
    [contactMessages],
  );
  const generalContactMessages = useMemo(
    () => contactMessages.filter((m) => !isPartnershipMessage(m)),
    [contactMessages],
  );

  const [partnershipStatusFilter, setPartnershipStatusFilter] = useState<string>("all");
  const [partnershipTypeFilter, setPartnershipTypeFilter] = useState<string>("all");

  const partnershipCounts = useMemo(
    () => ({
      all: partnershipMessages.length,
      pending: partnershipMessages.filter((m) => partnershipStatus(m) === "pending").length,
      accepted: partnershipMessages.filter((m) => partnershipStatus(m) === "accepted").length,
      rejected: partnershipMessages.filter((m) => partnershipStatus(m) === "rejected").length,
    }),
    [partnershipMessages],
  );

  const partnershipTypes = useMemo(() => {
    const types = new Set(partnershipMessages.map((m) => partnershipTypeFromTopic(m.topic)));
    return Array.from(types).filter((t) => t && t !== "—").sort();
  }, [partnershipMessages]);

  const filteredPartnershipMessages = useMemo(() => {
    return partnershipMessages.filter((m) => {
      if (partnershipStatusFilter !== "all" && partnershipStatus(m) !== partnershipStatusFilter) {
        return false;
      }
      if (partnershipTypeFilter !== "all" && partnershipTypeFromTopic(m.topic) !== partnershipTypeFilter) {
        return false;
      }
      return true;
    });
  }, [partnershipMessages, partnershipStatusFilter, partnershipTypeFilter]);

  const [partnershipPage, setPartnershipPage] = useState(1);

  const partnershipTotalPages = Math.max(
    1,
    Math.ceil(filteredPartnershipMessages.length / ADMIN_PAGE_SIZE),
  );

  const paginatedPartnershipMessages = useMemo(
    () =>
      filteredPartnershipMessages.slice(
        (partnershipPage - 1) * ADMIN_PAGE_SIZE,
        partnershipPage * ADMIN_PAGE_SIZE,
      ),
    [filteredPartnershipMessages, partnershipPage],
  );

  useEffect(() => {
    setPartnershipPage(1);
  }, [partnershipStatusFilter, partnershipTypeFilter]);

  useEffect(() => {
    if (partnershipPage > partnershipTotalPages) setPartnershipPage(partnershipTotalPages);
  }, [partnershipPage, partnershipTotalPages]);

  const referralCounts = useMemo(
    () => ({
      all: referrals.length,
      pending: referrals.filter((r) => r.status === "pending").length,
      accepted: referrals.filter((r) => r.status === "accepted").length,
      rejected: referrals.filter((r) => r.status === "rejected").length,
    }),
    [referrals],
  );

  const filteredReferrals = useMemo(() => {
    if (referralStatusFilter === "all") return referrals;
    return referrals.filter((r) => r.status === referralStatusFilter);
  }, [referrals, referralStatusFilter]);

  const [referralPage, setReferralPage] = useState(1);

  const referralTotalPages = Math.max(1, Math.ceil(filteredReferrals.length / ADMIN_PAGE_SIZE));

  const paginatedReferrals = useMemo(
    () =>
      filteredReferrals.slice(
        (referralPage - 1) * ADMIN_PAGE_SIZE,
        referralPage * ADMIN_PAGE_SIZE,
      ),
    [filteredReferrals, referralPage],
  );

  useEffect(() => {
    setReferralPage(1);
  }, [referralStatusFilter]);

  useEffect(() => {
    if (referralPage > referralTotalPages) setReferralPage(referralTotalPages);
  }, [referralPage, referralTotalPages]);

  const enquiryCounts = useMemo(
    () => ({
      all: enquiries.length,
      new: enquiries.filter((e) => e.status === "new").length,
      contacted: enquiries.filter((e) => e.status === "contacted").length,
      quoted: enquiries.filter((e) => e.status === "quoted").length,
      in_progress: enquiries.filter((e) => e.status === "in_progress").length,
      completed: enquiries.filter((e) => e.status === "completed").length,
      cancelled: enquiries.filter((e) => e.status === "cancelled").length,
    }),
    [enquiries],
  );

  const filteredEnquiries = useMemo(() => {
    if (enquiryStatusFilter === "all") return enquiries;
    return enquiries.filter((e) => e.status === enquiryStatusFilter);
  }, [enquiries, enquiryStatusFilter]);

  const [enquiryPage, setEnquiryPage] = useState(1);

  const enquiryTotalPages = Math.max(1, Math.ceil(filteredEnquiries.length / ADMIN_PAGE_SIZE));

  const paginatedEnquiries = useMemo(
    () =>
      filteredEnquiries.slice(
        (enquiryPage - 1) * ADMIN_PAGE_SIZE,
        enquiryPage * ADMIN_PAGE_SIZE,
      ),
    [filteredEnquiries, enquiryPage],
  );

  useEffect(() => {
    setEnquiryPage(1);
  }, [enquiryStatusFilter]);

  useEffect(() => {
    if (enquiryPage > enquiryTotalPages) setEnquiryPage(enquiryTotalPages);
  }, [enquiryPage, enquiryTotalPages]);

  const contactTopics = useMemo(() => {
    const topics = new Set(
      generalContactMessages.map((m) => (m.topic || "").trim()).filter(Boolean),
    );
    return Array.from(topics).sort();
  }, [generalContactMessages]);

  const filteredContactMessages = useMemo(() => {
    if (contactTopicFilter === "all") return generalContactMessages;
    return generalContactMessages.filter((m) => m.topic === contactTopicFilter);
  }, [generalContactMessages, contactTopicFilter]);

  const [contactPage, setContactPage] = useState(1);

  const contactTotalPages = Math.max(1, Math.ceil(filteredContactMessages.length / ADMIN_PAGE_SIZE));

  const paginatedContactMessages = useMemo(
    () =>
      filteredContactMessages.slice(
        (contactPage - 1) * ADMIN_PAGE_SIZE,
        contactPage * ADMIN_PAGE_SIZE,
      ),
    [filteredContactMessages, contactPage],
  );

  useEffect(() => {
    setContactPage(1);
  }, [contactTopicFilter]);

  useEffect(() => {
    if (contactPage > contactTotalPages) setContactPage(contactTotalPages);
  }, [contactPage, contactTotalPages]);

  useEffect(() => {
    if (authChecked) {
      fetchEnquiries();
      fetchApplications();
      fetchContractorJobs();
      fetchInboxMessages();
      fetchReferrals();
    }
  }, [authChecked]);

  useEffect(() => {
    setSelectedMessage(null);
    setSelectedEnquiry(null);
    setSelectedPartnership(null);
    setSelectedReferral(null);
  }, [tab]);

  const fetchInboxMessages = async () => {
    setLoadingMessages(true);
    try {
      const data = await fetchContactMessages();
      setContactMessages(data);
    } catch (error) {
      toast.error("Failed to load messages");
      console.error(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const updatePartnershipStatus = async (message: ContactMessage, newStatus: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: newStatus })
      .eq("id", message.id);

    if (error) {
      toast.error("Failed to update status");
      console.error(error);
      return;
    }

    toast.success("Status updated");
    setContactMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, status: newStatus } : m)),
    );
    setSelectedMessage((prev) => (prev?.id === message.id ? { ...prev, status: newStatus } : prev));
    setSelectedPartnership((prev) => (prev?.id === message.id ? { ...prev, status: newStatus } : prev));
  };

  const requestPartnershipStatusChange = (message: ContactMessage, newStatus: string) => {
    if (newStatus === partnershipStatus(message)) return;
    requestConfirm({
      title: "Change application status?",
      description: `Mark ${message.name}'s partnership application as "${formatStatusLabel(newStatus)}"?`,
      confirmLabel: "Update status",
      onConfirm: () => updatePartnershipStatus(message, newStatus),
    });
  };

  const fetchReferrals = async () => {
    setLoadingReferrals(true);
    const { data, error } = await supabase
      .from("referrals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load referrals");
      console.error(error);
    } else {
      setReferrals(data || []);
    }
    setLoadingReferrals(false);
  };

  const updateReferralStatus = async (referral: Referral, newStatus: string) => {
    const { error } = await supabase
      .from("referrals")
      .update({ status: newStatus })
      .eq("id", referral.id);

    if (error) {
      toast.error("Failed to update status");
      console.error(error);
      return;
    }

    toast.success("Status updated");
    setReferrals((prev) =>
      prev.map((r) => (r.id === referral.id ? { ...r, status: newStatus } : r)),
    );
    setSelectedReferral((prev) => (prev?.id === referral.id ? { ...prev, status: newStatus } : prev));

    notifyReferralStatusUpdated({
      referrerName: referral.referrer_name,
      referrerEmail: referral.referrer_email,
      clientName: referral.client_name,
      status: newStatus,
    });
  };

  const requestReferralStatusChange = (referral: Referral, newStatus: string) => {
    if (newStatus === referral.status) return;
    requestConfirm({
      title: "Change referral status?",
      description: `Mark ${referral.referrer_name}'s referral for ${referral.client_name} as "${formatStatusLabel(newStatus)}"? ${referral.referrer_name} will be emailed about this update.`,
      confirmLabel: "Update status",
      onConfirm: () => updateReferralStatus(referral, newStatus),
    });
  };

  const openJobDocument = async (filePath: string, fileName: string) => {
    const url = await getDocumentSignedUrl(filePath);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else toast.error(`Could not open ${fileName}`);
  };

  const fetchContractorJobs = async () => {
    setLoadingContractorJobs(true);
    try {
      const data = await fetchAdminContractorJobs();
      setContractorJobs(data);
    } catch (error) {
      toast.error("Failed to load tradesperson jobs");
      console.error(error);
    } finally {
      setLoadingContractorJobs(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApplications(true);
    const { data, error } = await supabase
      .from("contractor_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load contractor applications");
      console.error(error);
    } else {
      setApplications(data || []);
    }
    setLoadingApplications(false);
  };

  const approveApplication = async (profile: ContractorProfile) => {
    const { data: contractor, error: contractorError } = await supabase
      .from("contractors")
      .insert({
        company_name: profile.business_name,
        contact_name: profile.contact_name,
        email: profile.email,
        phone: profile.contact_phone || "",
        trades: [],
        service_areas: [],
        is_active: true,
      })
      .select("id")
      .single();

    if (contractorError) {
      toast.error("Failed to create contractor record");
      console.error(contractorError);
      return;
    }

    const { error } = await supabase
      .from("contractor_profiles")
      .update({ status: "approved", contractor_id: contractor.id })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to approve application");
      console.error(error);
      return;
    }

    notifyAccountApproved({
      email: profile.email,
      contactName: profile.contact_name,
      businessName: profile.business_name,
    });

    toast.success(`${profile.business_name} approved`);
    fetchApplications();
  };

  const rejectApplication = async (profile: ContractorProfile) => {
    const { error } = await supabase
      .from("contractor_profiles")
      .update({ status: "rejected" })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to reject application");
      console.error(error);
      return;
    }

    notifyAccountRejected({
      email: profile.email,
      contactName: profile.contact_name,
      businessName: profile.business_name,
    });

    toast.success(`${profile.business_name} rejected`);
    fetchApplications();
  };

  const fetchEnquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load enquiries");
      console.error(error);
    } else {
      setEnquiries(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (enquiryId: string, newStatus: string) => {
    const { error } = await supabase
      .from("enquiries")
      .update({ status: newStatus })
      .eq("id", enquiryId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e)),
      );
      if (selectedEnquiry?.id === enquiryId) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      notifyEnquiryStatusUpdated({ enquiryId, status: formatStatusLabel(newStatus) });
    }
  };

  const stats = useMemo(
    () => ({
      totalEnquiries: enquiries.length,
      newLeads: enquiries.filter((e) => e.status === "new").length,
      inProgress: enquiries.filter((e) =>
        ["in_progress", "contacted", "quoted"].includes(e.status),
      ).length,
      pendingApps: applications.filter((a) => a.status === "pending").length,
      tradespersonJobs: contractorJobs.length,
      partnerships: partnershipMessages.length,
      contactMessages: generalContactMessages.length,
      referrals: referrals.length,
      pendingReferrals: referralCounts.pending,
    }),
    [enquiries, applications, contractorJobs, partnershipMessages, generalContactMessages, referrals, referralCounts],
  );

  const navBadgeCounts = useMemo(
    () => ({
      applications: stats.pendingApps,
      quotes: stats.totalEnquiries,
      partnerships: stats.partnerships,
      referrals: stats.pendingReferrals,
      contact: stats.contactMessages,
    }),
    [stats],
  );

  const getNavBadge = (tabId: AdminTab): number | null => {
    const count = navBadgeCounts[tabId as keyof typeof navBadgeCounts];
    return count != null && count > 0 ? count : null;
  };

  const refreshAll = () => {
    fetchEnquiries();
    fetchApplications();
    fetchContractorJobs();
    fetchInboxMessages();
    fetchReferrals();
  };

  const requestConfirm = (options: NonNullable<typeof confirm>) => {
    setConfirm(options);
  };

  const handleConfirmAction = async () => {
    if (!confirm) return;
    setConfirmLoading(true);
    try {
      await confirm.onConfirm();
    } finally {
      setConfirmLoading(false);
      setConfirm(null);
    }
  };

  const jobTradespeople = useMemo(() => {
    const map = new Map<string, string>();
    for (const job of contractorJobs) {
      const id = job.contractor_profile_id ?? job.contractor_profiles?.business_name ?? "unknown";
      const label = job.contractor_profiles?.business_name ?? "Unknown tradesperson";
      map.set(id, label);
    }
    return Array.from(map.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [contractorJobs]);

  const filteredContractorJobs = useMemo(() => {
    const q = jobSearch.trim().toLowerCase();
    return contractorJobs.filter((job) => {
      if (jobStatusFilter !== "all" && job.status !== jobStatusFilter) return false;
      if (jobTradespersonFilter !== "all") {
        const key = job.contractor_profile_id ?? job.contractor_profiles?.business_name ?? "unknown";
        if (key !== jobTradespersonFilter) return false;
      }
      const docCount = job.contractor_documents?.length ?? 0;
      if (jobInvoiceFilter === "with" && docCount === 0) return false;
      if (jobInvoiceFilter === "without" && docCount > 0) return false;
      if (!q) return true;
      return (
        job.customer_name.toLowerCase().includes(q) ||
        job.postcode.toLowerCase().includes(q) ||
        job.status.toLowerCase().includes(q) ||
        (job.contractor_profiles?.business_name?.toLowerCase().includes(q) ?? false) ||
        (job.contractor_profiles?.contact_name?.toLowerCase().includes(q) ?? false) ||
        (job.contractor_profiles?.email?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [contractorJobs, jobStatusFilter, jobTradespersonFilter, jobInvoiceFilter, jobSearch]);

  const clearJobFilters = () => {
    setJobStatusFilter("all");
    setJobTradespersonFilter("all");
    setJobInvoiceFilter("all");
    setJobSearch("");
  };

  const jobFiltersActive =
    jobStatusFilter !== "all" ||
    jobTradespersonFilter !== "all" ||
    jobInvoiceFilter !== "all" ||
    jobSearch.trim() !== "";

  const requestEnquiryStatusChange = (enquiry: Enquiry, newStatus: string) => {
    if (newStatus === enquiry.status) return;
    requestConfirm({
      title: "Change lead status?",
      description: `Are you sure you want to change this lead to "${formatStatusLabel(newStatus)}"?`,
      confirmLabel: "Update status",
      onConfirm: () => updateStatus(enquiry.id, newStatus),
    });
  };

  const sendSmtpTest = async () => {
    setSendingEmailConsole(true);
    try {
      await smtpTest();
      toast.success("SMTP test email sent");
    } catch (err) {
      toast.error("SMTP test failed. Check the console for details.");
      console.error(err);
    } finally {
      setSendingEmailConsole(false);
    }
  };

  const sendCustomConsoleEmail = async () => {
    setSendingEmailConsole(true);
    try {
      await sendCustomEmail({
        to: emailConsoleTo,
        subject: emailConsoleSubject,
        text: emailConsoleText,
        html: emailConsoleHtml,
      });
      toast.success("Custom email sent successfully");
      setEmailConsoleTo("");
      setEmailConsoleSubject("");
      setEmailConsoleText("");
      setEmailConsoleHtml("");
    } catch (err) {
      toast.error("Failed to send custom email. Check the console for details.");
      console.error(err);
    } finally {
      setSendingEmailConsole(false);
    }
  };

  const navItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "applications", label: "Trades accounts", icon: UserPlus },
    { id: "jobs", label: "Trades jobs", icon: ClipboardList },
    { id: "quotes", label: "Get quotes", icon: FileCheck },
    { id: "partnerships", label: "Partnerships", icon: Handshake },
    { id: "referrals", label: "Referrals", icon: Gift },
    { id: "contact", label: "Contact us", icon: MessageSquare },
    { id: "email", label: "Email console", icon: Mail },
  ];

  const pageMeta: Record<AdminTab, { kicker: string; title: string }> = {
    overview: { kicker: "Dashboard", title: "Admin overview" },
    applications: { kicker: "Accounts", title: "Trades accounts" },
    jobs: { kicker: "Pipeline", title: "Tradesperson jobs" },
    quotes: { kicker: "Leads", title: "Get quotes submissions" },
    partnerships: { kicker: "Partners", title: "Partnership applications" },
    referrals: { kicker: "Rewards", title: "Refer a friend submissions" },
    contact: { kicker: "Inbox", title: "Contact form messages" },
    email: { kicker: "Email", title: "Email console" },
  };

  const isLoading =
    (tab === "overview" &&
      (loading || loadingApplications || loadingContractorJobs || loadingMessages || loadingReferrals)) ||
    (tab === "applications" && loadingApplications) ||
    (tab === "jobs" && loadingContractorJobs) ||
    (tab === "quotes" && loading) ||
    ((tab === "partnerships" || tab === "contact") && loadingMessages) ||
    (tab === "referrals" && loadingReferrals);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-warm-100 flex items-center justify-center">
        <p className="text-sm text-ink-500">Verifying access…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-100">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col bg-ink-900 text-white">
        <div className="shrink-0 px-6 py-5 border-b border-white/10">
          <button
            type="button"
            onClick={() => setTab("overview")}
            className="flex items-center gap-2 text-left w-full"
            aria-label="Admin overview"
          >
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-display font-extrabold text-ink-900">
              C
            </div>
            <div className="leading-tight">
              <p className="font-display font-extrabold text-sm">CompleteMyProject</p>
              <p className="text-[10px] uppercase tracking-widest text-white/50">Admin CRM</p>
            </div>
          </button>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            const badge = getNavBadge(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-accent text-ink-900"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {badge != null && (
                  <span
                    className={`text-[10px] font-bold min-w-[1.25rem] text-center px-1.5 py-0.5 rounded-full tabular-nums ${
                      active ? "bg-ink-900/20 text-ink-900" : "bg-white/15 text-white"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 px-3 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="flex flex-col min-w-0 lg:pl-64">
        <header className="sticky top-0 z-10 bg-warm-50/95 backdrop-blur border-b border-warm-200">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8 h-14 sm:h-16 min-w-0">
            <AdminMobileNav
              navItems={navItems}
              activeTab={tab}
              onTabChange={(id) => setTab(id as AdminTab)}
              getBadge={getNavBadge}
              onLogout={logout}
            />
            <button
              type="button"
              onClick={() => setTab("overview")}
              className="hidden lg:flex items-center gap-2 shrink-0"
              aria-label="Admin overview"
            >
              <div className="w-8 h-8 rounded-lg bg-ink-900 text-white flex items-center justify-center font-display font-extrabold">
                C
              </div>
            </button>

            <div className="flex-1 min-w-0" />

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={refreshAll}
                className="w-10 h-10 rounded-lg border border-warm-200 bg-white hover:bg-warm-100 flex items-center justify-center text-ink-700 transition"
                aria-label="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 pl-2 pr-3 h-10 rounded-lg border border-warm-200 bg-white">
                <Users className="w-5 h-5 text-ink-700" />
                <span className="text-sm font-semibold text-ink-900 hidden sm:inline">Admin</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="lg:hidden w-10 h-10 rounded-lg border border-warm-200 bg-white hover:bg-warm-100 flex items-center justify-center text-ink-700 transition"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-8 min-w-0 overflow-x-hidden">
          <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent mb-1">
                {pageMeta[tab].kicker}
              </p>
              <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-ink-900 break-words">
                {pageMeta[tab].title}
              </h1>
              <p className="text-xs sm:text-sm text-ink-500 mt-1 hidden sm:block">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-ink-500 mt-1 sm:hidden">
                {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-ink-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : (
            <>
              {tab === "overview" && (
                <>
                  <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {[
                      { label: "Get quotes", value: stats.totalEnquiries, icon: FileCheck, tint: "bg-blue-50 text-blue-700" },
                      { label: "New leads", value: stats.newLeads, icon: Users, tint: "bg-violet-50 text-violet-700" },
                      { label: "Partnerships", value: stats.partnerships, icon: Handshake, tint: "bg-emerald-50 text-emerald-700" },
                      { label: "Referrals", value: stats.referrals, icon: Gift, tint: "bg-pink-50 text-pink-700" },
                      { label: "Contact us", value: stats.contactMessages, icon: MessageSquare, tint: "bg-amber-50 text-amber-700" },
                      { label: "Pending apps", value: stats.pendingApps, icon: UserPlus, tint: "bg-warm-100 text-ink-700" },
                      { label: "Trades jobs", value: stats.tradespersonJobs, icon: Briefcase, tint: "bg-accent/10 text-accent" },
                    ].map((s) => {
                      const Icon = s.icon;
                      return (
                        <div
                          key={s.label}
                          className="bg-white rounded-2xl border border-warm-200 shadow-sm p-4 sm:p-5 min-w-0"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${s.tint}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                              <TrendingUp className="w-3 h-3" />
                              live
                            </span>
                          </div>
                          <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none">
                            {s.value}
                          </p>
                          <p className="text-[10px] sm:text-xs font-semibold text-ink-500 mt-1.5 sm:mt-2 uppercase tracking-wider leading-tight">
                            {s.label}
                          </p>
                        </div>
                      );
                    })}
                  </section>

                  <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-4 sm:p-6 min-w-0">
                      <h2 className="font-display text-base font-extrabold text-ink-900 mb-4">
                        Recent enquiries
                      </h2>
                      {enquiries.length === 0 ? (
                        <p className="text-sm text-ink-500">No enquiries yet.</p>
                      ) : (
                        <ul className="divide-y divide-warm-100">
                          {enquiries.slice(0, 5).map((e) => (
                            <li key={e.id} className="py-3 flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-ink-900 truncate">{e.name}</p>
                                <p className="text-xs text-ink-500">{e.project_type} · {e.postcode}</p>
                              </div>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${ENQUIRY_STATUS_STYLE[e.status] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                              >
                                {formatStatusLabel(e.status)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        type="button"
                        onClick={() => setTab("quotes")}
                        className="mt-4 text-xs font-semibold text-accent hover:underline"
                      >
                        View all quote requests →
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-4 sm:p-6 min-w-0">
                      <h2 className="font-display text-base font-extrabold text-ink-900 mb-4">
                        Recent tradesperson jobs
                      </h2>
                      {contractorJobs.length === 0 ? (
                        <p className="text-sm text-ink-500">No jobs submitted yet.</p>
                      ) : (
                        <ul className="divide-y divide-warm-100">
                          {contractorJobs.slice(0, 5).map((job) => (
                            <li key={job.id} className="py-3">
                              <p className="text-sm font-semibold text-ink-900">{job.customer_name}</p>
                              <p className="text-xs text-ink-500">
                                {job.contractor_profiles?.business_name ?? "Unknown"} · {job.status}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        type="button"
                        onClick={() => setTab("jobs")}
                        className="mt-4 text-xs font-semibold text-accent hover:underline"
                      >
                        View all jobs →
                      </button>
                    </div>
                  </section>
                </>
              )}

              {tab === "applications" && (
                <TradesAccountsPanel
                  accounts={applications}
                  loading={loadingApplications}
                  defaultStatusFilter="pending"
                  onApprove={approveApplication}
                  onReject={rejectApplication}
                  onRefresh={fetchApplications}
                  onRequestConfirm={requestConfirm}
                />
              )}

              {tab === "jobs" && (
                <section className="bg-white rounded-2xl border border-warm-200 shadow-sm min-w-0">
                  <div className="p-4 sm:p-6 border-b border-warm-100 flex flex-col gap-4">
                    <div className="min-w-0">
                      <h2 className="font-display text-base font-extrabold text-ink-900">
                        All tradesperson jobs{" "}
                        <span className="text-ink-500 font-medium">
                          ({filteredContractorJobs.length}
                          {jobFiltersActive ? ` of ${contractorJobs.length}` : ""})
                        </span>
                      </h2>
                      <p className="text-xs text-ink-500 mt-0.5">
                        Jobs added by approved tradespeople — filter by status, tradesperson, or invoices.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 w-full">
                      <input
                        type="text"
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                        placeholder="Search customer, postcode, tradesperson…"
                        className="h-9 w-full sm:col-span-2 lg:flex-1 lg:min-w-[12rem] lg:max-w-xs px-3 rounded-lg border border-warm-200 bg-white text-sm placeholder:text-ink-500/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                      />
                      <Select value={jobStatusFilter} onValueChange={setJobStatusFilter}>
                        <SelectTrigger className="w-full sm:w-auto lg:w-44 h-9 border-warm-200 text-sm">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          {JOB_STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {formatStatusLabel(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={jobTradespersonFilter} onValueChange={setJobTradespersonFilter}>
                        <SelectTrigger className="w-full sm:w-auto lg:w-44 h-9 border-warm-200 text-sm">
                          <SelectValue placeholder="All tradespeople" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All tradespeople</SelectItem>
                          {jobTradespeople.map(({ id, label }) => (
                            <SelectItem key={id} value={id}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={jobInvoiceFilter}
                        onValueChange={(v) =>
                          setJobInvoiceFilter(v as "all" | "with" | "without")
                        }
                      >
                        <SelectTrigger className="w-full sm:w-auto lg:w-36 h-9 border-warm-200 text-sm">
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
                          className="h-9 w-full sm:w-auto px-3 rounded-lg border border-warm-200 text-xs font-semibold text-ink-700 hover:bg-warm-100"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </div>
                  {contractorJobs.length === 0 ? (
                    <p className="text-sm text-ink-500 p-4 sm:p-6">
                      No jobs submitted yet.
                    </p>
                  ) : filteredContractorJobs.length === 0 ? (
                    <p className="text-sm text-ink-500 p-6">
                      No jobs match your filters.{" "}
                      <button
                        type="button"
                        onClick={clearJobFilters}
                        className="text-accent font-semibold hover:underline"
                      >
                        Clear filters
                      </button>
                    </p>
                  ) : (
                    <>
                      <div className="md:hidden divide-y divide-warm-100">
                        {filteredContractorJobs.map((job) => (
                          <article key={job.id} className="p-4 space-y-3">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-semibold text-ink-900">{job.customer_name}</p>
                                <p className="text-xs font-mono text-ink-600 mt-0.5">{job.postcode}</p>
                              </div>
                              <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${JOB_STATUS_STYLE[job.status] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                              >
                                {formatStatusLabel(job.status)}
                              </span>
                            </div>
                            <div className="text-sm min-w-0">
                              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">
                                Submitted by
                              </p>
                              <p className="font-semibold text-ink-900">
                                {job.contractor_profiles?.business_name || "Unknown"}
                              </p>
                              <p className="text-xs text-ink-500 break-all">
                                {job.contractor_profiles?.contact_name}
                                {job.contractor_profiles?.email
                                  ? ` · ${job.contractor_profiles.email}`
                                  : ""}
                              </p>
                            </div>
                            {(job.contractor_documents?.length ?? 0) > 0 && (
                              <ul className="space-y-1">
                                {job.contractor_documents!.map((doc) => (
                                  <li key={doc.id}>
                                    <button
                                      type="button"
                                      onClick={() => openJobDocument(doc.file_path, doc.file_name)}
                                      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline max-w-full"
                                    >
                                      <FileText className="w-3 h-3 shrink-0" />
                                      <span className="truncate">{doc.file_name}</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <p className="text-xs text-ink-500">
                              {new Date(job.created_at).toLocaleString("en-GB")}
                            </p>
                          </article>
                        ))}
                      </div>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm min-w-[640px]">
                          <thead className="bg-warm-100/50">
                            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500">
                              <th className="py-3 px-4 lg:px-6 font-semibold">Customer</th>
                              <th className="py-3 px-4 font-semibold">Postcode</th>
                              <th className="py-3 px-4 font-semibold">Status</th>
                              <th className="py-3 px-4 font-semibold">Submitted by</th>
                              <th className="py-3 px-4 font-semibold">Invoices</th>
                              <th className="py-3 px-4 font-semibold">Added</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-warm-100">
                            {filteredContractorJobs.map((job) => (
                              <tr key={job.id} className="hover:bg-warm-50 transition">
                                <td className="py-4 px-4 lg:px-6">
                                  <p className="font-semibold text-ink-900">{job.customer_name}</p>
                                </td>
                                <td className="py-4 px-4 font-mono text-xs text-ink-700">
                                  {job.postcode}
                                </td>
                                <td className="py-4 px-4">
                                  <span
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${JOB_STATUS_STYLE[job.status] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                                  >
                                    {formatStatusLabel(job.status)}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <p className="font-semibold text-ink-900 text-sm">
                                    {job.contractor_profiles?.business_name || "Unknown"}
                                  </p>
                                  <p className="text-xs text-ink-500">
                                    {job.contractor_profiles?.contact_name} ·{" "}
                                    {job.contractor_profiles?.email}
                                  </p>
                                </td>
                                <td className="py-4 px-4">
                                  {(job.contractor_documents?.length ?? 0) === 0 ? (
                                    <span className="text-xs text-ink-400">—</span>
                                  ) : (
                                    <ul className="space-y-1">
                                      {job.contractor_documents.map((doc) => (
                                        <li key={doc.id}>
                                          <button
                                            type="button"
                                            onClick={() => openJobDocument(doc.file_path, doc.file_name)}
                                            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline max-w-[160px]"
                                            title={doc.file_name}
                                          >
                                            <FileText className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{doc.file_name}</span>
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </td>
                                <td className="py-4 px-4 text-ink-500 whitespace-nowrap">
                                  {new Date(job.created_at).toLocaleString("en-GB")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </section>
              )}

              {tab === "quotes" && (
                <section className="bg-white rounded-2xl border border-warm-200 shadow-sm min-w-0">
                  <div className="p-4 sm:p-6 border-b border-warm-100 flex flex-col gap-4">
                    <div className="min-w-0">
                      <h2 className="font-display text-base font-extrabold text-ink-900">
                        Get quotes{" "}
                        <span className="text-ink-500 font-medium">
                          ({filteredEnquiries.length}
                          {filteredEnquiries.length !== enquiries.length
                            ? ` of ${enquiries.length}`
                            : ""}
                          )
                        </span>
                      </h2>
                      <p className="text-xs text-ink-500 mt-0.5">
                        Submissions from /get-quotes
                      </p>
                    </div>
                    <div className="flex gap-1 rounded-lg bg-warm-100 p-1 w-full overflow-x-auto">
                      {(["all", ...ENQUIRY_STATUS_OPTIONS] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setEnquiryStatusFilter(status)}
                          className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                            enquiryStatusFilter === status
                              ? "bg-white text-ink-900 shadow-sm"
                              : "text-ink-500 hover:text-ink-900"
                          }`}
                        >
                          {status === "all" ? "All" : formatStatusLabel(status)}{" "}
                          <span className="text-ink-400">({enquiryCounts[status]})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {enquiries.length === 0 ? (
                    <p className="text-sm text-ink-500 p-4 sm:p-6">
                      No enquiries yet.
                    </p>
                  ) : filteredEnquiries.length === 0 ? (
                    <p className="text-sm text-ink-500 p-6">
                      No enquiries match your filters.{" "}
                      <button
                        type="button"
                        onClick={() => setEnquiryStatusFilter("all")}
                        className="text-accent font-semibold hover:underline"
                      >
                        Clear filters
                      </button>
                    </p>
                  ) : (
                    <>
                      <div className="md:hidden divide-y divide-warm-100">
                        {paginatedEnquiries.map((e) => (
                          <button
                            key={e.id}
                            type="button"
                            onClick={() => setSelectedEnquiry(e)}
                            className="w-full text-left p-4 space-y-2 hover:bg-warm-50 transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-semibold text-ink-900 truncate">{e.name}</p>
                                <p className="text-xs text-ink-500 truncate">{e.email}</p>
                              </div>
                              <span
                                className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${ENQUIRY_STATUS_STYLE[e.status] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                              >
                                {formatStatusLabel(e.status)}
                              </span>
                            </div>
                            <p className="text-xs text-ink-500">
                              {e.project_type} · {e.postcode}
                            </p>
                            <p className="text-xs text-ink-500">
                              {new Date(e.created_at).toLocaleDateString("en-GB")}
                            </p>
                          </button>
                        ))}
                      </div>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm min-w-[760px]">
                          <thead className="bg-warm-100/50">
                            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500">
                              <th className="py-3 px-4 lg:px-6 font-semibold">Customer</th>
                              <th className="py-3 px-4 font-semibold">Project</th>
                              <th className="py-3 px-4 font-semibold">Postcode</th>
                              <th className="py-3 px-4 font-semibold">Status</th>
                              <th className="py-3 px-4 font-semibold">Submitted</th>
                              <th className="py-3 px-4 font-semibold" />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-warm-100">
                            {paginatedEnquiries.map((e) => (
                              <tr key={e.id} className="hover:bg-warm-50 transition">
                                <td className="py-4 px-4 lg:px-6 min-w-0">
                                  <p className="font-semibold text-ink-900">{e.name}</p>
                                  <p className="text-xs text-ink-500 truncate max-w-[200px]">{e.email}</p>
                                </td>
                                <td className="py-4 px-4 text-ink-700">{e.project_type}</td>
                                <td className="py-4 px-4 font-mono text-xs text-ink-700">{e.postcode}</td>
                                <td className="py-4 px-4">
                                  <Select
                                    value={e.status}
                                    onValueChange={(v) => requestEnquiryStatusChange(e, v)}
                                  >
                                    <SelectTrigger
                                      className={`h-8 w-36 text-xs font-semibold rounded-full border ${ENQUIRY_STATUS_STYLE[e.status] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                                    >
                                      <SelectValue>{formatStatusLabel(e.status)}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {ENQUIRY_STATUS_OPTIONS.map((s) => (
                                        <SelectItem key={s} value={s}>
                                          {formatStatusLabel(s)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="py-4 px-4 text-ink-500 whitespace-nowrap">
                                  {new Date(e.created_at).toLocaleDateString("en-GB")}
                                </td>
                                <td className="py-4 px-4 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedEnquiry(e)}
                                    className="text-xs font-semibold text-accent hover:underline"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {enquiryTotalPages > 1 && (
                        <div className="flex items-center justify-between gap-2 border-t border-warm-100 px-4 sm:px-6 py-3">
                          <p className="text-xs text-ink-500">
                            Page {enquiryPage} of {enquiryTotalPages}
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={enquiryPage === 1}
                              onClick={() => setEnquiryPage((p) => p - 1)}
                              className="h-8 px-3 rounded-lg border border-warm-200 text-xs font-semibold text-ink-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <button
                              type="button"
                              disabled={enquiryPage === enquiryTotalPages}
                              onClick={() => setEnquiryPage((p) => p + 1)}
                              className="h-8 px-3 rounded-lg border border-warm-200 text-xs font-semibold text-ink-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}

              {tab === "email" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  <section className="bg-white rounded-2xl border border-warm-200 shadow-sm p-6">
                    <div className="mb-5">
                      <h2 className="font-display text-base font-extrabold text-ink-900">
                        SMTP test
                      </h2>
                      <p className="text-sm text-ink-500 mt-2">
                        Send a live SMTP test through the configured edge function and IONOS SMTP settings.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={sendSmtpTest}
                      disabled={sendingEmailConsole}
                      className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-3 text-sm font-semibold text-ink-900 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sendingEmailConsole ? "Sending…" : "Send SMTP test email"}
                    </button>
                  </section>

                  <section className="bg-white rounded-2xl border border-warm-200 shadow-sm p-6">
                    <div className="mb-5">
                      <h2 className="font-display text-base font-extrabold text-ink-900">
                        Custom email
                      </h2>
                      <p className="text-sm text-ink-500 mt-2">
                        Send an arbitrary custom email through the same SMTP gateway.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-ink-800">
                        To
                        <input
                          type="email"
                          value={emailConsoleTo}
                          onChange={(event) => setEmailConsoleTo(event.target.value)}
                          placeholder="recipient@example.com"
                          className="mt-2 w-full rounded-xl border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-ink-900 focus:border-accent focus:ring-2 focus:ring-accent/20"
                        />
                      </label>

                      <label className="block text-sm font-semibold text-ink-800">
                        Subject
                        <input
                          type="text"
                          value={emailConsoleSubject}
                          onChange={(event) => setEmailConsoleSubject(event.target.value)}
                          placeholder="Email subject"
                          className="mt-2 w-full rounded-xl border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-ink-900 focus:border-accent focus:ring-2 focus:ring-accent/20"
                        />
                      </label>

                      <label className="block text-sm font-semibold text-ink-800">
                        Plain text body
                        <textarea
                          value={emailConsoleText}
                          onChange={(event) => setEmailConsoleText(event.target.value)}
                          placeholder="Write the plain-text email body here"
                          rows={5}
                          className="mt-2 w-full rounded-xl border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-ink-900 focus:border-accent focus:ring-2 focus:ring-accent/20"
                        />
                      </label>

                      <label className="block text-sm font-semibold text-ink-800">
                        Optional HTML body
                        <textarea
                          value={emailConsoleHtml}
                          onChange={(event) => setEmailConsoleHtml(event.target.value)}
                          placeholder="If provided, this HTML will be used instead of plain text formatting."
                          rows={5}
                          className="mt-2 w-full rounded-xl border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-ink-900 focus:border-accent focus:ring-2 focus:ring-accent/20"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={sendCustomConsoleEmail}
                        disabled={
                          sendingEmailConsole ||
                          !emailConsoleTo.trim() ||
                          !emailConsoleSubject.trim() ||
                          !emailConsoleText.trim()
                        }
                        className="inline-flex items-center justify-center rounded-full bg-ink-900 px-4 py-3 text-sm font-semibold text-white hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {sendingEmailConsole ? "Sending…" : "Send custom email"}
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {tab === "partnerships" && (
                <section className="bg-white rounded-2xl border border-warm-200 shadow-sm min-w-0">
                  <div className="p-4 sm:p-6 border-b border-warm-100 flex flex-col gap-4">
                    <div className="min-w-0">
                      <h2 className="font-display text-base font-extrabold text-ink-900">
                        Partnership applications{" "}
                        <span className="text-ink-500 font-medium">
                          ({filteredPartnershipMessages.length}
                          {filteredPartnershipMessages.length !== partnershipMessages.length
                            ? ` of ${partnershipMessages.length}`
                            : ""}
                          )
                        </span>
                      </h2>
                      <p className="text-xs text-ink-500 mt-0.5">
                        Submissions from /partnerships — Become a partner form
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex gap-1 rounded-lg bg-warm-100 p-1 w-full sm:w-auto sm:max-w-md">
                        {(["all", ...PARTNERSHIP_STATUS_OPTIONS] as const).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setPartnershipStatusFilter(status)}
                            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                              partnershipStatusFilter === status
                                ? "bg-white text-ink-900 shadow-sm"
                                : "text-ink-500 hover:text-ink-900"
                            }`}
                          >
                            {status === "all" ? "All" : formatStatusLabel(status)}{" "}
                            <span className="text-ink-400">({partnershipCounts[status]})</span>
                          </button>
                        ))}
                      </div>
                      {partnershipTypes.length > 0 && (
                        <Select value={partnershipTypeFilter} onValueChange={setPartnershipTypeFilter}>
                          <SelectTrigger className="w-full sm:w-48 h-9 border-warm-200 text-sm">
                            <SelectValue placeholder="All types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            {partnershipTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                  {partnershipMessages.length === 0 ? (
                    <p className="text-sm text-ink-500 p-4 sm:p-6">
                      No partnership applications yet.
                    </p>
                  ) : filteredPartnershipMessages.length === 0 ? (
                    <p className="text-sm text-ink-500 p-6">
                      No applications match your filters.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setPartnershipStatusFilter("all");
                          setPartnershipTypeFilter("all");
                        }}
                        className="text-accent font-semibold hover:underline"
                      >
                        Clear filters
                      </button>
                    </p>
                  ) : (
                    <>
                      <div className="md:hidden divide-y divide-warm-100">
                        {paginatedPartnershipMessages.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedPartnership(m)}
                            className="w-full text-left p-4 space-y-2 hover:bg-warm-50 transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-semibold text-ink-900 truncate">{m.name}</p>
                                <p className="text-xs text-ink-500 truncate">{m.email}</p>
                              </div>
                              <span
                                className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${PARTNERSHIP_STATUS_STYLE[partnershipStatus(m)] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                              >
                                {formatStatusLabel(partnershipStatus(m))}
                              </span>
                            </div>
                            <p className="text-xs text-ink-500">
                              {partnershipTypeFromTopic(m.topic)} ·{" "}
                              {companyFromPartnershipMessage(m.message)}
                            </p>
                            <p className="text-xs text-ink-500">
                              {new Date(m.created_at).toLocaleDateString("en-GB")}
                            </p>
                          </button>
                        ))}
                      </div>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm min-w-[720px]">
                          <thead className="bg-warm-100/50">
                            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500">
                              <th className="py-3 px-4 lg:px-6 font-semibold">Applicant</th>
                              <th className="py-3 px-4 font-semibold">Type</th>
                              <th className="py-3 px-4 font-semibold">Company</th>
                              <th className="py-3 px-4 font-semibold">Status</th>
                              <th className="py-3 px-4 font-semibold">Submitted</th>
                              <th className="py-3 px-4 font-semibold" />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-warm-100">
                            {paginatedPartnershipMessages.map((m) => (
                              <tr key={m.id} className="hover:bg-warm-50 transition">
                                <td className="py-4 px-4 lg:px-6 min-w-0">
                                  <p className="font-semibold text-ink-900">{m.name}</p>
                                  <p className="text-xs text-ink-500 truncate max-w-[200px]">{m.email}</p>
                                </td>
                                <td className="py-4 px-4 text-ink-700">
                                  {partnershipTypeFromTopic(m.topic)}
                                </td>
                                <td className="py-4 px-4 text-ink-700">
                                  {companyFromPartnershipMessage(m.message)}
                                </td>
                                <td className="py-4 px-4">
                                  <Select
                                    value={partnershipStatus(m)}
                                    onValueChange={(v) => requestPartnershipStatusChange(m, v)}
                                  >
                                    <SelectTrigger
                                      className={`h-8 w-36 text-xs font-semibold rounded-full border ${PARTNERSHIP_STATUS_STYLE[partnershipStatus(m)] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                                    >
                                      <SelectValue>{formatStatusLabel(partnershipStatus(m))}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {PARTNERSHIP_STATUS_OPTIONS.map((s) => (
                                        <SelectItem key={s} value={s}>
                                          {formatStatusLabel(s)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="py-4 px-4 text-ink-500 whitespace-nowrap">
                                  {new Date(m.created_at).toLocaleDateString("en-GB")}
                                </td>
                                <td className="py-4 px-4 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPartnership(m)}
                                    className="text-xs font-semibold text-accent hover:underline"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {partnershipTotalPages > 1 && (
                        <div className="flex items-center justify-between gap-2 border-t border-warm-100 px-4 sm:px-6 py-3">
                          <p className="text-xs text-ink-500">
                            Page {partnershipPage} of {partnershipTotalPages}
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={partnershipPage === 1}
                              onClick={() => setPartnershipPage((p) => p - 1)}
                              className="h-8 px-3 rounded-lg border border-warm-200 text-xs font-semibold text-ink-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <button
                              type="button"
                              disabled={partnershipPage === partnershipTotalPages}
                              onClick={() => setPartnershipPage((p) => p + 1)}
                              className="h-8 px-3 rounded-lg border border-warm-200 text-xs font-semibold text-ink-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}

              {tab === "referrals" && (
                <section className="bg-white rounded-2xl border border-warm-200 shadow-sm min-w-0">
                  <div className="p-4 sm:p-6 border-b border-warm-100 flex flex-col gap-4">
                    <div className="min-w-0">
                      <h2 className="font-display text-base font-extrabold text-ink-900">
                        Referrals{" "}
                        <span className="text-ink-500 font-medium">
                          ({filteredReferrals.length}
                          {filteredReferrals.length !== referrals.length ? ` of ${referrals.length}` : ""})
                        </span>
                      </h2>
                      <p className="text-xs text-ink-500 mt-0.5">
                        Submissions from the "Refer a friend" form
                      </p>
                    </div>
                    <div className="flex gap-1 rounded-lg bg-warm-100 p-1 w-full sm:w-auto sm:max-w-md">
                      {(["all", ...REFERRAL_STATUS_OPTIONS] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setReferralStatusFilter(status)}
                          className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                            referralStatusFilter === status
                              ? "bg-white text-ink-900 shadow-sm"
                              : "text-ink-500 hover:text-ink-900"
                          }`}
                        >
                          {status === "all" ? "All" : formatStatusLabel(status)}{" "}
                          <span className="text-ink-400">({referralCounts[status]})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {referrals.length === 0 ? (
                    <p className="text-sm text-ink-500 p-4 sm:p-6">
                      No referrals yet.
                    </p>
                  ) : filteredReferrals.length === 0 ? (
                    <p className="text-sm text-ink-500 p-6">
                      No referrals match your filters.{" "}
                      <button
                        type="button"
                        onClick={() => setReferralStatusFilter("all")}
                        className="text-accent font-semibold hover:underline"
                      >
                        Clear filters
                      </button>
                    </p>
                  ) : (
                    <>
                      <div className="md:hidden divide-y divide-warm-100">
                        {paginatedReferrals.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setSelectedReferral(r)}
                            className="w-full text-left p-4 space-y-2 hover:bg-warm-50 transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-semibold text-ink-900 truncate">{r.referrer_name}</p>
                                <p className="text-xs text-ink-500 truncate">{r.referrer_email}</p>
                              </div>
                              <span
                                className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${REFERRAL_STATUS_STYLE[r.status] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                              >
                                {formatStatusLabel(r.status)}
                              </span>
                            </div>
                            <p className="text-xs text-ink-500">
                              Referred {r.client_name} · {r.client_phone}
                            </p>
                            <p className="text-xs text-ink-500">
                              {new Date(r.created_at).toLocaleDateString("en-GB")}
                            </p>
                          </button>
                        ))}
                      </div>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm min-w-[720px]">
                          <thead className="bg-warm-100/50">
                            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500">
                              <th className="py-3 px-4 lg:px-6 font-semibold">Referrer</th>
                              <th className="py-3 px-4 font-semibold">Client</th>
                              <th className="py-3 px-4 font-semibold">Status</th>
                              <th className="py-3 px-4 font-semibold">Submitted</th>
                              <th className="py-3 px-4 font-semibold" />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-warm-100">
                            {paginatedReferrals.map((r) => (
                              <tr key={r.id} className="hover:bg-warm-50 transition">
                                <td className="py-4 px-4 lg:px-6 min-w-0">
                                  <p className="font-semibold text-ink-900">{r.referrer_name}</p>
                                  <p className="text-xs text-ink-500 truncate max-w-[200px]">{r.referrer_email}</p>
                                </td>
                                <td className="py-4 px-4 min-w-0">
                                  <p className="font-semibold text-ink-900">{r.client_name}</p>
                                  <p className="text-xs text-ink-500 truncate max-w-[200px]">
                                    {r.client_email} · {r.client_phone}
                                  </p>
                                </td>
                                <td className="py-4 px-4">
                                  <Select
                                    value={r.status}
                                    onValueChange={(v) => requestReferralStatusChange(r, v)}
                                  >
                                    <SelectTrigger
                                      className={`h-8 w-36 text-xs font-semibold rounded-full border ${REFERRAL_STATUS_STYLE[r.status] || "bg-warm-100 text-ink-600 border-warm-200"}`}
                                    >
                                      <SelectValue>{formatStatusLabel(r.status)}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {REFERRAL_STATUS_OPTIONS.map((s) => (
                                        <SelectItem key={s} value={s}>
                                          {formatStatusLabel(s)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="py-4 px-4 text-ink-500 whitespace-nowrap">
                                  {new Date(r.created_at).toLocaleDateString("en-GB")}
                                </td>
                                <td className="py-4 px-4 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedReferral(r)}
                                    className="text-xs font-semibold text-accent hover:underline"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {referralTotalPages > 1 && (
                        <div className="flex items-center justify-between gap-2 border-t border-warm-100 px-4 sm:px-6 py-3">
                          <p className="text-xs text-ink-500">
                            Page {referralPage} of {referralTotalPages}
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={referralPage === 1}
                              onClick={() => setReferralPage((p) => p - 1)}
                              className="h-8 px-3 rounded-lg border border-warm-200 text-xs font-semibold text-ink-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <button
                              type="button"
                              disabled={referralPage === referralTotalPages}
                              onClick={() => setReferralPage((p) => p + 1)}
                              className="h-8 px-3 rounded-lg border border-warm-200 text-xs font-semibold text-ink-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}

              {tab === "contact" && (
                <section className="bg-white rounded-2xl border border-warm-200 shadow-sm min-w-0">
                  <div className="p-4 sm:p-6 border-b border-warm-100 flex flex-col gap-4">
                    <div className="min-w-0">
                      <h2 className="font-display text-base font-extrabold text-ink-900">
                        Contact messages{" "}
                        <span className="text-ink-500 font-medium">
                          ({filteredContactMessages.length}
                          {filteredContactMessages.length !== generalContactMessages.length
                            ? ` of ${generalContactMessages.length}`
                            : ""}
                          )
                        </span>
                      </h2>
                      <p className="text-xs text-ink-500 mt-0.5">
                        Submissions from /contact — Send us a message form
                      </p>
                    </div>
                    {contactTopics.length > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                        <Select value={contactTopicFilter} onValueChange={setContactTopicFilter}>
                          <SelectTrigger className="w-full sm:w-48 h-9 border-warm-200 text-sm">
                            <SelectValue placeholder="All topics" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All topics</SelectItem>
                            {contactTopics.map((topic) => (
                              <SelectItem key={topic} value={topic}>
                                {topic}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  {generalContactMessages.length === 0 ? (
                    <p className="text-sm text-ink-500 p-4 sm:p-6">
                      No contact messages yet.
                    </p>
                  ) : filteredContactMessages.length === 0 ? (
                    <p className="text-sm text-ink-500 p-6">
                      No messages match your filters.{" "}
                      <button
                        type="button"
                        onClick={() => setContactTopicFilter("all")}
                        className="text-accent font-semibold hover:underline"
                      >
                        Clear filters
                      </button>
                    </p>
                  ) : (
                    <>
                      <div className="md:hidden divide-y divide-warm-100">
                        {paginatedContactMessages.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedMessage(m)}
                            className="w-full text-left p-4 space-y-2 hover:bg-warm-50 transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-semibold text-ink-900 truncate">{m.name}</p>
                                <p className="text-xs text-ink-500 truncate">{m.email}</p>
                              </div>
                              <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border bg-warm-100 text-ink-600 border-warm-200">
                                {m.topic || "—"}
                              </span>
                            </div>
                            <p className="text-xs text-ink-500">
                              {new Date(m.created_at).toLocaleDateString("en-GB")}
                            </p>
                          </button>
                        ))}
                      </div>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm min-w-[640px]">
                          <thead className="bg-warm-100/50">
                            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-500">
                              <th className="py-3 px-4 lg:px-6 font-semibold">Sender</th>
                              <th className="py-3 px-4 font-semibold">Topic</th>
                              <th className="py-3 px-4 font-semibold">Submitted</th>
                              <th className="py-3 px-4 font-semibold" />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-warm-100">
                            {paginatedContactMessages.map((m) => (
                              <tr key={m.id} className="hover:bg-warm-50 transition">
                                <td className="py-4 px-4 lg:px-6 min-w-0">
                                  <p className="font-semibold text-ink-900">{m.name}</p>
                                  <p className="text-xs text-ink-500 truncate max-w-[200px]">{m.email}</p>
                                </td>
                                <td className="py-4 px-4 text-ink-700">{m.topic || "—"}</td>
                                <td className="py-4 px-4 text-ink-500 whitespace-nowrap">
                                  {new Date(m.created_at).toLocaleDateString("en-GB")}
                                </td>
                                <td className="py-4 px-4 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMessage(m)}
                                    className="text-xs font-semibold text-accent hover:underline"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {contactTotalPages > 1 && (
                        <div className="flex items-center justify-between gap-2 border-t border-warm-100 px-4 sm:px-6 py-3">
                          <p className="text-xs text-ink-500">
                            Page {contactPage} of {contactTotalPages}
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={contactPage === 1}
                              onClick={() => setContactPage((p) => p - 1)}
                              className="h-8 px-3 rounded-lg border border-warm-200 text-xs font-semibold text-ink-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <button
                              type="button"
                              disabled={contactPage === contactTotalPages}
                              onClick={() => setContactPage((p) => p + 1)}
                              className="h-8 px-3 rounded-lg border border-warm-200 text-xs font-semibold text-ink-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}
            </>
          )}
        </main>
      </div>

      <Dialog
        open={Boolean(selectedPartnership)}
        onOpenChange={(open) => !open && setSelectedPartnership(null)}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedPartnership && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPartnership.name}</DialogTitle>
                <DialogDescription>
                  Submitted {new Date(selectedPartnership.created_at).toLocaleString("en-GB")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                      Partner type
                    </span>
                    <p className="font-medium text-ink-900 mt-1">
                      {partnershipTypeFromTopic(selectedPartnership.topic)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                      Company
                    </span>
                    <p className="font-medium text-ink-900 mt-1">
                      {companyFromPartnershipMessage(selectedPartnership.message)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                      Email
                    </span>
                    <p className="font-medium text-ink-900 mt-1 break-all">{selectedPartnership.email}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                      Phone
                    </span>
                    <p className="font-medium text-ink-900 mt-1">{selectedPartnership.phone || "—"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                    Message
                  </span>
                  <p className="text-sm text-ink-700 mt-2 bg-warm-50 rounded-xl border border-warm-100 p-4 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                    {partnershipMessageBody(selectedPartnership)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">
                    Status
                  </span>
                  <Select
                    value={partnershipStatus(selectedPartnership)}
                    onValueChange={(v) => requestPartnershipStatusChange(selectedPartnership, v)}
                  >
                    <SelectTrigger className="w-full sm:w-48 h-10 border-warm-200">
                      <SelectValue>{formatStatusLabel(partnershipStatus(selectedPartnership))}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {PARTNERSHIP_STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {formatStatusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedReferral)}
        onOpenChange={(open) => !open && setSelectedReferral(null)}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedReferral && (
            <>
              <DialogHeader>
                <DialogTitle>Referral from {selectedReferral.referrer_name}</DialogTitle>
                <DialogDescription>
                  Submitted {new Date(selectedReferral.created_at).toLocaleString("en-GB")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                    Referrer
                  </span>
                  <p className="font-medium text-ink-900 mt-1">{selectedReferral.referrer_name}</p>
                  <p className="text-sm text-ink-700 break-all">{selectedReferral.referrer_email}</p>
                </div>
                <div className="border-t border-warm-100 pt-4">
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                    Client
                  </span>
                  <p className="font-medium text-ink-900 mt-1">{selectedReferral.client_name}</p>
                  <p className="text-sm text-ink-700 break-all">{selectedReferral.client_email}</p>
                  <p className="text-sm text-ink-700">{selectedReferral.client_phone}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">
                    Status
                  </span>
                  <Select
                    value={selectedReferral.status}
                    onValueChange={(v) => requestReferralStatusChange(selectedReferral, v)}
                  >
                    <SelectTrigger className="w-full sm:w-48 h-10 border-warm-200">
                      <SelectValue>{formatStatusLabel(selectedReferral.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {REFERRAL_STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {formatStatusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedEnquiry)}
        onOpenChange={(open) => !open && setSelectedEnquiry(null)}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedEnquiry && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEnquiry.name}</DialogTitle>
                <DialogDescription>
                  Submitted {new Date(selectedEnquiry.created_at).toLocaleString("en-GB")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                      Email
                    </span>
                    <p className="font-medium text-ink-900 mt-1 break-all">{selectedEnquiry.email}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                      Phone
                    </span>
                    <p className="font-medium text-ink-900 mt-1">{selectedEnquiry.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                      Postcode
                    </span>
                    <p className="font-medium text-ink-900 mt-1">{selectedEnquiry.postcode}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                      Project
                    </span>
                    <p className="font-medium text-ink-900 mt-1">{selectedEnquiry.project_type}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                    Description
                  </span>
                  <p className="text-sm text-ink-700 mt-2 bg-warm-50 rounded-xl border border-warm-100 p-4 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                    {selectedEnquiry.description}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">
                    Status
                  </span>
                  <Select
                    value={selectedEnquiry.status}
                    onValueChange={(v) => requestEnquiryStatusChange(selectedEnquiry, v)}
                  >
                    <SelectTrigger className="w-full sm:w-48 h-10 border-warm-200">
                      <SelectValue>{formatStatusLabel(selectedEnquiry.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ENQUIRY_STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {formatStatusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedMessage)}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.name}</DialogTitle>
                <DialogDescription>
                  Submitted {new Date(selectedMessage.created_at).toLocaleString("en-GB")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                      Email
                    </span>
                    <p className="font-medium text-ink-900 mt-1 break-all">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                      Phone
                    </span>
                    <p className="font-medium text-ink-900 mt-1">{selectedMessage.phone || "—"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                    Topic
                  </span>
                  <p className="font-medium text-ink-900 mt-1">{selectedMessage.topic || "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                    Message
                  </span>
                  <p className="text-sm text-ink-700 mt-2 bg-warm-50 rounded-xl border border-warm-100 p-4 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                    {messageBody(selectedMessage.message)}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        open={Boolean(confirm)}
        onOpenChange={(open) => {
          if (!open && !confirmLoading) setConfirm(null);
        }}
        title={confirm?.title ?? ""}
        description={confirm?.description ?? ""}
        confirmLabel={confirm?.confirmLabel ?? "Confirm"}
        variant={confirm?.variant}
        loading={confirmLoading}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
