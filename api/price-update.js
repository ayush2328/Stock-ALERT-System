import { alertManager } from '../lib/alertManager.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ticker, price } = req.body;
    
    if (!ticker || !price) {
      return res.status(400).json({ error: 'Ticker and price required' });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const triggeredAlerts = await alertManager.processPriceUpdate(
      ticker.toUpperCase(), 
      parseFloat(price)
    );
    
    console.log(`💰 Price update: ${ticker} -> $${price}, triggered ${triggeredAlerts.length} alerts`);
    
    res.status(200).json({ 
      success: true,
      triggered: triggeredAlerts.length,
      alerts: triggeredAlerts,
      message: `Processed price update for ${ticker}, triggered ${triggeredAlerts.length} alerts`
    });
  } catch (error) {
    console.error('Error processing price update:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}