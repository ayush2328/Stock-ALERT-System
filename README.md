# Stock Alert System with 3D Visualization

A real-time stock price alert system with immersive Three.js 3D visualization, built with Vercel serverless functions and Redis KV storage.

## 🚀 Features

- **3D Visualization**: Four different visualization modes using Three.js
- **Real-time Alerts**: Price alert system with Heap + Hash Table architecture
- **Multiple Views**: Network, Particles, Data Waves, and Stock Cubes visualizations
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live visualization updates based on system statistics

## 🎨 Visualization Modes

1. **Network View**: Interactive node network showing system connections
2. **Particles**: Dynamic particle system representing data flow
3. **Data Waves**: Animated sine waves showing real-time data patterns
4. **Stock Cubes**: Rotating cubes representing different stock tickers

## 🏗️ Architecture

- **Frontend**: Three.js 3D visualization + HTML/CSS/JavaScript
- **Backend**: Vercel serverless functions (API routes)
- **Storage**: Vercel KV (Redis) for efficient alert management
- **Algorithm**: Heap + Hash Table for O(1) lookups and O(log M) alert processing

## 📊 API Endpoints

- `POST /api/alerts` - Create new alert
- `GET /api/alerts?userId=123` - Get user alerts
- `DELETE /api/alerts/[id]` - Delete alert
- `POST /api/price-update` - Process price update
- `GET /api/stats` - System statistics

## 🛠️ Local Development

1. Install dependencies:
```bash
npm install