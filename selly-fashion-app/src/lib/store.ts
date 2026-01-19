import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, UserProfile } from './supabase'

export interface CartItemStore {
  id: string
  product: Product
  quantity: number
  size: string
  color: string
}

interface CartStore {
  items: CartItemStore[]
  isOpen: boolean
  addItem: (product: Product, quantity: number, size: string, color: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

interface AuthStore {
  user: UserProfile | null
  isAuthenticated: boolean
  isAdmin: boolean
  setUser: (user: UserProfile | null) => void
  logout: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity, size, color) => {
        const items = get().items
        const existingItem = items.find(
          item => item.product.id === product.id && item.size === size && item.color === color
        )

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isOpen: true
          })
        } else {
          const newItem: CartItemStore = {
            id: `${product.id}-${size}-${color}-${Date.now()}`,
            product,
            quantity,
            size,
            color
          }
          set({ items: [...items, newItem], isOpen: true })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        })
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }),
    {
      name: 'selly-cart',
    }
  )
)

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isAdmin: user?.is_admin || false
      }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        isAdmin: false 
      }),
    }),
    {
      name: 'selly-auth',
    }
  )
)
