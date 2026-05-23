import AsyncStorage from "@react-native-async-storage/async-storage";

export type CatchDraftPhoto = {
  uri: string;
  width?: number;
  height?: number;
  mimeType?: string | null;
  fileSize?: number | null;
};

export type CatchDraft = {
  speciesId: string | null;
  caughtDate: string;
  caughtTime: string;
  lengthValue: string;
  lengthUnit: "in" | "cm";
  weightValue: string;
  weightUnit: "lb" | "oz" | "kg" | "g";
  notes: string;
  privacy: "private" | "unlisted" | "public";
  photo: CatchDraftPhoto | null;
  updatedAt: string;
};

const draftKey = (userId: string) => `fishquest.catchDraft.${userId}`;

export async function loadCatchDraft(userId: string) {
  const rawDraft = await AsyncStorage.getItem(draftKey(userId));

  if (!rawDraft) {
    return null;
  }

  try {
    return JSON.parse(rawDraft) as CatchDraft;
  } catch {
    await clearCatchDraft(userId);
    return null;
  }
}

export async function saveCatchDraft(userId: string, draft: CatchDraft) {
  await AsyncStorage.setItem(draftKey(userId), JSON.stringify(draft));
}

export async function clearCatchDraft(userId: string) {
  await AsyncStorage.removeItem(draftKey(userId));
}
