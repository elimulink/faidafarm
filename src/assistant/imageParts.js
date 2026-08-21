// Turns an attached photo into something the model can read.
//
// A phone camera writes 3-5 MB per shot. Uploading that raw over a field 3G
// connection is slow enough that a farmer gives up, and it buys nothing: the
// model does not see more disease in more pixels. Downscaling to 1024px costs a
// fraction of a second on the handset and turns megabytes into ~150 KB.
//
// JPEG rather than PNG deliberately - these are photographs of leaves, not
// screenshots, and PNG would undo most of the saving.

const MAX_EDGE = 1024;
const QUALITY = 0.8;

// A hard ceiling after encoding, in case an image resists compression. Gemini
// accepts far more, but a farmer's bundle should not pay for it.
const MAX_BYTES = 1_500_000;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    image.src = url;
  });
}

function scaled(width, height) {
  const longest = Math.max(width, height);
  if (longest <= MAX_EDGE) {
    return { width, height };
  }
  const ratio = MAX_EDGE / longest;
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
}

/**
 * Reads one image file as a downscaled base64 payload.
 *
 * @returns {Promise<{mimeType: string, data: string}|null>} null when the file
 *   is not an image or cannot be decoded - a failed photo must not fail the
 *   whole question, which may stand on its own text.
 */
export async function toImagePart(file) {
  if (!file || !String(file.type || "").startsWith("image/")) {
    return null;
  }

  try {
    const image = await loadImage(file);
    const { width, height } = scaled(image.naturalWidth, image.naturalHeight);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(image, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
    const data = dataUrl.slice(dataUrl.indexOf(",") + 1);

    // base64 is 4 characters per 3 bytes.
    if ((data.length * 3) / 4 > MAX_BYTES) {
      return null;
    }

    return { mimeType: "image/jpeg", data };
  } catch {
    return null;
  }
}

/** Converts every image in a list, dropping the ones that fail. */
export async function toImageParts(attachments = []) {
  const parts = await Promise.all(
    attachments.filter((item) => item?.isImage && item.file).map((item) => toImagePart(item.file))
  );
  return parts.filter(Boolean);
}
