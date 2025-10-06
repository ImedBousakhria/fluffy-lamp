const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

/**
 * Initialize WebSocket Server
 */
const initWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log('🔌 New WebSocket connection');

    // Handle messages from client
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        // Handle authentication
        if (data.type === 'AUTH' && data.token) {
          try {
            const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
            ws.userId = decoded.id;
            ws.isAuthenticated = true;
            console.log('WebSocket client authenticated:', decoded.id);
            
            // Send confirmation
            ws.send(JSON.stringify({
              type: 'AUTH_SUCCESS',
              message: 'Authentication successful'
            }));
          } catch (error) {
            console.error('WebSocket auth failed:', error.message);
            ws.send(JSON.stringify({
              type: 'AUTH_FAILED',
              message: 'Invalid token'
            }));
            ws.close();
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Handle client disconnect
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Send initial connection message
    ws.send(JSON.stringify({
      type: 'CONNECTED',
      message: 'Connected to Product Manager WebSocket'
    }));
  });

  console.log('WebSocket server initialized');
  return wss;
};

module.exports = { initWebSocket };