export function validateAlertData(data) {
  const { userId, ticker, targetPrice, direction } = data;
  const errors = [];

  if (!userId || userId.trim().length < 1) {
    errors.push('User ID is required');
  }

  if (!ticker || !/^[A-Z]{1,5}$/.test(ticker.toUpperCase())) {
    errors.push('Ticker must be 1-5 uppercase letters');
  }

  if (!targetPrice || isNaN(targetPrice) || targetPrice <= 0) {
    errors.push('Target price must be a positive number');
  }

  const validDirections = ['above', 'below', 'cross_above', 'cross_below'];
  if (!direction || !validDirections.includes(direction)) {
    errors.push(`Direction must be one of: ${validDirections.join(', ')}`);
  }

  return errors;
}

export function generateAlertId(userId, ticker) {
  return `alert_${userId}_${ticker}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

export function shouldTriggerAlert(alert, currentPrice) {
  const price = parseFloat(currentPrice);
  const target = parseFloat(alert.targetPrice);
  const lastPrice = parseFloat(alert.lastPrice);

  switch (alert.direction) {
    case 'above':
      return price >= target;
    case 'below':
      return price <= target;
    case 'cross_above':
      return lastPrice < target && price >= target;
    case 'cross_below':
      return lastPrice > target && price <= target;
    default:
      return false;
  }
}