import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockNotifications } from '@/services/mock/app.mock'
import type { AppNotification, NotificationType } from '@/types/app.types'

interface NotificationsState {
  items: AppNotification[]
  markRead: (id: string) => void
  markAllRead: () => void
  unreadCount: () => number
  push: (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: mockNotifications,
      markRead: (id) => set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
      unreadCount: () => get().items.filter((n) => !n.read).length,
      push: (n) =>
        set((s) => ({
          items: [{ ...n, id: `n${Date.now()}`, createdAt: new Date().toISOString(), read: false }, ...s.items],
        })),
    }),
    { name: 'cana-notifications' }
  )
)

export type { NotificationType }
