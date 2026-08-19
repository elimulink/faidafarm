import { useState } from "react";
import { fileToBase64 } from "../fieldStorage/fieldMedia";

export default function usePhotoCapture() {
  const [photos, setPhotos] = useState([]);

  async function addPhoto(file) {
    if (!file) {
      return null;
    }

    const base64 = await fileToBase64(file);
    const photo = {
      id: `PHOTO-${Date.now()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: base64,
      base64,
      capturedAt: new Date().toISOString(),
    };

    // Base64 photos are prototype-only and can become large quickly.
    setPhotos((current) => [...current, photo]);
    return photo;
  }

  function removePhoto(index) {
    setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index));
  }

  function clearPhotos() {
    setPhotos([]);
  }

  return { photos, addPhoto, removePhoto, clearPhotos };
}
