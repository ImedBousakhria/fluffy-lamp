import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  updateProductFromSocket,
  addProductFromSocket,
  removeProductFromSocket
} from '../features/products/productsSlice';

/**
 * Custom hook for WebSocket connection
 * @param {string} url - WebSocket server URL
 */
const useWebSocket = (url = 'wss://fluffy-lamp.onrender.com') => {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      // Create WebSocket connection
      const ws = new WebSocket(url);
      wsRef.current = ws;

      // Connection opened
      ws.onopen = () => {
        console.log('✅ WebSocket Connected');
        // Authenticate with JWT if needed
        const token = localStorage.getItem('token');
        if (token) {
          ws.send(JSON.stringify({ type: 'AUTH', token }));
        }
      };

      // Listen for messages
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message:', data);

          // Handle different event types
          switch (data.type) {
            case 'PRODUCT_UPDATED':
              dispatch(updateProductFromSocket(data.product));
              break;
            case 'PRODUCT_CREATED':
              dispatch(addProductFromSocket(data.product));
              break;
            case 'PRODUCT_DELETED':
              dispatch(removeProductFromSocket(data.productId));
              break;
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      // Connection closed
      ws.onclose = () => {
        console.log('🔌 WebSocket Disconnected');
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connect();
        }, 5000);
      };

      // Connection error
      ws.onerror = (error) => {
        console.error('❌ WebSocket Error:', error);
        ws.close();
      };
    };

    // Initial connection
    connect();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, dispatch]);

  // Send message function
  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return { sendMessage };
};

export default useWebSocket;