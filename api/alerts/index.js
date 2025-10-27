import { alertManager } from '../../lib/alertManager.js';
import { validateAlertData } from '../../lib/utils.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Create new alert
    try {
      const { userId, ticker, targetPrice, direction } = req.body;
      
      if (!userId || !ticker || !targetPrice || !direction) {
        return res.status(400).json({ 
          error: 'Missing required fields: userId, ticker, targetPrice, direction' 
        });
      }

      const errors = validateAlertData({ userId, ticker, targetPrice, direction });
      if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
      }

      const alertId = await alertManager.setAlert(
        userId, 
        ticker.toUpperCase(), 
        targetPrice, 
        direction
      );
      
      res.status(201).json({ 
        alertId, 
        success: true,
        message: 'Alert created successfully'
      });
    } catch (error) {
      console.error('Error creating alert:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  } 
  else if (req.method === 'GET') {
    // Get alerts for user
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const alerts = await alertManager.getUserAlerts(userId);
      res.status(200).json({ 
        success: true,
        alerts 
      });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}