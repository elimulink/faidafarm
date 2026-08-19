import { useCallback, useEffect, useRef, useState } from "react";

// Attachments waiting to be sent with the next question.
//
// Modelled on ElimuLink's useCapturedMedia, trimmed to what a farmer needs: a
// photo of a crop, a picture from the gallery, or a document. Object URLs are
// revoked when an item is removed and on unmount, so previews do not leak.

const MAX_ATTACHMENTS = 6;
const MAX_BYTES = 12 * 1024 * 1024;

export function formatMediaSize(bytes) {
  const kb = Number(bytes || 0) / 1024;
  if (kb < 1) {
    return "under 1 KB";
  }
  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }
  return `${(kb / 1024).toFixed(1)} MB`;
}

function makeId(file) {
  return `att-${file.name}-${file.size}-${Math.random().toString(16).slice(2)}`;
}

function normalize(file, source) {
  return {
    id: makeId(file),
    name: file.name || (String(file.type || "").startsWith("image/") ? "photo.jpg" : "file"),
    size: file.size,
    type: file.type || "application/octet-stream",
    url: URL.createObjectURL(file),
    file,
    source,
    isImage: String(file.type || "").startsWith("image/"),
  };
}

export default function useAttachments() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const itemsRef = useRef(items);

  // Kept in an effect rather than assigned during render, and used only by the
  // unmount cleanup below so previews are revoked without leaking.
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(
    () => () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    },
    []
  );

  // Validation happens here rather than inside a setItems updater, so the
  // updater stays pure and the error message is derived once.
  const add = useCallback((fileList, source = "file") => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) {
      return;
    }

    setItems((current) => {
      const room = MAX_ATTACHMENTS - current.length;
      if (room <= 0) {
        return current;
      }

      const accepted = incoming
        .slice(0, room)
        .filter((file) => file.size <= MAX_BYTES)
        .map((file) => normalize(file, source));

      return accepted.length ? [...current, ...accepted] : current;
    });

    const tooLarge = incoming.find((file) => file.size > MAX_BYTES);
    if (tooLarge) {
      setError(`${tooLarge.name || "That file"} is larger than ${formatMediaSize(MAX_BYTES)}.`);
    } else {
      setError("");
    }
  }, []);

  const remove = useCallback((id) => {
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return current.filter((item) => item.id !== id);
    });
  }, []);

  // Called after a message is sent. The previews stay alive because the sent
  // message still renders them; only this pending list is cleared.
  const clear = useCallback(() => {
    setItems([]);
    setError("");
  }, []);

  return { items, error, add, remove, clear, max: MAX_ATTACHMENTS };
}
