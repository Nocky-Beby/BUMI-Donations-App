export function roundAmount(value) {
  return Number((Number(value || 0)).toFixed(2));
}

export function buildDonationMetrics(donations = []) {
  const metrics = {
    count: donations.length,
    cashCdf: 0,
    cashUsd: 0,
    cashNormalizedCdf: 0,
    overallNormalizedCdf: 0,
  };

  for (const donation of donations) {
    if (String(donation.type || '').toUpperCase() !== 'CASH') continue;
    const currency = String(donation.currency || 'CDF').toUpperCase();
    const amount = Number(donation.amount) || 0;
    const normalized = Number(donation.normalizedValueCdf || 0) || 0;

    if (currency === 'USD') metrics.cashUsd += amount;
    else metrics.cashCdf += amount;
    metrics.cashNormalizedCdf += normalized;
    metrics.overallNormalizedCdf += normalized;
  }

  return Object.fromEntries(Object.entries(metrics).map(([key, value]) => [key, typeof value === 'number' ? roundAmount(value) : value]));
}
