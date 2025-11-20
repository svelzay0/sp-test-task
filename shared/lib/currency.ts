const formatters = new Map<string, Intl.NumberFormat>();

export const formatCurrency = (value: number, currency = "usd") => {
  const key = currency.toUpperCase();

  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: key,
        maximumFractionDigits: 2,
      })
    );
  }

  const formatter = formatters.get(key);
  if (!formatter) {
    throw new Error(`Formatter for currency ${key} not found`);
  }
  return formatter.format(value);
};
