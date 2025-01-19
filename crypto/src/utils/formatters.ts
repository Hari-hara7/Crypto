/**
 * Formats a number as currency.
 * @param value - The number to format.
 * @param currency - The currency code (e.g., USD, EUR).
 * @returns Formatted currency string.
 */
export const formatCurrency = (value: number, currency: string = "USD"): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  };
  
  /**
   * Formats a number as a percentage.
   * @param value - The number to format.
   * @returns Formatted percentage string.
   */
  export const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };
  
  /**
   * Formats large numbers with appropriate units (K, M, B).
   * @param value - The number to format.
   * @returns Formatted number string with units.
   */
  export const formatLargeNumber = (value: number): string => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}K`;
    }
    return value.toString();
  };
  