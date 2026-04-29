/**
 * Composable for managing Gmail credentials storage
 * Used for public mode test email sending
 */
export const useGmailCredentials = () => {
  const GMAIL_STORAGE_KEY = 'emailer_gmail_credentials'

  // State
  const gmailEmail = ref('')
  const gmailAppPassword = ref('')
  const hasStoredCredentials = ref(false)

  /**
   * Simple encryption for localStorage (base64 + reverse)
   * Note: This is NOT secure encryption, just obfuscation
   */
  const encryptCredentials = (email, password) => {
    const data = JSON.stringify({ e: email, p: password })
    return btoa(data.split('').reverse().join(''))
  }

  /**
   * Decrypt stored credentials
   */
  const decryptCredentials = (encrypted) => {
    try {
      const reversed = atob(encrypted).split('').reverse().join('')
      return JSON.parse(reversed)
    } catch {
      return null
    }
  }

  /**
   * Load stored Gmail credentials from localStorage
   * @returns {boolean} true if credentials were loaded
   */
  const loadStoredGmailCredentials = () => {
    try {
      const stored = localStorage.getItem(GMAIL_STORAGE_KEY)
      if (stored) {
        const creds = decryptCredentials(stored)
        if (creds && creds.e && creds.p) {
          gmailEmail.value = creds.e
          gmailAppPassword.value = creds.p
          hasStoredCredentials.value = true
          return true
        }
      }
    } catch (e) {
      console.error('Failed to load Gmail credentials:', e)
    }
    return false
  }

  /**
   * Save Gmail credentials to localStorage
   */
  const saveGmailCredentials = () => {
    try {
      if (gmailEmail.value && gmailAppPassword.value) {
        const encrypted = encryptCredentials(gmailEmail.value, gmailAppPassword.value)
        localStorage.setItem(GMAIL_STORAGE_KEY, encrypted)
        hasStoredCredentials.value = true
      }
    } catch (e) {
      console.error('Failed to save Gmail credentials:', e)
    }
  }

  /**
   * Reset/clear Gmail credentials from state and localStorage
   */
  const resetGmailCredentials = () => {
    gmailEmail.value = ''
    gmailAppPassword.value = ''
    hasStoredCredentials.value = false
    localStorage.removeItem(GMAIL_STORAGE_KEY)
  }

  return {
    // State
    gmailEmail,
    gmailAppPassword,
    hasStoredCredentials,
    // Methods
    loadStoredGmailCredentials,
    saveGmailCredentials,
    resetGmailCredentials
  }
}
