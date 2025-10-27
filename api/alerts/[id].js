import { alertManager } from '../../lib/alertManager.js';

export default async function handler(req, res) {
  const { id } = req.query;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'DELETE') {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      if (!id) {
        return res.status(400).json({ error: 'Alert ID required' });
      }

      await alertManager.removeAlert(userId, id);
      res.status(200).json({ 
        success: true,
        message: 'Alert deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}