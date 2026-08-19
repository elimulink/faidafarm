import { useEffect, useRef } from "react";
import { Send, Square } from "lucide-react";

const MAX_TEXTAREA_HEIGHT = 176;

// Ported from ElimuLink's autoResizeTextarea: grow with the content up to a
// ceiling, then scroll inside the field.
function autoResizeTextarea(element, maxHeight = MAX_TEXTAREA_HEIGHT) {
  if (!element) {
    return;
  }

  element.style.height = "auto";
  const next = Math.min(element.scrollHeight, maxHeight);
  element.style.height = `${next}px`;
  element.style.overflowY = element.scrollHeight > maxHeight ? "auto" : "hidden";
}

export default function Composer({
  value,
  onChange,
  onSubmit,
  onStop,
  streaming = false,
  disabled = false,
  placeholder = "Ask about your farm, prices, weather or buyers",
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    autoResizeTextarea(textareaRef.current);
  }, [value]);

  const canSend = Boolean(value.trim()) && !streaming && !disabled;

  const submit = () => {
    if (!canSend) {
      return;
    }
    onSubmit?.();
  };

  // Enter sends, Shift+Enter breaks the line. On a touch keyboard Enter should
  // insert a newline instead, since there is a dedicated send button.
  const onKeyDown = (event) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      return;
    }

    event.preventDefault();
    submit();
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="border-t border-[#E7ECE5] bg-white px-3 pb-3 pt-2.5"
    >
      <div className="flex items-end gap-2 rounded-[22px] border border-[#E4EAE1] bg-white px-3 py-2 focus-within:border-[#2F8F46]">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="Message the assistant"
          className="max-h-44 flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-6 text-[#182118] outline-none placeholder:text-[#8A958A] disabled:opacity-60"
        />

        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            title="Stop"
            className="mb-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#E4EAE1] bg-white text-[#667164] transition hover:bg-[#F5F8F3]"
          >
            <Square size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            title="Send"
            className="mb-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#166534] text-white transition disabled:bg-[#CFD9CB]"
          >
            <Send size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
