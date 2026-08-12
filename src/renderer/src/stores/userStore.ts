import { create } from 'zustand'
import type { User } from '@shared/types'

interface UserState {
  currentUser: User | null
  users: User[]
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  switchUser: (user: User) => void
  loadUsers: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  users: [],

  login: async (username: string, password: string) => {
    const result = await window.api.login(username, password)
    if (result.success && result.user) {
      set({ currentUser: result.user })
    }
    return result
  },

  register: async (username: string, password: string) => {
    return await window.api.register(username, password)
  },

  logout: () => {
    set({ currentUser: null })
  },

  switchUser: (user: User) => {
    set({ currentUser: user })
  },

  loadUsers: async () => {
    const users = await window.api.getUsers()
    set({ users })
  }
}))
