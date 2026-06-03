import { ArrowLeft } from "lucide-react";

type Props = {
  onBack: () => void;
  label?: string;
};

export function AdminDetailBack({ onBack, label = "Back to list" }: Props) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="lg:hidden inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline mb-4 -mt-1"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
