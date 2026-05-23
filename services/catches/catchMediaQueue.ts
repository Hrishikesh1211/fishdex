import AsyncStorage from "@react-native-async-storage/async-storage";

import type { CatchDraftPhoto } from "./catchDraftStorage";

export type PendingCatchMediaUpload = CatchDraftPhoto & {
  id: string;
  catchId: string;
  userId: string;
  queuedAt: string;
};

const queueKey = (userId: string) => `fishquest.pendingCatchMedia.${userId}`;

export async function queuePendingCatchMediaUpload({
  catchId,
  photo,
  userId,
}: {
  catchId: string;
  photo: CatchDraftPhoto;
  userId: string;
}) {
  const currentQueue = await loadPendingCatchMediaUploads(userId);
  const queued: PendingCatchMediaUpload = {
    ...photo,
    catchId,
    id: `${catchId}:${Date.now()}`,
    queuedAt: new Date().toISOString(),
    userId,
  };

  await AsyncStorage.setItem(queueKey(userId), JSON.stringify([...currentQueue, queued]));

  return queued;
}

export async function loadPendingCatchMediaUploads(userId: string) {
  const rawQueue = await AsyncStorage.getItem(queueKey(userId));

  if (!rawQueue) {
    return [];
  }

  try {
    return JSON.parse(rawQueue) as PendingCatchMediaUpload[];
  } catch {
    await AsyncStorage.removeItem(queueKey(userId));
    return [];
  }
}
