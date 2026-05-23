import { getSupabaseClient } from "../../lib/supabase";

export type CatchPrivacy = "private" | "unlisted" | "public";
export type LengthUnit = "in" | "cm";
export type WeightUnit = "lb" | "oz" | "kg" | "g";

export type CreateCatchInput = {
  userId: string;
  speciesId: string;
  caughtAt: string;
  lengthValue?: number | null;
  lengthUnit?: LengthUnit | null;
  weightValue?: number | null;
  weightUnit?: WeightUnit | null;
  notes?: string | null;
  privacy: CatchPrivacy;
};

export type CreateCatchResult =
  | { ok: true; catchId: string }
  | { ok: false; errors: string[] };

type FishdexEntry = {
  catch_count: number;
  first_catch_id: string | null;
  best_length_value: number | null;
  best_length_unit: string | null;
  best_weight_value: number | null;
  best_weight_unit: string | null;
};

const validPrivacy: CatchPrivacy[] = ["private", "unlisted", "public"];

export async function createCatch(input: CreateCatchInput): Promise<CreateCatchResult> {
  const errors = validateCreateCatchInput(input);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("catches")
    .insert({
      caught_at: input.caughtAt,
      length_unit: input.lengthValue == null ? null : input.lengthUnit,
      length_value: input.lengthValue ?? null,
      notes: normalizeOptionalText(input.notes),
      privacy: input.privacy,
      species_id: input.speciesId,
      user_id: input.userId,
      weight_unit: input.weightValue == null ? null : input.weightUnit,
      weight_value: input.weightValue ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, errors: [error.message] };
  }

  await updateFishdexEntry({
    catchId: data.id,
    lengthUnit: input.lengthUnit ?? null,
    lengthValue: input.lengthValue ?? null,
    speciesId: input.speciesId,
    userId: input.userId,
    weightUnit: input.weightUnit ?? null,
    weightValue: input.weightValue ?? null,
  });

  return { ok: true, catchId: data.id };
}

function validateCreateCatchInput(input: CreateCatchInput) {
  const errors: string[] = [];

  if (!input.userId) {
    errors.push("You need to be signed in to save a catch.");
  }

  if (!input.speciesId) {
    errors.push("Choose a species before submitting.");
  }

  if (Number.isNaN(Date.parse(input.caughtAt))) {
    errors.push("Choose a valid catch date and time.");
  }

  if (!validPrivacy.includes(input.privacy)) {
    errors.push("Choose a valid privacy setting.");
  }

  if (input.lengthValue != null && input.lengthValue < 0) {
    errors.push("Length must be zero or greater.");
  }

  if (input.weightValue != null && input.weightValue < 0) {
    errors.push("Weight must be zero or greater.");
  }

  if (input.notes && input.notes.length > 2000) {
    errors.push("Notes must stay under 2,000 characters.");
  }

  return errors;
}

async function updateFishdexEntry({
  catchId,
  lengthUnit,
  lengthValue,
  speciesId,
  userId,
  weightUnit,
  weightValue,
}: {
  catchId: string;
  lengthUnit: LengthUnit | null;
  lengthValue: number | null;
  speciesId: string;
  userId: string;
  weightUnit: WeightUnit | null;
  weightValue: number | null;
}) {
  const supabase = getSupabaseClient();
  const { data: existingEntry, error: readError } = await supabase
    .from("user_fishdex_entries")
    .select(
      "catch_count, first_catch_id, best_length_value, best_length_unit, best_weight_value, best_weight_unit",
    )
    .eq("user_id", userId)
    .eq("species_id", speciesId)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (!existingEntry) {
    const { error } = await supabase.from("user_fishdex_entries").insert({
      best_length_unit: lengthValue == null ? null : lengthUnit,
      best_length_value: lengthValue,
      best_weight_unit: weightValue == null ? null : weightUnit,
      best_weight_value: weightValue,
      catch_count: 1,
      first_catch_id: catchId,
      species_id: speciesId,
      user_id: userId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  const nextBestLength = chooseBestMeasurement({
    currentUnit: existingEntry.best_length_unit,
    currentValue: existingEntry.best_length_value,
    nextUnit: lengthUnit,
    nextValue: lengthValue,
  });
  const nextBestWeight = chooseBestMeasurement({
    currentUnit: existingEntry.best_weight_unit,
    currentValue: existingEntry.best_weight_value,
    nextUnit: weightUnit,
    nextValue: weightValue,
  });

  const { error } = await supabase
    .from("user_fishdex_entries")
    .update({
      best_length_unit: nextBestLength.unit,
      best_length_value: nextBestLength.value,
      best_weight_unit: nextBestWeight.unit,
      best_weight_value: nextBestWeight.value,
      catch_count: existingEntry.catch_count + 1,
      first_catch_id: existingEntry.first_catch_id ?? catchId,
    })
    .eq("user_id", userId)
    .eq("species_id", speciesId);

  if (error) {
    throw new Error(error.message);
  }
}

function chooseBestMeasurement({
  currentUnit,
  currentValue,
  nextUnit,
  nextValue,
}: {
  currentUnit: string | null;
  currentValue: number | null;
  nextUnit: string | null;
  nextValue: number | null;
}) {
  if (nextValue == null || nextUnit == null) {
    return { unit: currentUnit, value: currentValue };
  }

  if (currentValue == null || currentUnit == null) {
    return { unit: nextUnit, value: nextValue };
  }

  if (currentUnit !== nextUnit) {
    return { unit: currentUnit, value: currentValue };
  }

  return nextValue > currentValue
    ? { unit: nextUnit, value: nextValue }
    : { unit: currentUnit, value: currentValue };
}

function normalizeOptionalText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}
