import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import { getHeroSearchSuggestions } from "@/data/services";

type ListPosition = {
  top: number;
  left: number;
  width: number;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onPickSuggestion: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
};

export function HeroSearchBox({
  value,
  onChange,
  onSearch,
  onPickSuggestion,
  onOpenChange,
}: Props) {
  const listId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [listPosition, setListPosition] = useState<ListPosition | null>(null);

  const suggestions = useMemo(() => getHeroSearchSuggestions(value), [value]);
  const showList = open && suggestions.length > 0;

  const updateListPosition = useCallback(() => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    setListPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    onOpenChange?.(showList);
  }, [showList, onOpenChange]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [value, suggestions.length]);

  useEffect(() => {
    if (!showList) {
      setListPosition(null);
      return;
    }
    updateListPosition();
    window.addEventListener("resize", updateListPosition);
    window.addEventListener("scroll", updateListPosition, true);
    return () => {
      window.removeEventListener("resize", updateListPosition);
      window.removeEventListener("scroll", updateListPosition, true);
    };
  }, [showList, updateListPosition]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (formRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const pickSuggestion = (suggestionValue: string) => {
    onChange(suggestionValue);
    setOpen(false);
    onPickSuggestion(suggestionValue);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (showList && activeIndex >= 0 && suggestions[activeIndex]) {
      pickSuggestion(suggestions[activeIndex].value);
      return;
    }
    setOpen(false);
    onSearch();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!showList) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      pickSuggestion(suggestions[activeIndex].value);
    }
  };

  const suggestionList =
    showList && listPosition
      ? createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            style={{
              position: "fixed",
              top: listPosition.top,
              left: listPosition.left,
              width: listPosition.width,
              zIndex: 9999,
            }}
            className="max-h-56 overflow-y-auto rounded-2xl border border-warm-200 bg-white py-1.5 shadow-[0_16px_48px_rgba(15,23,42,0.18)]"
          >
            {suggestions.map((item, index) => (
              <li key={`${item.value}-${index}`} role="presentation">
                <button
                  type="button"
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={activeIndex === index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => pickSuggestion(item.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    activeIndex === index
                      ? "bg-accent/15 text-ink-900 font-medium"
                      : "text-ink-800 hover:bg-warm-50"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )
      : null;

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="group relative flex w-full max-w-lg items-stretch rounded-full border-2 border-oak-500 bg-white shadow-soft transition-all hover:border-oak-600 hover:shadow-lifted focus-within:border-oak-600"
        role="search"
      >
        <div className="flex min-w-0 flex-1 items-center pl-4 sm:pl-5">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground sm:mr-3" aria-hidden />
          <input
            type="search"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="What do you need? e.g. kitchen renovation"
            className="min-w-0 flex-1 bg-transparent py-3 text-xs text-foreground outline-none placeholder:text-muted-foreground sm:py-4 sm:text-sm"
            role="combobox"
            aria-expanded={showList}
            aria-controls={showList ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              showList && activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
            }
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-r-full bg-accent px-4 py-3 text-xs font-semibold text-accent-foreground transition-colors group-hover:bg-accent/90 sm:px-5 sm:py-4 sm:text-sm"
        >
          Search
        </button>
      </form>
      {suggestionList}
    </>
  );
}
