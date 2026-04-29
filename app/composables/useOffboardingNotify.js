export const useOffboardingNotify = () => {
  const triggerNotification = async (payload) => {
    try {
      await useFetchAuth(`/v1/offboarding/processes/${payload.process_id}/notify`, {
        method: 'POST',
        body: {
          step_number: payload.step_number,
          action:      payload.action,
          note:        payload.note ?? '',
          extra:       payload.extra ?? {},
        },
      })
    } catch (e) {
      console.warn('[offboarding notify] trigger failed:', e)
    }
  }

  return { triggerNotification }
}
