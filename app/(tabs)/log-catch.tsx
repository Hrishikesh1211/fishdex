import NetInfo from "@react-native-community/netinfo";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { ShellScreen } from "../../components/shell";
import {
  AppButton,
  AppText,
  AppTextInput,
  Card,
  EmptyState,
  LoadingState,
  ProgressPill,
  RarityBadge,
} from "../../components/ui";
import { colors, radius, spacing } from "../../constants/tokens";
import {
  clearCatchDraft,
  enqueueCatchDraftForSync,
  loadCatchDraft,
  summarizeCatchSyncQueue,
  saveCatchDraft,
  syncQueuedCatchDraftById,
  syncQueuedCatchDrafts,
  type CatchSyncSummary,
  type CatchDraft,
  type CatchDraftPhoto,
  type CatchPrivacy,
  type CatchPhotoUploadProgress,
  type LengthUnit,
  type WeightUnit,
} from "../../services/catches";
import { listFishdexCatalog, type FishdexCatalogSpecies } from "../../services/fishdex";
import { useAuth } from "../../state/auth";

type CatchForm = {
  speciesId: string | null;
  caughtDate: string;
  caughtTime: string;
  lengthValue: string;
  lengthUnit: LengthUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  notes: string;
  privacy: CatchPrivacy;
  photo: CatchDraftPhoto | null;
};

const privacyOptions: Array<{
  label: string;
  value: CatchPrivacy;
  description: string;
}> = [
  {
    label: "Private",
    value: "private",
    description: "Only you can see it.",
  },
  {
    label: "Unlisted",
    value: "unlisted",
    description: "Reserved for future sharing.",
  },
  {
    label: "Public",
    value: "public",
    description: "No exact coordinates are captured here.",
  },
];

const lengthUnits: LengthUnit[] = ["in", "cm"];
const weightUnits: WeightUnit[] = ["lb", "oz", "kg", "g"];

export default function LogCatchScreen() {
  const { user } = useAuth();
  const [form, setForm] = useState<CatchForm>(() => createInitialForm());
  const [species, setSpecies] = useState<FishdexCatalogSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [photoUploadProgress, setPhotoUploadProgress] =
    useState<CatchPhotoUploadProgress | null>(null);
  const [syncSummary, setSyncSummary] = useState<CatchSyncSummary | null>(null);
  const [syncingDrafts, setSyncingDrafts] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [queuedDraftCatchId, setQueuedDraftCatchId] = useState<string | null>(null);
  const syncInProgressRef = useRef(false);

  const selectedSpecies = useMemo(
    () => species.find((item) => item.id === form.speciesId) ?? null,
    [form.speciesId, species],
  );

  const loadFormData = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const [catalog, draft, queueSummary] = await Promise.all([
        listFishdexCatalog(user.id),
        loadCatchDraft(user.id),
        summarizeCatchSyncQueue(user.id),
      ]);

      setSpecies(catalog.species);
      setSyncSummary(queueSummary);

      if (draft) {
        setForm(draftToForm(draft));
        setQueuedDraftCatchId(draft.queuedCatchId ?? null);
        setMessage("Draft restored.");
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Unable to prepare catch logging."]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadFormData();
  }, [loadFormData]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);

      if (online) {
        void retrySyncQueue({ quiet: true });
      }
    });

    void NetInfo.fetch().then((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);

      if (online) {
        void retrySyncQueue({ quiet: true });
      }
    });

    return unsubscribe;
  }, [user]);

  async function handlePickPhoto() {
    setErrors([]);
    setMessage(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setErrors(["Photo library access is needed to attach a catch photo."]);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ["images"],
      quality: 0.85,
      selectionLimit: 1,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    setPhotoUploadProgress(null);
    setQueuedDraftCatchId(null);
    updateForm({
      photo: {
        fileSize: asset.fileSize ?? null,
        height: asset.height,
        mimeType: asset.mimeType ?? null,
        uri: asset.uri,
        width: asset.width,
      },
    });
  }

  async function handleSaveDraft() {
    if (!user) {
      return;
    }

    setSaving(true);
    setErrors([]);
    setMessage(null);

    try {
      await saveCatchDraft(user.id, formToDraft(form, queuedDraftCatchId));
      setMessage("Draft saved on this device.");
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Unable to save draft."]);
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmitCatch() {
    if (!user) {
      return;
    }

    setSubmitting(true);
    setErrors([]);
    setMessage(null);
    setPhotoUploadProgress(null);

    try {
      if (queuedDraftCatchId) {
        await retryQueuedDraft(queuedDraftCatchId);
        return;
      }

      const parsed = parseFormForSubmit(form);

      if (!parsed.ok) {
        setErrors(parsed.errors);
        return;
      }

      const queuedDraft = await enqueueCatchDraftForSync({
        catchInput: {
          caughtAt: parsed.caughtAt,
          lengthUnit: parsed.lengthValue == null ? null : form.lengthUnit,
          lengthValue: parsed.lengthValue,
          notes: form.notes,
          privacy: form.privacy,
          speciesId: parsed.speciesId,
          userId: user.id,
          weightUnit: parsed.weightValue == null ? null : form.weightUnit,
          weightValue: parsed.weightValue,
        },
        photo: form.photo,
      });

      setQueuedDraftCatchId(queuedDraft.catchId);
      await saveCatchDraft(user.id, formToDraft(form, queuedDraft.catchId));
      await refreshSyncSummary();
      setMessage("Catch saved locally. Syncing when connection allows.");

      const result = await syncQueuedCatchDraftById(user.id, queuedDraft.catchId);

      await refreshSyncSummary();

      if (result.failed > 0) {
        setErrors(result.errors);
        setMessage("Saved locally. Pending sync.");
        return;
      }

      await clearCatchDraft(user.id);
      setForm(createInitialForm());
      setQueuedDraftCatchId(null);
      setMessage(
        form.photo
          ? "Catch synced. Photo uploaded privately and thumbnail prepared."
          : "Catch synced. FishDex progress updated.",
      );
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Unable to submit catch."]);
    } finally {
      setSubmitting(false);
    }
  }

  async function retryQueuedDraft(catchId: string) {
    if (!user) {
      return;
    }

    const result = await syncQueuedCatchDraftById(user.id, catchId);
    await refreshSyncSummary();

    if (result.failed > 0) {
      setErrors(result.errors);
      setMessage("Still saved locally. Sync failed and can be retried.");
      return;
    }

    await clearCatchDraft(user.id);
    setForm(createInitialForm());
    setQueuedDraftCatchId(null);
    setMessage("Pending catch synced.");
  }

  async function retrySyncQueue({ quiet = false }: { quiet?: boolean } = {}) {
    if (!user || syncInProgressRef.current) {
      return;
    }

    syncInProgressRef.current = true;
    setSyncingDrafts(true);

    if (!quiet) {
      setErrors([]);
      setMessage("Retrying pending catch sync.");
    }

    try {
      const result = await syncQueuedCatchDrafts(user.id);
      await refreshSyncSummary();

      if (result.failed > 0) {
        if (!quiet) {
          setErrors(result.errors);
          setMessage("Some catches are still saved locally.");
        }
        return;
      }

      if (result.synced > 0) {
        if (queuedDraftCatchId) {
          await clearCatchDraft(user.id);
          setForm(createInitialForm());
          setQueuedDraftCatchId(null);
        }

        if (!quiet) {
          setMessage("Pending catches synced.");
        }
      }
    } catch (error) {
      if (!quiet) {
        setErrors([error instanceof Error ? error.message : "Unable to sync pending catches."]);
      }
    } finally {
      syncInProgressRef.current = false;
      setSyncingDrafts(false);
    }
  }

  async function refreshSyncSummary() {
    if (!user) {
      return;
    }

    setSyncSummary(await summarizeCatchSyncQueue(user.id));
  }

function updateForm(update: Partial<CatchForm>) {
    setForm((current) => ({ ...current, ...update }));
  }

  return (
    <ShellScreen
      eyebrow="Log Catch"
      title="Capture the moment."
      description="Record a catch, keep it private by default, and let the FishDex remember the discovery."
    >
      {loading ? <LoadingState label="Preparing catch journal" /> : null}

      {!loading && species.length === 0 ? (
        <EmptyState
          title="No species available."
          message="The FishDex catalog needs species before catches can be logged."
          actionLabel="Refresh"
          onAction={loadFormData}
        />
      ) : null}

      {!loading && species.length > 0 ? (
        <View style={styles.stack}>
          <CatchActions
            saving={saving}
            submitting={submitting}
            hasPendingSync={Boolean(queuedDraftCatchId)}
            onSaveDraft={handleSaveDraft}
            onSubmitCatch={handleSubmitCatch}
          />

          <CatchFeedback
            errors={errors}
            message={message}
            onRetrySync={syncSummary && syncSummary.total > 0 ? () => retrySyncQueue() : undefined}
            photoUploadProgress={photoUploadProgress}
            retrying={submitting || syncingDrafts}
          />

          <OfflineSyncStatus
            isOnline={isOnline}
            onRetry={() => retrySyncQueue()}
            summary={syncSummary}
            syncing={syncingDrafts}
          />

          <Card elevated>
            <View style={styles.stack}>
              <SectionHeader title="Species" detail={selectedSpecies?.commonName ?? "Required"} />
              <View style={styles.speciesGrid}>
                {species.map((item) => (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: form.speciesId === item.id }}
                    onPress={() => updateForm({ speciesId: item.id })}
                    style={({ pressed }) => [
                      styles.speciesOption,
                      form.speciesId === item.id && styles.optionSelected,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <View style={styles.optionHeader}>
                      <AppText variant="body" weight="semibold">
                        {item.commonName}
                      </AppText>
                      <RarityBadge rarity={item.rarity} />
                    </View>
                    <AppText variant="bodySmall" tone="muted">
                      {item.regionNames.slice(0, 2).join(", ") || "Unmapped"}
                    </AppText>
                  </Pressable>
                ))}
              </View>
            </View>
          </Card>

          <Card>
            <View style={styles.stack}>
              <SectionHeader title="Photo" detail="Local draft attachment" />
              {form.photo ? (
                <View style={styles.photoPreviewRow}>
                  <Image source={{ uri: form.photo.uri }} style={styles.photoPreview} />
                  <View style={styles.photoCopy}>
                    <AppText variant="body" weight="semibold">
                      Photo selected
                    </AppText>
                    <AppText variant="bodySmall" tone="secondary">
                      It will be compressed, uploaded privately, and linked to this catch.
                    </AppText>
                    <AppButton
                      label="Remove Photo"
                      onPress={() => {
                        setPhotoUploadProgress(null);
                        setQueuedDraftCatchId(null);
                        updateForm({ photo: null });
                      }}
                      variant="ghost"
                    />
                  </View>
                </View>
              ) : (
                <AppText variant="bodySmall" tone="secondary">
                  Add one image. Originals stay private by default; thumbnails are prepared for future previews.
                </AppText>
              )}
              <AppButton label={form.photo ? "Change Photo" : "Choose Photo"} onPress={handlePickPhoto} variant="secondary" />
            </View>
          </Card>

          <Card>
            <View style={styles.stack}>
              <SectionHeader title="When" detail="Required" />
              <View style={styles.row}>
                <AppButton label="Now" onPress={() => updateForm(createDateTimePatch(new Date()))} variant="ghost" style={styles.quickButton} />
                <AppButton
                  label="Yesterday"
                  onPress={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    updateForm(createDateTimePatch(yesterday));
                  }}
                  variant="ghost"
                  style={styles.quickButton}
                />
              </View>
              <View style={styles.inputGrid}>
                <Field label="Date">
                  <AppTextInput
                    autoCapitalize="none"
                    onChangeText={(caughtDate) => updateForm({ caughtDate })}
                    placeholder="YYYY-MM-DD"
                    value={form.caughtDate}
                  />
                </Field>
                <Field label="Time">
                  <AppTextInput
                    autoCapitalize="none"
                    onChangeText={(caughtTime) => updateForm({ caughtTime })}
                    placeholder="HH:MM"
                    value={form.caughtTime}
                  />
                </Field>
              </View>
            </View>
          </Card>

          <Card>
            <View style={styles.stack}>
              <SectionHeader title="Optional measurements" detail="Size and weight" />
              <View style={styles.inputGrid}>
                <Field label="Length">
                  <AppTextInput
                    inputMode="decimal"
                    keyboardType="decimal-pad"
                    onChangeText={(lengthValue) => updateForm({ lengthValue })}
                    placeholder="Optional"
                    value={form.lengthValue}
                  />
                  <UnitPicker
                    options={lengthUnits}
                    selected={form.lengthUnit}
                    onSelect={(lengthUnit) => updateForm({ lengthUnit })}
                  />
                </Field>
                <Field label="Weight">
                  <AppTextInput
                    inputMode="decimal"
                    keyboardType="decimal-pad"
                    onChangeText={(weightValue) => updateForm({ weightValue })}
                    placeholder="Optional"
                    value={form.weightValue}
                  />
                  <UnitPicker
                    options={weightUnits}
                    selected={form.weightUnit}
                    onSelect={(weightUnit) => updateForm({ weightUnit })}
                  />
                </Field>
              </View>
            </View>
          </Card>

          <Card>
            <View style={styles.stack}>
              <SectionHeader title="Notes" detail={`${form.notes.length}/2000`} />
              <AppTextInput
                multiline
                onChangeText={(notes) => updateForm({ notes })}
                placeholder="Water, weather, lure, memory..."
                style={styles.notesInput}
                textAlignVertical="top"
                value={form.notes}
              />
            </View>
          </Card>

          <Card>
            <View style={styles.stack}>
              <SectionHeader title="Privacy" detail="Private by default" />
              {privacyOptions.map((option) => (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: form.privacy === option.value }}
                  onPress={() => updateForm({ privacy: option.value })}
                  style={({ pressed }) => [
                    styles.privacyOption,
                    form.privacy === option.value && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <AppText variant="body" weight="semibold">
                    {option.label}
                  </AppText>
                  <AppText variant="bodySmall" tone="secondary">
                    {option.description}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </Card>

          <CatchActions
            saving={saving}
            submitting={submitting}
            hasPendingSync={Boolean(queuedDraftCatchId)}
            onSaveDraft={handleSaveDraft}
            onSubmitCatch={handleSubmitCatch}
          />
        </View>
      ) : null}
    </ShellScreen>
  );
}

function OfflineSyncStatus({
  isOnline,
  onRetry,
  summary,
  syncing,
}: {
  isOnline: boolean | null;
  onRetry: () => void;
  summary: CatchSyncSummary | null;
  syncing: boolean;
}) {
  if (!summary || summary.total === 0) {
    return (
      <Card>
        <View style={styles.stackTight}>
          <SectionHeader
            title="Draft Sync"
            detail={isOnline === false ? "Offline" : "Synced"}
          />
          <AppText variant="bodySmall" tone={isOnline === false ? "secondary" : "accent"}>
            {isOnline === false
              ? "Drafts save locally while connection is unavailable."
              : "No pending catches. Drafts are safe on this device."}
          </AppText>
        </View>
      </Card>
    );
  }

  const hasFailures = summary.failed > 0;
  const statusLabel = syncing
    ? "Syncing"
    : hasFailures
      ? "Failed sync"
      : summary.pending > 0
        ? "Pending sync"
        : "Saved locally";

  return (
    <Card>
      <View style={styles.stackTight}>
        <SectionHeader title="Draft Sync" detail={statusLabel} />
        <AppText variant="bodySmall" tone={hasFailures ? "danger" : "secondary"}>
          {formatSyncSummary(summary, isOnline)}
        </AppText>
        {summary.latestError ? (
          <AppText variant="bodySmall" tone="danger">
            {summary.latestError}
          </AppText>
        ) : null}
        <AppButton
          disabled={syncing}
          label={syncing ? "Syncing..." : "Retry Sync"}
          onPress={onRetry}
          variant="secondary"
        />
      </View>
    </Card>
  );
}

function formatSyncSummary(summary: CatchSyncSummary, isOnline: boolean | null) {
  if (summary.failed > 0) {
    return `${summary.failed} catch draft${summary.failed === 1 ? "" : "s"} failed to sync and remain saved locally.`;
  }

  if (summary.pending > 0) {
    return `${summary.pending} catch draft${summary.pending === 1 ? "" : "s"} pending sync${isOnline === false ? " until connection returns" : ""}.`;
  }

  if (summary.syncing > 0) {
    return "Syncing saved catch drafts.";
  }

  return "Catch drafts are saved locally.";
}

function CatchActions({
  onSaveDraft,
  onSubmitCatch,
  hasPendingSync,
  saving,
  submitting,
}: {
  onSaveDraft: () => void;
  onSubmitCatch: () => void;
  hasPendingSync: boolean;
  saving: boolean;
  submitting: boolean;
}) {
  return (
    <Card elevated>
      <View style={styles.stack}>
        <SectionHeader title="Draft and Submit" detail="Catch journal" />
        <View style={styles.actions}>
          <AppButton
            disabled={saving || submitting}
            label={saving ? "Saving Draft..." : "Save Draft"}
            onPress={onSaveDraft}
            variant="secondary"
          />
          <AppButton
            disabled={saving || submitting}
            label={
              submitting
                ? hasPendingSync
                  ? "Syncing..."
                  : "Submitting..."
                : hasPendingSync
                  ? "Retry Sync"
                  : "Submit Catch"
            }
            onPress={onSubmitCatch}
          />
        </View>
      </View>
    </Card>
  );
}

function CatchFeedback({
  errors,
  message,
  onRetrySync,
  photoUploadProgress,
  retrying,
}: {
  errors: string[];
  message: string | null;
  onRetrySync?: () => void;
  photoUploadProgress: CatchPhotoUploadProgress | null;
  retrying: boolean;
}) {
  if (errors.length === 0 && !message && !photoUploadProgress && !onRetrySync) {
    return null;
  }

  return (
    <Card>
      <View style={styles.stackTight}>
        {errors.map((error) => (
          <AppText key={error} variant="bodySmall" tone="danger">
            {error}
          </AppText>
        ))}
        {message ? (
          <AppText variant="bodySmall" tone="accent" weight="semibold">
            {message}
          </AppText>
        ) : null}
        {photoUploadProgress ? (
          <ProgressPill
            current={photoUploadProgress.percent}
            label={formatUploadStage(photoUploadProgress.stage)}
            total={100}
          />
        ) : null}
        {onRetrySync ? (
          <AppButton
            disabled={retrying}
            label={retrying ? "Retrying..." : "Retry Sync"}
            onPress={onRetrySync}
            variant="secondary"
          />
        ) : null}
      </View>
    </Card>
  );
}

function formatUploadStage(stage: CatchPhotoUploadProgress["stage"]) {
  switch (stage) {
    case "validating":
      return "Validating photo";
    case "compressing":
      return "Compressing photo";
    case "uploading-original":
      return "Uploading private original";
    case "uploading-thumbnail":
      return "Preparing thumbnail";
    case "saving-metadata":
      return "Saving media record";
    case "complete":
      return "Upload complete";
  }
}

function SectionHeader({ detail, title }: { detail: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <AppText variant="heading" weight="semibold">
        {title}
      </AppText>
      <AppText variant="caption" tone="muted" weight="semibold">
        {detail}
      </AppText>
    </View>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <View style={styles.field}>
      <AppText variant="caption" tone="muted" weight="semibold">
        {label}
      </AppText>
      {children}
    </View>
  );
}

function UnitPicker<T extends string>({
  onSelect,
  options,
  selected,
}: {
  onSelect: (value: T) => void;
  options: T[];
  selected: T;
}) {
  return (
    <View style={styles.unitRow}>
      {options.map((option) => (
        <Pressable
          key={option}
          accessibilityRole="button"
          accessibilityState={{ selected: selected === option }}
          onPress={() => onSelect(option)}
          style={[styles.unitChip, selected === option && styles.optionSelected]}
        >
          <AppText variant="caption" tone={selected === option ? "primary" : "secondary"} weight="semibold">
            {option}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

function createInitialForm(): CatchForm {
  const now = new Date();

  return {
    ...createDateTimePatch(now),
    lengthUnit: "in",
    lengthValue: "",
    notes: "",
    photo: null,
    privacy: "private",
    speciesId: null,
    weightUnit: "lb",
    weightValue: "",
  };
}

function createDateTimePatch(date: Date) {
  return {
    caughtDate: formatDate(date),
    caughtTime: formatTime(date),
  };
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function draftToForm(draft: CatchDraft): CatchForm {
  return {
    caughtDate: draft.caughtDate,
    caughtTime: draft.caughtTime,
    lengthUnit: draft.lengthUnit,
    lengthValue: draft.lengthValue,
    notes: draft.notes,
    photo: draft.photo,
    privacy: draft.privacy,
    speciesId: draft.speciesId,
    weightUnit: draft.weightUnit,
    weightValue: draft.weightValue,
  };
}

function formToDraft(form: CatchForm, queuedCatchId: string | null = null): CatchDraft {
  return {
    ...form,
    queuedCatchId,
    updatedAt: new Date().toISOString(),
  };
}

function parseFormForSubmit(form: CatchForm):
  | {
      ok: true;
      caughtAt: string;
      lengthValue: number | null;
      speciesId: string;
      weightValue: number | null;
    }
  | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const caughtAt = parseCaughtAt(form.caughtDate, form.caughtTime);
  const lengthValue = parseOptionalNumber(form.lengthValue, "Length", errors);
  const weightValue = parseOptionalNumber(form.weightValue, "Weight", errors);

  if (!form.speciesId) {
    errors.push("Choose a species before submitting.");
  }

  if (!caughtAt) {
    errors.push("Use a valid date and time.");
  }

  if (form.notes.length > 2000) {
    errors.push("Notes must stay under 2,000 characters.");
  }

  if (errors.length > 0 || !caughtAt || !form.speciesId) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    caughtAt,
    lengthValue,
    speciesId: form.speciesId,
    weightValue,
  };
}

function parseCaughtAt(dateValue: string, timeValue: string) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue.trim());
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(timeValue.trim());

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const date = new Date(year, month - 1, day, hour, minute);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null;
  }

  return date.toISOString();
}

function parseOptionalNumber(value: string, label: string, errors: string[]) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed) || parsed < 0) {
    errors.push(`${label} must be zero or greater.`);
    return null;
  }

  return parsed;
}

const styles = StyleSheet.create({
  actions: {
    gap: Number.parseInt(spacing[3], 10),
  },
  field: {
    flex: 1,
    gap: Number.parseInt(spacing[2], 10),
    minWidth: 132,
  },
  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Number.parseInt(spacing[3], 10),
  },
  notesInput: {
    minHeight: 120,
  },
  optionHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: Number.parseInt(spacing[2], 10),
    justifyContent: "space-between",
  },
  optionPressed: {
    opacity: 0.82,
  },
  optionSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  photoCopy: {
    flex: 1,
    gap: Number.parseInt(spacing[2], 10),
    minWidth: 160,
  },
  photoPreview: {
    backgroundColor: colors.backgroundRaised,
    borderRadius: Number.parseInt(radius.md, 10),
    height: 120,
    width: 120,
  },
  photoPreviewRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Number.parseInt(spacing[3], 10),
  },
  privacyOption: {
    backgroundColor: colors.backgroundRaised,
    borderColor: colors.border,
    borderRadius: Number.parseInt(radius.md, 10),
    borderWidth: 1,
    gap: Number.parseInt(spacing[1], 10),
    padding: Number.parseInt(spacing[3], 10),
  },
  quickButton: {
    minHeight: 44,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Number.parseInt(spacing[2], 10),
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: Number.parseInt(spacing[3], 10),
    justifyContent: "space-between",
  },
  speciesGrid: {
    gap: Number.parseInt(spacing[3], 10),
  },
  speciesOption: {
    backgroundColor: colors.backgroundRaised,
    borderColor: colors.border,
    borderRadius: Number.parseInt(radius.md, 10),
    borderWidth: 1,
    gap: Number.parseInt(spacing[2], 10),
    padding: Number.parseInt(spacing[3], 10),
  },
  stack: {
    gap: Number.parseInt(spacing[4], 10),
  },
  stackTight: {
    gap: Number.parseInt(spacing[2], 10),
  },
  unitChip: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: Number.parseInt(radius.full, 10),
    borderWidth: 1,
    minHeight: 32,
    minWidth: 44,
    justifyContent: "center",
    paddingHorizontal: Number.parseInt(spacing[2], 10),
  },
  unitRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Number.parseInt(spacing[2], 10),
  },
});
