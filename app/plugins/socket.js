import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const { backendUrl } = useRuntimeConfig().public
  const socket = io(backendUrl, {
    autoConnect: false,
    transports: ['websocket']
  })

  return {
    provide: {
      socket
    }
  }
})
