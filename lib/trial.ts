import { FirestoreDate, RestaurantPlan } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;
export const STARTER_TRIAL_DAYS = 14;

export interface StarterTrialStatus {
  isApplicable: boolean;
  isExpired: boolean;
  remainingDays: number | null;
  startedAt: Date | null;
  endsAt: Date | null;
}

function toDateValue(value: FirestoreDate | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === "object" && "toDate" in value) {
    const parsed = value.toDate();
    return parsed instanceof Date && !Number.isNaN(parsed.getTime()) ? parsed : null;
  }

  return null;
}

function utcDayStartMs(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function getStarterTrialStatus(
  initialPlan: RestaurantPlan | null | undefined,
  createdAt: FirestoreDate | null | undefined,
  now = new Date(),
): StarterTrialStatus {
  const startedWithStarter = (initialPlan ?? "starter") === "starter";

  if (!startedWithStarter) {
    return {
      isApplicable: false,
      isExpired: false,
      remainingDays: null,
      startedAt: null,
      endsAt: null,
    };
  }

  const startedAt = toDateValue(createdAt);
  if (!startedAt) {
    return {
      isApplicable: true,
      isExpired: false,
      remainingDays: null,
      startedAt: null,
      endsAt: null,
    };
  }

  const endAt = new Date(startedAt.getTime() + STARTER_TRIAL_DAYS * DAY_MS);
  const elapsedDays = Math.max(
    0,
    Math.floor((utcDayStartMs(now) - utcDayStartMs(startedAt)) / DAY_MS),
  );
  const remainingDays = Math.max(0, STARTER_TRIAL_DAYS - elapsedDays);

  return {
    isApplicable: true,
    isExpired: remainingDays <= 0,
    remainingDays,
    startedAt,
    endsAt: endAt,
  };
}
