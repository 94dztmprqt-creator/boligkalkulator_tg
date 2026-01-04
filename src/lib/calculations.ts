export function calculate(data: {
  price: number;
  equity: number;
  interest: number;
  loanYears: number;
  rent: number;
  vacancy: number;
  commonCosts: number;
  municipal: number;
  insurance: number;
  maintenance: number;
  taxRate: number;
  appreciation: number;
}) {
  const loan = data.price - data.equity;

  const r = data.interest / 100;
  const n = data.loanYears;

  // Annuitetslån – årlig
  const annuity =
    loan *
    (r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1);

  const yearlyRent = data.rent * 12 * (1 - data.vacancy / 100);

  const yearlyCosts =
    data.commonCosts * 12 +
    data.municipal +
    data.insurance +
    data.maintenance;

  const interestCost = loan * r;
  const taxableIncome = Math.max(
    0,
    yearlyRent - yearlyCosts - interestCost
  );

  const tax = taxableIncome * (data.taxRate / 100);

  const netCashflow =
    yearlyRent - yearlyCosts - annuity - tax;

  const grossYield = (yearlyRent / data.price) * 100;
  const roi = (netCashflow / data.equity) * 100;

  const appreciationValue =
    data.price * (data.appreciation / 100);

  const totalReturn =
    netCashflow + appreciationValue;

  return {
    yearlyRent,
    annuity,
    interestCost,
    tax,
    netCashflow,
    grossYield,
    roi,
    totalReturn,
  };
}
