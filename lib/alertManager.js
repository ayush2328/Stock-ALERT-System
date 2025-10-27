import { redisClient } from './redisClient.js';
import { shouldTriggerAlert } from './utils.js';
import { mockPrices } from './dataStructures.js';

class AlertManager {
  
  async setAlert(userId, ticker, targetPrice, direction, currentPrice = null) {
    const alertId = `alert_${userId}_${ticker}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Use provided current price or get from mock data
    const actualCurrentPrice = currentPrice || mockPrices[ticker] || targetPrice;
    
    const alertData = {
      alertId,
      userId,
      ticker: ticker.toUpperCase(),
      targetPrice: parseFloat(targetPrice),
      direction,
      currentPrice: parseFloat(actualCurrentPrice),
      createdAt: Date.now(),
      isActive: 'true',
      lastPrice: parseFloat(actualCurrentPrice)
    };

    await redisClient.setAlert(alertId, alertData);
    return alertId;
  }

  async processPriceUpdate(ticker, currentPrice) {
    const tickerUpper = ticker.toUpperCase();
    
    // Update current price in storage
    await redisClient.setCurrentPrice(tickerUpper, currentPrice);
    
    // Get alerts for this ticker within 2% threshold of current price
    const threshold = currentPrice * 0.02;
    const alerts = await redisClient.getAlertsByTicker(tickerUpper, threshold);
    const triggeredAlerts = [];

    for (const alert of alerts) {
      if (alert.isActive === 'false') continue;

      // Update last price for cross-type alerts
      await this.updateAlertLastPrice(alert.alertId, currentPrice);
      
      const shouldTrigger = shouldTriggerAlert(alert, currentPrice);
      
      if (shouldTrigger) {
        triggeredAlerts.push(alert);
        await redisClient.removeAlert(alert.alertId);
        
        // Log notification (in production, integrate with email/SMS/push)
        console.log(`🚨 ALERT TRIGGERED: ${alert.ticker} ${alert.direction} $${alert.targetPrice}. Current: $${currentPrice}`);
      } else {
        // Update priority in sorted set
        const newPriority = Math.abs(currentPrice - alert.targetPrice);
        await redisClient.updateAlertPriority(alert.alertId, alert.ticker, newPriority);
      }
    }

    return triggeredAlerts;
  }

  async updateAlertLastPrice(alertId, currentPrice) {
    const alert = await redisClient.getAlert(alertId);
    if (alert) {
      alert.lastPrice = currentPrice.toString();
      await redisClient.setAlert(alertId, alert);
    }
  }

  async removeAlert(userId, alertId) {
    await redisClient.removeAlert(alertId);
    return { success: true };
  }

  async getUserAlerts(userId) {
    return await redisClient.getUserAlerts(userId);
  }

  async getSystemStats() {
    return await redisClient.getStats();
  }
}

export const alertManager = new AlertManager();