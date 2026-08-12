import { create } from 'zustand'
import type { Transaction, Category, TransactionType } from '@shared/types'

interface TransactionState {
  transactions: Transaction[]
  categories: Category[]
  loading: boolean

  // 账单操作
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  getTransactions: (userId: number, filters?: any) => Promise<void>
  updateTransaction: (transaction: Transaction) => Promise<void>
  deleteTransaction: (id: number) => Promise<void>

  // 分类操作
  loadCategories: (type?: TransactionType) => Promise<void>
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  categories: [],
  loading: false,

  addTransaction: async (transaction) => {
    await window.api.addTransaction(transaction)
    // 刷新列表
    await get().getTransactions(transaction.user_id)
  },

  getTransactions: async (userId, filters) => {
    set({ loading: true })
    try {
      const transactions = await window.api.getTransactions(userId, filters)
      set({ transactions, loading: false })
    } catch (error) {
      set({ loading: false })
      console.error('获取账单列表失败:', error)
    }
  },

  updateTransaction: async (transaction) => {
    await window.api.updateTransaction(transaction)
    await get().getTransactions(transaction.user_id)
  },

  deleteTransaction: async (id) => {
    await window.api.deleteTransaction(id)
    // 从本地状态移除
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id)
    }))
  },

  loadCategories: async (type) => {
    const categories = await window.api.getCategories(type)
    set({ categories })
  }
}))
