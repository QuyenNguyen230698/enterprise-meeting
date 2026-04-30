import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

let socket = null;
const isConnected = ref(false);
const connectionError = ref(null);

/**
 * Composable for Socket.IO real-time connection
 */
export const useRealtimeSocket = () => {
  const config = useRuntimeConfig();
  const DISABLE_SOCKET = config.public.DISABLE_SOCKET == 'true';
  const authStore = useAuthStore();
  const connect = () => {
     if (DISABLE_SOCKET) {
      return null;
    }

    if (socket?.connected) {
      return socket;
    }

    const REALTIME_URL = config.public.realtimeServer;
    const token = authStore.accessToken;

    if (!token) {
      console.warn('[Realtime] No auth token found');
      return null;
    }

    socket = io(REALTIME_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      isConnected.value = true;
      connectionError.value = null;
    });

    socket.on('disconnect', (reason) => {
      isConnected.value = false;
    });

    socket.on('connect_error', (error) => {
      console.error('[Realtime] Connection error:', error);
      connectionError.value = error.message;
      isConnected.value = false;
    });

    socket.on('error', (error) => {
      console.error('[Realtime] Socket error:', error);
      connectionError.value = error.message;
    });

    return socket;
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      isConnected.value = false;
    }
  };

  const getSocket = () => {
    if (!socket || !socket.connected) {
      return connect();
    }
    return socket;
  };

  return {
    socket: getSocket,
    connect,
    disconnect,
    isConnected,
    connectionError
  };
};

/**
 * Composable for campaign real-time events
 */
export const useCampaignRealtime = (campaignId, userId) => {
  const { socket, isConnected } = useRealtimeSocket();
  const progress = ref(null);
  const status = ref(null);
  const sendingStatus = ref(null);
  const recipientUpdates = ref([]); // fixed duplication

  const joinCampaign = (userId) => {
    const s = socket();
    if (s && campaignId && userId) {
      s.emit('campaign:join', { campaignId, userId });
    }
  };

  const leaveCampaign = (userId) => {
    const s = socket();
    if (s && campaignId && userId) {
      s.emit('campaign:leave', { campaignId, userId });
    }
  };

  const setupListeners = () => {
    const s = socket();
    if (!s) return;

    s.on('campaign:joined', (data) => {
    });

    s.on('campaign:progress', (data) => {
      progress.value = data;
    });

    s.on('campaign:status_change', (data) => {
      status.value = data.status;
    });

    s.on('campaign:recipient_update', (data) => {
      recipientUpdates.value.unshift(data);
      // Keep only last 100 updates
      if (recipientUpdates.value.length > 100) {
        recipientUpdates.value = recipientUpdates.value.slice(0, 100);
      }
    });

    s.on('campaign:sending_status', (data) => {
      sendingStatus.value = data;
    });

    s.on('campaign:error', (error) => {
      console.error('[Campaign] Error:', error);
    });
  };

  const removeListeners = () => {
    const s = socket();
    if (!s) return;

    s.off('campaign:joined');
    s.off('campaign:progress');
    s.off('campaign:status_change');
    s.off('campaign:recipient_update');
    s.off('campaign:recipient_update');
    s.off('campaign:sending_status');
    s.off('campaign:error');
  };

  onMounted(() => {
    if (campaignId && userId) {
      setupListeners();
      joinCampaign(userId);
    }
  });

  onUnmounted(() => {
    if (campaignId && userId) {
      leaveCampaign(userId);
      removeListeners();
    }
  });

  return {
    progress,
    status,
    recipientUpdates,
    sendingStatus,
    isConnected,
    joinCampaign,
    leaveCampaign
  };
};
