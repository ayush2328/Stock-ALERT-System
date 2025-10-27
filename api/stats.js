import { alertManager } from '../lib/alertManager.js';
import { redisClient } from '../lib/redisClient.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [stats, prices] = await Promise.all([
      alertManager.getSystemStats(),
      redisClient.getAllPrices()
    ]);
    
    res.status(200).json({
      success: true,
      ...stats,
      currentPrices: prices,
      timestamp: Date.now(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}