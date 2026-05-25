export interface FloorTableModule {
  floorNumber: number;
  tableCount: number;
  tableNumbers: number[];
  startTableNumber: number | null;
  endTableNumber: number | null;
}

function normalizeTableCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(500, Math.floor(value)));
}

export function normalizeFloorCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.min(20, Math.floor(value)));
}

function buildBalancedFloorTableCounts(tableCount: number, floorCount: number): number[] {
  const safeTableCount = normalizeTableCount(tableCount);
  const safeFloorCount = normalizeFloorCount(floorCount);
  const baseCount = safeFloorCount > 0 ? Math.floor(safeTableCount / safeFloorCount) : 0;
  const remainder = safeFloorCount > 0 ? safeTableCount % safeFloorCount : 0;

  return Array.from({ length: safeFloorCount }, (_, index) => baseCount + (index < remainder ? 1 : 0));
}

export function normalizeFloorTableCounts(
  floorTableCounts: number[] | null | undefined,
  floorCount: number,
  fallbackTableCount = 0,
): number[] {
  const safeFloorCount = normalizeFloorCount(floorCount);
  const hasInput = Array.isArray(floorTableCounts);
  const normalizedFromInput = hasInput
    ? floorTableCounts.map((value) => normalizeTableCount(value))
    : [];

  if (!hasInput || normalizedFromInput.length === 0) {
    return buildBalancedFloorTableCounts(fallbackTableCount, safeFloorCount);
  }

  const padded = Array.from({ length: safeFloorCount }, (_, index) => normalizedFromInput[index] ?? 0);
  const total = padded.reduce((sum, count) => sum + count, 0);

  if (total > 500) {
    let remaining = 500;
    return padded.map((count) => {
      if (remaining <= 0) {
        return 0;
      }
      const nextValue = Math.min(count, remaining);
      remaining -= nextValue;
      return nextValue;
    });
  }

  return padded;
}

export function sumFloorTableCounts(floorTableCounts: number[]): number {
  return floorTableCounts.reduce((sum, count) => sum + normalizeTableCount(count), 0);
}

export function buildFloorTableModules(
  tableCount: number,
  floorCount: number,
  floorTableCounts?: number[] | null,
): FloorTableModule[] {
  const normalizedCounts = normalizeFloorTableCounts(floorTableCounts, floorCount, tableCount);
  const modules: FloorTableModule[] = [];
  let nextTableNumber = 1;

  for (let index = 0; index < normalizedCounts.length; index += 1) {
    const floorNumber = index + 1;
    const currentCount = normalizedCounts[index];
    const tableNumbers = Array.from(
      { length: currentCount },
      (_, itemIndex) => nextTableNumber + itemIndex,
    );
    const startTableNumber = tableNumbers.length > 0 ? tableNumbers[0] : null;
    const endTableNumber = tableNumbers.length > 0 ? tableNumbers[tableNumbers.length - 1] : null;

    modules.push({
      floorNumber,
      tableCount: currentCount,
      tableNumbers,
      startTableNumber,
      endTableNumber,
    });

    nextTableNumber += currentCount;
  }

  return modules;
}

export function getFloorByTableNumber(
  tableNumber: number,
  modules: FloorTableModule[],
): number {
  if (!Number.isFinite(tableNumber) || tableNumber < 1) {
    return modules[0]?.floorNumber ?? 1;
  }

  const matched = modules.find((module) => module.tableNumbers.includes(Math.floor(tableNumber)));
  return matched?.floorNumber ?? modules[0]?.floorNumber ?? 1;
}
