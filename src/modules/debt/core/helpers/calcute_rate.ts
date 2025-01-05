export function calculateRate(current: string, previous: string): number {
  const currentValue = parseInt(current);
  const previousValue = parseInt(previous);
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0; // Avoid division by zero
  }
  return ((currentValue - previousValue) / previousValue) * 100;
}
