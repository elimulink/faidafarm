// Chips for the attachments queued on the next question.
//
// Follows ElimuLink's AttachmentChipsTray: images show as a thumbnail, other
// files as an icon with name and size, each with a remove button.

import { FileText, X } from "lucide-react";
import { formatMediaSize } from "./useAttachments";

export default function AttachmentTray({ items = [], onRemove }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 px-3 pt-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative flex items-center gap-2 rounded-2xl border border-[#E4EAE1] bg-white p-1.5 pr-7"
        >
          {item.isImage ? (
            <img
              src={item.url}
              alt={item.name}
              className="h-11 w-11 rounded-xl object-cover"
            />
          ) : (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F6EE] text-[#2F8F46]">
                <FileText size={18} />
              </span>
              <span className="flex min-w-0 flex-col pr-1">
                <span className="max-w-[128px] truncate text-xs font-semibold text-[#182118]">
                  {item.name}
                </span>
                <span className="text-[10.5px] text-[#8A958A]">{formatMediaSize(item.size)}</span>
              </span>
            </>
          )}

          <button
            type="button"
            onClick={() => onRemove?.(item.id)}
            aria-label={`Remove ${item.name}`}
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF2EC] text-[#4C574D] transition hover:bg-[#DDE5D9]"
          >
            <X size={11} />
          </button>
        </div>
      ))}
    </div>
  );
}
