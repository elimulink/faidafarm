import { useEffect, useRef, useState } from "react";
import { Camera, FileText, Image as ImageIcon, Plus, Send, Square, X } from "lucide-react";
import AttachmentTray from "./AttachmentTray";

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

const ATTACH_SOURCES = [
  {
    id: "camera",
    label: "Camera",
    hint: "Photograph a crop or pest",
    icon: Camera,
    accept: "image/*",
    // Hands the WebView straight to the camera app on Android.
    capture: "environment",
  },
  {
    id: "photo",
    label: "Gallery",
    hint: "Choose a saved photo",
    icon: ImageIcon,
    accept: "image/*",
    capture: "",
  },
  {
    id: "file",
    label: "Document",
    hint: "Receipt, record or PDF",
    icon: FileText,
    accept: "",
    capture: "",
  },
];

function AttachSheet({ open, onClose, onPick }) {
  if (!open) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close attachment options"
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-transparent"
      />
      <div
        role="dialog"
        aria-label="Attach"
        className="absolute bottom-full left-3 z-[70] mb-2 w-[268px] rounded-[22px] border border-[#E7ECE5] bg-white p-2 shadow-xl"
      >
        {ATTACH_SOURCES.map((source) => {
          const Icon = source.icon;
          return (
            <button
              key={source.id}
              type="button"
              onClick={() => onPick(source)}
              className="flex w-full items-center gap-3 rounded-[18px] px-2.5 py-2.5 text-left transition hover:bg-[#F5F8F3]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F1F6EE] text-[#2F8F46]">
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#182118]">{source.label}</span>
                <span className="block truncate text-xs text-[#8A958A]">{source.hint}</span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default function Composer({
  value,
  onChange,
  onSubmit,
  onStop,
  streaming = false,
  disabled = false,
  attachments = [],
  attachmentError = "",
  onAddFiles = null,
  onRemoveAttachment = null,
  placeholder = "Ask about your farm, prices, weather or buyers",
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const pendingSourceRef = useRef("file");
  const [attachOpen, setAttachOpen] = useState(false);

  useEffect(() => {
    autoResizeTextarea(textareaRef.current);
  }, [value]);

  const canSend = (Boolean(value.trim()) || attachments.length > 0) && !streaming && !disabled;

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

    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    event.preventDefault();
    submit();
  };

  // The accept and capture attributes are set per source before opening, which
  // is how ElimuLink drives one hidden input for camera, gallery and files.
  const pickSource = (source) => {
    setAttachOpen(false);
    pendingSourceRef.current = source.id;

    window.setTimeout(() => {
      const input = fileInputRef.current;
      if (!input) {
        return;
      }

      input.value = "";
      input.accept = source.accept;
      if (source.capture) {
        input.setAttribute("capture", source.capture);
      } else {
        input.removeAttribute("capture");
      }
      input.click();
    }, 0);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="relative border-t border-[#E7ECE5] bg-white pb-3"
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => {
          onAddFiles?.(event.target.files, pendingSourceRef.current);
          event.target.value = "";
        }}
      />

      <AttachmentTray items={attachments} onRemove={onRemoveAttachment} />

      {attachmentError ? (
        <p className="px-4 pt-2 text-xs font-semibold text-[#B7521F]">{attachmentError}</p>
      ) : null}

      <div className="px-3 pt-2.5">
        <div className="flex items-end gap-1.5 rounded-[22px] border border-[#E4EAE1] bg-white px-2 py-2 focus-within:border-[#2F8F46]">
          <button
            type="button"
            onClick={() => setAttachOpen((prev) => !prev)}
            disabled={disabled}
            aria-expanded={attachOpen}
            aria-label="Attach a photo or file"
            title="Attach"
            className={`mb-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition ${
              attachOpen
                ? "bg-[#F1F6EE] text-[#166534]"
                : "text-[#667164] hover:bg-[#F1F6EE] hover:text-[#166534]"
            } disabled:opacity-50`}
          >
            {attachOpen ? <X size={19} /> : <Plus size={20} />}
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            aria-label="Message the assistant"
            className="max-h-44 flex-1 resize-none bg-transparent py-2 text-[15px] leading-6 text-[#182118] outline-none placeholder:text-[#8A958A] disabled:opacity-60"
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
      </div>

      <AttachSheet open={attachOpen} onClose={() => setAttachOpen(false)} onPick={pickSource} />
    </form>
  );
}
