import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

import { createCatch, type CreateCatchInput } from "./catchService";
import type { CatchDraftPhoto } from "./catchDraftStorage";
import { queuePendingCatchMediaUpload } from "./catchMediaQueue";
import { uploadCatchPhoto } from "./catchMediaUploadService";

export type QueuedCatchSyncStatus = "pending" | "syncing" | "synced" | "failed";

export type QueuedCatchDraft = {
  id: string;
  catchId: string;
  userId: string;
  catchInput: CreateCatchInput;
  photo: CatchDraftPhoto | null;
  status: QueuedCatchSyncStatus;
  attempts: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
};

export type CatchSyncSummary = {
  pending: number;
  syncing: number;
  synced: number;
  failed: number;
  total: number;
  latestStatus: QueuedCatchSyncStatus | null;
  latestError: string | null;
};

export type SyncQueuedCatchDraftsResult = {
  synced: number;
  failed: number;
  remaining: number;
  errors: string[];
};

type EnqueueCatchDraftInput = {
  catchInput: CreateCatchInput;
  photo: CatchDraftPhoto | null;
};

const queueKey = (userId: string) => `fishquest.catchSyncQueue.${userId}`;

export async function enqueueCatchDraftForSync({
  catchInput,
  photo,
}: EnqueueCatchDraftInput) {
  const now = new Date().toISOString();
  const catchId = catchInput.id ?? Crypto.randomUUID();
  const queuedDraft: QueuedCatchDraft = {
    attempts: 0,
    catchId,
    catchInput: {
      ...catchInput,
      id: catchId,
    },
    createdAt: now,
    id: catchId,
    lastError: null,
    photo,
    status: "pending",
    syncedAt: null,
    updatedAt: now,
    userId: catchInput.userId,
  };
  const queue = await loadQueuedCatchDrafts(catchInput.userId);
  const existingIndex = queue.findIndex((item) => item.catchId === catchId);
  const nextQueue =
    existingIndex >= 0
      ? queue.map((item, index) => (index === existingIndex ? queuedDraft : item))
      : [...queue, queuedDraft];

  await saveQueue(catchInput.userId, nextQueue);

  return queuedDraft;
}

export async function loadQueuedCatchDrafts(userId: string) {
  const rawQueue = await AsyncStorage.getItem(queueKey(userId));

  if (!rawQueue) {
    return [];
  }

  try {
    return JSON.parse(rawQueue) as QueuedCatchDraft[];
  } catch {
    await AsyncStorage.removeItem(queueKey(userId));
    return [];
  }
}

export async function summarizeCatchSyncQueue(userId: string): Promise<CatchSyncSummary> {
  return summarizeQueue(await loadQueuedCatchDrafts(userId));
}

export async function syncQueuedCatchDrafts(userId: string): Promise<SyncQueuedCatchDraftsResult> {
  const queue = await loadQueuedCatchDrafts(userId);
  const candidates = queue.filter((item) => item.status === "pending" || item.status === "failed");
  const errors: string[] = [];
  let synced = 0;
  let failed = 0;

  for (const candidate of candidates) {
    await updateQueuedCatchDraft(userId, candidate.catchId, {
      attempts: candidate.attempts + 1,
      lastError: null,
      status: "syncing",
    });

    const syncResult = await safeSyncQueuedCatchDraft(candidate);

    if (syncResult.ok) {
      synced += 1;
      await removeQueuedCatchDraft(userId, candidate.catchId);
      continue;
    }

    failed += 1;
    errors.push(syncResult.error);
    await updateQueuedCatchDraft(userId, candidate.catchId, {
      lastError: syncResult.error,
      status: "failed",
    });
  }

  const remaining = (await loadQueuedCatchDrafts(userId)).filter(
    (item) => item.status !== "synced",
  ).length;

  return { errors, failed, remaining, synced };
}

export async function syncQueuedCatchDraftById(userId: string, catchId: string) {
  const queue = await loadQueuedCatchDrafts(userId);
  const queuedDraft = queue.find((item) => item.catchId === catchId);

  if (!queuedDraft) {
    return { synced: 0, failed: 0, remaining: queue.length, errors: [] };
  }

  await updateQueuedCatchDraft(userId, catchId, {
    attempts: queuedDraft.attempts + 1,
    lastError: null,
    status: "syncing",
  });

  const syncResult = await safeSyncQueuedCatchDraft(queuedDraft);

  if (syncResult.ok) {
    await removeQueuedCatchDraft(userId, catchId);
    return {
      synced: 1,
      failed: 0,
      remaining: (await loadQueuedCatchDrafts(userId)).length,
      errors: [],
    };
  }

  await updateQueuedCatchDraft(userId, catchId, {
    lastError: syncResult.error,
    status: "failed",
  });

  return {
    synced: 0,
    failed: 1,
    remaining: (await loadQueuedCatchDrafts(userId)).length,
    errors: [syncResult.error],
  };
}

async function syncQueuedCatchDraft(queuedDraft: QueuedCatchDraft) {
  const catchResult = await createCatch(queuedDraft.catchInput);

  if (!catchResult.ok) {
    return { ok: false as const, error: catchResult.errors[0] ?? "Catch sync failed." };
  }

  if (!queuedDraft.photo) {
    return { ok: true as const };
  }

  const uploadResult = await uploadCatchPhoto({
    catchId: catchResult.catchId,
    photo: queuedDraft.photo,
    userId: queuedDraft.userId,
  });

  if (uploadResult.ok) {
    return { ok: true as const };
  }

  await queuePendingCatchMediaUpload({
    catchId: catchResult.catchId,
    photo: queuedDraft.photo,
    userId: queuedDraft.userId,
  });

  return {
    ok: false as const,
    error: uploadResult.errors[0] ?? "Photo upload failed. Try again.",
  };
}

async function safeSyncQueuedCatchDraft(queuedDraft: QueuedCatchDraft) {
  try {
    return await syncQueuedCatchDraft(queuedDraft);
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Catch sync failed. Try again.",
    };
  }
}

async function updateQueuedCatchDraft(
  userId: string,
  catchId: string,
  update: Partial<Pick<QueuedCatchDraft, "attempts" | "lastError" | "status" | "syncedAt">>,
) {
  const now = new Date().toISOString();
  const queue = await loadQueuedCatchDrafts(userId);

  await saveQueue(
    userId,
    queue.map((item) =>
      item.catchId === catchId
        ? {
            ...item,
            ...update,
            updatedAt: now,
          }
        : item,
    ),
  );
}

async function removeQueuedCatchDraft(userId: string, catchId: string) {
  const queue = await loadQueuedCatchDrafts(userId);
  await saveQueue(
    userId,
    queue.filter((item) => item.catchId !== catchId),
  );
}

async function saveQueue(userId: string, queue: QueuedCatchDraft[]) {
  await AsyncStorage.setItem(queueKey(userId), JSON.stringify(queue));
}

function summarizeQueue(queue: QueuedCatchDraft[]): CatchSyncSummary {
  const latest = [...queue].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? null;

  return {
    failed: queue.filter((item) => item.status === "failed").length,
    latestError: latest?.lastError ?? null,
    latestStatus: latest?.status ?? null,
    pending: queue.filter((item) => item.status === "pending").length,
    synced: queue.filter((item) => item.status === "synced").length,
    syncing: queue.filter((item) => item.status === "syncing").length,
    total: queue.length,
  };
}
