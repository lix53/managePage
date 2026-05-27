import { defineStore } from 'pinia'
import { USERS } from '@/mock/data'

export const useUserStore = defineStore('user', {
  state: () => ({
    current: JSON.parse(localStorage.getItem('blackmart_user') || 'null')
  }),
  getters: {
    isBoss: (s) => s.current?.role === 'boss',
    isLogged: (s) => !!s.current,
    name: (s) => s.current?.name || '-',
    role: (s) => s.current?.role || ''
  },
  actions: {
    login(userId) {
      const u = USERS.find(x => x.id === userId)
      if (!u) return false
      this.current = u
      localStorage.setItem('blackmart_user', JSON.stringify(u))
      return true
    },
    logout() {
      this.current = null
      localStorage.removeItem('blackmart_user')
    }
  }
})
