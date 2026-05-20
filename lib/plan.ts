import { RestaurantPlan } from "@/types";

const PLAN_RANK: Record<RestaurantPlan, number> = {
  starter: 1,
  growth: 2,
  premium: 3,
};

export function normalizePlan(value: unknown): RestaurantPlan {
  if (value === "growth" || value === "premium") {
    return value;
  }

  return "starter";
}

export function hasPlanAtLeast(plan: RestaurantPlan | null | undefined, target: RestaurantPlan): boolean {
  if (!plan) {
    return false;
  }

  return PLAN_RANK[plan] >= PLAN_RANK[target];
}

export function canUseWaiterCalls(plan: RestaurantPlan | null | undefined): boolean {
  return hasPlanAtLeast(plan, "growth");
}

export function canUseVariations(plan: RestaurantPlan | null | undefined): boolean {
  return hasPlanAtLeast(plan, "growth");
}

export function canUseBrandDesign(plan: RestaurantPlan | null | undefined): boolean {
  return hasPlanAtLeast(plan, "growth");
}

export function canUsePromotions(plan: RestaurantPlan | null | undefined): boolean {
  return hasPlanAtLeast(plan, "premium");
}

export function getPlanLabel(plan: RestaurantPlan | null | undefined): string {
  if (plan === "growth") {
    return "Growth";
  }

  if (plan === "premium") {
    return "Premium";
  }

  return "Starter";
}
