import { ref, onUnmounted } from 'vue';

export const useNotificationSocket = () => {
  const { connect, getSocket, isConnected } = useSocketIO();
  const listeners = ref({});
  const hasJoined = ref(false);
  const isAdmin = ref(false);
  let reconnectHandler = null;

  const joinNotifications = () => {
    connect();
    const socket = getSocket();
    if (!socket) return;

    socket.emit('notification:join');
    hasJoined.value = true;
    
    if (!reconnectHandler) {
      reconnectHandler = () => {
        socket.emit('notification:join');
        if (isAdmin.value) {
          socket.emit('notification:join_admin');
        }
      };
      socket.on('connect', reconnectHandler);
    }
  };

  const joinAdminNotifications = () => {
    connect();
    const socket = getSocket();
    if (!socket) return;

    socket.emit('notification:join_admin');
    isAdmin.value = true;
  };

  const onNewNotification = (handler) => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('notification:new', handler);
    listeners.value['notification:new'] = handler;
  };

  const onNotificationUpdate = (callback) => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('notification:update', callback);
    listeners.value['notification:update'] = callback;
  };

  const markAsRead = (notificationId) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('notification:mark_read', { notificationId });
  };

  const cleanup = () => {
    const socket = getSocket();
    if (!socket) return;

    Object.entries(listeners.value).forEach(([event, handler]) => {
      socket.off(event, handler);
    });
    
    if (reconnectHandler) {
      socket.off('connect', reconnectHandler);
      reconnectHandler = null;
    }
    
    listeners.value = {};
    hasJoined.value = false;
    isAdmin.value = false;
  };

  onUnmounted(() => {
    cleanup();
  });

  return {
    joinNotifications,
    joinAdminNotifications,
    onNewNotification,
    onNotificationUpdate,
    markAsRead,
    isConnected,
    cleanup
  };
};
