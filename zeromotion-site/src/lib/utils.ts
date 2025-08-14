export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrencyMonthly(centsPerMonth: number): string {
  const dollars = centsPerMonth / 100;
  return `$${dollars.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo`;
}
