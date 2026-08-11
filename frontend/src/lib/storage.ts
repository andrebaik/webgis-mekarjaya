const TOKEN_KEY = 'webgis_admin_token'
const USERNAME_KEY = 'webgis_admin_username'

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  getUsername: () => localStorage.getItem(USERNAME_KEY),
  setUsername: (name: string) => localStorage.setItem(USERNAME_KEY, name),
  removeUsername: () => localStorage.removeItem(USERNAME_KEY),
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USERNAME_KEY)
  },
}
