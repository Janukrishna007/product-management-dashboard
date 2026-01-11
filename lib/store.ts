import { create } from "zustand"
import { storage, STORAGE_KEYS } from "./storage"

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
  thumbnail: string
}

interface Order {
  id: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  createdAt: string
  shippingInfo?: {
    name: string
    email: string
    address: string
    city: string
    zipCode: string
  }
}

interface AuthStore {
  user: { id: number; username: string; token: string } | null
  cart: CartItem[]
  orders: Order[]
  searchQuery: string
  selectedCategory: string
  priceRange: [number, number]
  setUser: (user: any) => void
  logout: () => void
  addToCart: (product: any) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  createOrder: (shippingInfo?: Order["shippingInfo"]) => void
  getOrders: () => Order[]
  setSearchQuery: (query: string) => void
  setCategory: (category: string) => void
  setPriceRange: (range: [number, number]) => void
  clearFilters: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: storage.get(STORAGE_KEYS.USER),
  cart: storage.get<CartItem[]>(STORAGE_KEYS.CART) || [],
  orders: storage.get<Order[]>(STORAGE_KEYS.ORDERS) || [],

  setUser: (user) => {
    set({ user })
    storage.set(STORAGE_KEYS.USER, user)
  },

  logout: () => {
    set({ user: null, cart: [] })
    storage.remove(STORAGE_KEYS.USER)
    storage.remove(STORAGE_KEYS.CART)
  },

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id)
      let newCart: CartItem[]

      if (existing) {
        newCart = state.cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        newCart = [
          ...state.cart,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            thumbnail: product.thumbnail,
          },
        ]
      }

      storage.set(STORAGE_KEYS.CART, newCart)
      return { cart: newCart }
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== productId)
      storage.set(STORAGE_KEYS.CART, newCart)
      return { cart: newCart }
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const newCart = state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
      storage.set(STORAGE_KEYS.CART, newCart)
      return { cart: newCart }
    }),

  clearCart: () => {
    set({ cart: [] })
    storage.remove(STORAGE_KEYS.CART)
  },

  createOrder: (shippingInfo) => {
    const state = get()
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: [...state.cart],
      total: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "pending",
      createdAt: new Date().toISOString(),
      shippingInfo,
    }

    const newOrders = [order, ...state.orders]
    set({ orders: newOrders, cart: [] })
    storage.set(STORAGE_KEYS.ORDERS, newOrders)
    storage.remove(STORAGE_KEYS.CART)
  },

  getOrders: () => get().orders,

  // Filter state
  searchQuery: "",
  selectedCategory: "",
  priceRange: [0, 10000],

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ selectedCategory: category }),
  setPriceRange: (range) => set({ priceRange: range }),
  clearFilters: () => set({ searchQuery: "", selectedCategory: "", priceRange: [0, 10000] }),
}))
