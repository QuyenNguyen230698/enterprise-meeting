export default defineNuxtPlugin(() => {
  // Global confirm modal setup
  return {
    provide: {
      confirm: useConfirm
    }
  }
})
