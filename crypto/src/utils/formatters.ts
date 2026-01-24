export const formatCurrency = (
  value: number | null | undefined,
  currency: string = "USD"
): string => {
  if (value == null || Number.isNaN(value)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
};


export const formatPercentage = (
  value: number | null | undefined,
  decimals = 2
): string => {
  if (value == null || Number.isNaN(value)) return "—";

  return `${value.toFixed(decimals)}%`;
};


export const formatLargeNumber = (
  value: number | null | undefined
): string => {
  if (value == null || Number.isNaN(value)) return "—";

  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }

  return value.toString();
};
