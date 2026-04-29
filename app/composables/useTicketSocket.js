import { ref, onUnmounted } from 'vue';

export const useTicketSocket = () => {
  const { connect, getSocket, isConnected } = useSocketIO();
  const currentTicketId = ref(null);
  const listeners = ref({});
  let reconnectHandler = null;

  const joinTicket = (ticketId) => {
    // Ensure connection before joining
    connect();
    const socket = getSocket();
    if (!socket) {
      console.error('[TicketSocket] No socket available');
      return;
    }

    if (currentTicketId.value) {
      leaveTicket(currentTicketId.value);
    }

    currentTicketId.value = ticketId;
    socket.emit('ticket:join', ticketId);

    socket.emit('notification:join');
    
    // Setup reconnect handler to rejoin ticket room after reconnection
    if (!reconnectHandler) {
      reconnectHandler = () => {
        if (currentTicketId.value) {
          socket.emit('ticket:join', currentTicketId.value);
          socket.emit('notification:join');
        }
      };
      socket.on('connect', reconnectHandler);
    }
  };

  const leaveTicket = (ticketId) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('ticket:leave', ticketId || currentTicketId.value);
    
    if (ticketId === currentTicketId.value || !ticketId) {
      currentTicketId.value = null;
    }
  };

  const onNewComment = (callback) => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (data) => {
      callback(data);
    };

    socket.on('ticket:new_comment', handler);
    listeners.value['ticket:new_comment'] = handler;
  };

  const onStatusChange = (callback) => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (data) => {
      callback(data);
    };

    socket.on('ticket:status_change', handler);
    listeners.value['ticket:status_change'] = handler;
  };

  const onDeleteComment = (callback) => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (data) => {
      callback(data);
    };

    socket.on('ticket:delete_comment', handler);
    listeners.value['ticket:delete_comment'] = handler;
  };

  const onUserTyping = (callback) => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (data) => {
      callback(data);
    };

    socket.on('ticket:user_typing', handler);
    listeners.value['ticket:user_typing'] = handler;
  };

  const emitTyping = (ticketId, isTyping) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('ticket:typing', { ticketId, isTyping });
  };

  const cleanup = () => {
    const socket = getSocket();
    if (!socket) return;

    Object.entries(listeners.value).forEach(([event, handler]) => {
      socket.off(event, handler);
    });
    
    // Remove reconnect handler
    if (reconnectHandler) {
      socket.off('connect', reconnectHandler);
      reconnectHandler = null;
    }
    
    listeners.value = {};

    if (currentTicketId.value) {
      leaveTicket(currentTicketId.value);
    }
  };

  onUnmounted(() => {
    cleanup();
  });

  return {
    joinTicket,
    leaveTicket,
    onNewComment,
    onStatusChange,
    onDeleteComment,
    onUserTyping,
    emitTyping,
    isConnected,
    cleanup
  };
};
