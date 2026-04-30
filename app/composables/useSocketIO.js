import { ref, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

let socketInstance = null;
let connectionCount = 0;



export const useSocketIO = () => {
  const config = useRuntimeConfig();
  // Biến để tắt Socket.IO tạm thời (set true để disable)
  const DISABLE_SOCKET = config.public.DISABLE_SOCKET == 'true';
  const authStore = useAuthStore();
  const isConnected = ref(false);
  const isConnecting = ref(false);
  const error = ref(null);

  const REALTIME_SERVER = config.public.realtimeServer;

  const connect = () => {
    // Nếu Socket.IO bị disable, return null và không kết nối
    
    if (DISABLE_SOCKET) {
      return null;
    }

    if (socketInstance?.connected) {
      isConnected.value = true;
      connectionCount++;
      return socketInstance;
    }

    if (isConnecting.value) {
      return socketInstance;
    }

    const token = authStore.accessToken;
    if (!token) {
      error.value = 'No authentication token available';
      console.error('[SocketIO] Cannot connect without token. Please login first.');
      return null;
    }

    isConnecting.value = true;

    socketInstance = io(REALTIME_SERVER, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 20000
    });

    socketInstance.on('connect', () => {
      isConnected.value = true;
      isConnecting.value = false;
      error.value = null;
    });

    socketInstance.on('disconnect', (reason) => {
      isConnected.value = false;
    });

    socketInstance.on('connect_error', (err) => {
      isConnecting.value = false;
      error.value = err.message;
      console.error('[SocketIO] Connection error:', err.message);
    });

    socketInstance.on('error', (err) => {
      error.value = err.message;
      console.error('[SocketIO] Socket error:', err);
    });

    connectionCount++;
    return socketInstance;
  };

  const disconnect = () => {
    connectionCount--;
    
    if (connectionCount <= 0 && socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
      isConnected.value = false;
      connectionCount = 0;
    }
  };

  const getSocket = () => {
    if (!socketInstance) {
      return connect();
    }
    return socketInstance;
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    connect,
    disconnect,
    getSocket,
    isConnected,
    isConnecting,
    error
  };
};
