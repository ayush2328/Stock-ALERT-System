// Data structures and types for the alert system

export const AlertDirection = {
  ABOVE: 'above',
  BELOW: 'below', 
  CROSS_ABOVE: 'cross_above',
  CROSS_BELOW: 'cross_below'
};

export class Alert {
  constructor(alertId, userId, ticker, targetPrice, direction, currentPrice) {
    this.alertId = alertId;
    this.userId = userId;
    this.ticker = ticker;
    this.targetPrice = targetPrice;
    this.direction = direction;
    this.currentPrice = currentPrice;
    this.createdAt = Date.now();
    this.isActive = true;
    this.lastPrice = currentPrice;
  }

  getPriority(currentPrice) {
    return Math.abs(currentPrice - this.targetPrice);
  }

  updateLastPrice(price) {
    this.lastPrice = price;
  }
}

// Mock price data for demonstration
export const mockPrices = {
  'AAPL': 150.25,
  'GOOGL': 2720.50,
  'TSLA': 245.75,
  'MSFT': 330.80,
  'AMZN': 3410.20,
  'META': 320.45,
  'NVDA': 485.60,
  'NFLX': 415.30
};