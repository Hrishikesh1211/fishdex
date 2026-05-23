import * as Crypto from "expo-crypto";
import * as ImageManipulator from "expo-image-manipulator";

import { getSupabaseClient } from "../../lib/supabase";
import type { CatchDraftPhoto } from "./catchDraftStorage";

export const CATCH_ORIGINALS_BUCKET = "catch-originals";
export const CATCH_THUMBNAILS_BUCKET = "catch-thumbnails";

export type CatchPhotoUploadStage =
  | "validating"
  | "compressing"
  | "uploading-original"
  | "uploading-thumbnail"
  | "saving-metadata"
  | "complete";

export type CatchPhotoUploadProgress = {
  stage: CatchPhotoUploadStage;
  percent: number;
};

export type UploadCatchPhotoResult =
  | {
      ok: true;
      mediaId: string;
      originalPath: string;
      thumbnailPath: string;
    }
  | {
      ok: false;
      errors: string[];
      retryable: true;
    };

type UploadCatchPhotoInput = {
  catchId: string;
  photo: CatchDraftPhoto;
  userId: string;
  onProgress?: (progress: CatchPhotoUploadProgress) => void;
};

const allowedSourceMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxSourceBytes = 12 * 1024 * 1024;
const maxOriginalBytes = 8 * 1024 * 1024;
const maxThumbnailBytes = 1024 * 1024;

export async function uploadCatchPhoto({
  catchId,
  onProgress,
  photo,
  userId,
}: UploadCatchPhotoInput): Promise<UploadCatchPhotoResult> {
  const mediaId = Crypto.randomUUID();
  const originalPath = `${userId}/${catchId}/${mediaId}.jpg`;
  const thumbnailPath = `${userId}/${catchId}/${mediaId}_thumb.jpg`;
  const uploadedObjects: Array<{ bucket: string; path: string }> = [];

  try {
    reportProgress(onProgress, "validating", 8);

    const validationErrors = validateSourcePhoto(photo);

    if (validationErrors.length > 0) {
      return { ok: false, errors: validationErrors, retryable: true };
    }

    reportProgress(onProgress, "compressing", 28);

    const compressed = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 1600 } }],
      {
        compress: 0.82,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    const thumbnail = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 480 } }],
      {
        compress: 0.72,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    const originalBlob = await uriToBlob(compressed.uri);
    const thumbnailBlob = await uriToBlob(thumbnail.uri);
    const blobErrors = validatePreparedBlobs(originalBlob, thumbnailBlob);

    if (blobErrors.length > 0) {
      return { ok: false, errors: blobErrors, retryable: true };
    }

    const supabase = getSupabaseClient();

    reportProgress(onProgress, "uploading-original", 50);

    const { error: originalUploadError } = await supabase.storage
      .from(CATCH_ORIGINALS_BUCKET)
      .upload(originalPath, originalBlob, {
        cacheControl: "31536000",
        contentType: "image/jpeg",
        upsert: false,
      });

    if (originalUploadError) {
      throw new Error(originalUploadError.message);
    }

    uploadedObjects.push({ bucket: CATCH_ORIGINALS_BUCKET, path: originalPath });
    reportProgress(onProgress, "uploading-thumbnail", 76);

    const { error: thumbnailUploadError } = await supabase.storage
      .from(CATCH_THUMBNAILS_BUCKET)
      .upload(thumbnailPath, thumbnailBlob, {
        cacheControl: "31536000",
        contentType: "image/jpeg",
        upsert: false,
      });

    if (thumbnailUploadError) {
      throw new Error(thumbnailUploadError.message);
    }

    uploadedObjects.push({ bucket: CATCH_THUMBNAILS_BUCKET, path: thumbnailPath });
    reportProgress(onProgress, "saving-metadata", 92);

    const { error: mediaError } = await supabase.from("catch_media").insert({
      catch_id: catchId,
      file_size_bytes: originalBlob.size,
      height: compressed.height,
      id: mediaId,
      media_type: "photo",
      mime_type: "image/jpeg",
      storage_bucket: CATCH_ORIGINALS_BUCKET,
      storage_path: originalPath,
      thumbnail_height: thumbnail.height,
      thumbnail_storage_bucket: CATCH_THUMBNAILS_BUCKET,
      thumbnail_storage_path: thumbnailPath,
      thumbnail_width: thumbnail.width,
      upload_status: "uploaded",
      user_id: userId,
      width: compressed.width,
    });

    if (mediaError) {
      throw new Error(mediaError.message);
    }

    reportProgress(onProgress, "complete", 100);

    return {
      ok: true,
      mediaId,
      originalPath,
      thumbnailPath,
    };
  } catch (error) {
    await removeUploadedObjects(uploadedObjects);

    return {
      ok: false,
      errors: [error instanceof Error ? error.message : "Photo upload failed. Try again."],
      retryable: true,
    };
  }
}

function validateSourcePhoto(photo: CatchDraftPhoto) {
  const errors: string[] = [];
  const mimeType = normalizeMimeType(photo.mimeType) ?? inferMimeTypeFromUri(photo.uri);

  if (photo.fileSize != null && photo.fileSize > maxSourceBytes) {
    errors.push("Choose a photo under 12 MB before compression.");
  }

  if (mimeType && !allowedSourceMimeTypes.has(mimeType)) {
    errors.push("Choose a JPEG, PNG, or WebP image.");
  }

  if (!photo.uri) {
    errors.push("Choose a valid photo before uploading.");
  }

  return errors;
}

function validatePreparedBlobs(originalBlob: Blob, thumbnailBlob: Blob) {
  const errors: string[] = [];

  if (originalBlob.size <= 0) {
    errors.push("The selected photo could not be prepared for upload.");
  }

  if (originalBlob.size > maxOriginalBytes) {
    errors.push("The compressed photo is still over 8 MB. Choose a smaller image.");
  }

  if (thumbnailBlob.size <= 0 || thumbnailBlob.size > maxThumbnailBytes) {
    errors.push("The thumbnail could not be prepared for upload.");
  }

  return errors;
}

async function uriToBlob(uri: string) {
  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error("Unable to read the selected photo from this device.");
  }

  return response.blob();
}

async function removeUploadedObjects(objects: Array<{ bucket: string; path: string }>) {
  const supabase = getSupabaseClient();

  await Promise.allSettled(
    objects.map(({ bucket, path }) => supabase.storage.from(bucket).remove([path])),
  );
}

function reportProgress(
  onProgress: UploadCatchPhotoInput["onProgress"],
  stage: CatchPhotoUploadStage,
  percent: number,
) {
  onProgress?.({ stage, percent });
}

function normalizeMimeType(value?: string | null) {
  return value ? value.toLowerCase().trim() : null;
}

function inferMimeTypeFromUri(uri: string) {
  const lowerUri = uri.toLowerCase();

  if (lowerUri.endsWith(".jpg") || lowerUri.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (lowerUri.endsWith(".png")) {
    return "image/png";
  }

  if (lowerUri.endsWith(".webp")) {
    return "image/webp";
  }

  return null;
}
