const formatAsCurrency = (amount: number): string =>
  amount.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default formatAsCurrency;
