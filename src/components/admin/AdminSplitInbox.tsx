import { type ReactNode } from "react";
import { MessageSquare } from "lucide-react";
import type { ContactMessage } from "@/lib/adminInbox";
import { AdminDetailBack } from "@/components/admin/AdminDetailBack";

type Props = {
  listTitle: string;
  listSubtitle: string;
  emptyText: string;
  messages: ContactMessage[];
  selected: ContactMessage | null;
  onSelect: (m: ContactMessage | null) => void;
  renderListMeta: (m: ContactMessage) => ReactNode;
  renderDetailExtra: (m: ContactMessage) => ReactNode;
  getMessageBody: (m: ContactMessage) => string;
  headerExtra?: ReactNode;
  renderListBadge?: (m: ContactMessage) => ReactNode;
  renderDetailHeaderExtra?: (m: ContactMessage) => ReactNode;
};

export function AdminSplitInbox({
  listTitle,
  listSubtitle,
  emptyText,
  messages,
  selected,
  onSelect,
  renderListMeta,
  renderDetailExtra,
  getMessageBody,
  headerExtra,
  renderListBadge,
  renderDetailHeaderExtra,
}: Props) {
  const showMobileDetail = Boolean(selected);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <section
        className={`lg:col-span-1 bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden ${
          showMobileDetail ? "max-lg:hidden" : ""
        }`}
      >
        <div className="p-4 border-b border-warm-100">
          <h2 className="font-display text-sm font-extrabold text-ink-900">{listTitle}</h2>
          <p className="text-xs text-ink-500 mt-1">{listSubtitle}</p>
          {headerExtra && <div className="mt-3">{headerExtra}</div>}
        </div>
        <div className="max-h-[min(50vh,28rem)] lg:max-h-[calc(100vh-280px)] overflow-y-auto divide-y divide-warm-100">
          {messages.length === 0 ? (
            <p className="text-sm text-ink-500 p-4">{emptyText}</p>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelect(m)}
                className={`w-full text-left p-4 transition ${
                  selected?.id === m.id
                    ? "bg-accent/10 border-l-2 border-l-accent"
                    : "hover:bg-warm-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-ink-900 text-sm truncate min-w-0">{m.name}</p>
                  {renderListBadge?.(m)}
                </div>
                <p className="text-xs text-ink-500 truncate">{m.email}</p>
                {renderListMeta(m)}
              </button>
            ))
          )}
        </div>
      </section>

      <section
        className={`lg:col-span-2 ${!showMobileDetail ? "max-lg:hidden" : ""}`}
      >
        {selected ? (
          <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-4 sm:p-6">
            <AdminDetailBack onBack={() => onSelect(null)} />
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-ink-900 break-words min-w-0">
                {selected.name}
              </h2>
              {renderDetailHeaderExtra?.(selected)}
            </div>
            {renderDetailExtra(selected)}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
              <div className="min-w-0">
                <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                  Email
                </span>
                <p className="font-medium text-ink-900 mt-1 break-all">{selected.email}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                  Phone
                </span>
                <p className="font-medium text-ink-900 mt-1">{selected.phone || "—"}</p>
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                Message
              </span>
              <p className="text-sm text-ink-700 mt-2 bg-warm-50 rounded-xl border border-warm-100 p-4 whitespace-pre-wrap break-words">
                {getMessageBody(selected)}
              </p>
            </div>
            <p className="text-xs text-ink-500 mt-6">
              Submitted {new Date(selected.created_at).toLocaleString("en-GB")}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-8 sm:p-12 text-center max-lg:hidden">
            <MessageSquare className="w-12 h-12 text-ink-300 mx-auto mb-3" />
            <p className="text-ink-500 text-sm">Select a message to view details</p>
          </div>
        )}
      </section>
    </div>
  );
}
