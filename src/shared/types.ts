// 共享类型定义

// 用户类型
export interface User {
  id: number
  username: string
  nickname?: string
  avatar?: string
  created_at: string
}

// 账单类型
export type TransactionType = 'income' | 'expense'

// 账单记录
export interface Transaction {
  id: number
  user_id: number
  type: TransactionType
  amount: number
  category_id: number
  is_necessary: boolean
  note?: string
  transaction_date: string
  created_at: string
  updated_at: string
}

// 分类
export interface Category {
  id: number
  name: string
  icon: string
  type: TransactionType
  is_necessary: boolean
  sort_order: number
  is_system: boolean   // 是否为系统预置分类（不可修改/删除）
}

// 预算
export interface Budget {
  id: number
  user_id: number
  month: string
  total_budget: number
  necessary_budget: number
  unnecessary_budget: number
}

// 统计数据
export interface StatisticsData {
  total_income: number
  total_expense: number
  balance: number
  expense_by_category: { category: Category; total: number }[]
  income_by_category: { category: Category; total: number }[]
}

// IPC 通信接口
export interface IpcApi {
  // 用户相关
  register: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  login: (username: string, password: string) => Promise<{ success: boolean; user?: User; message: string }>
  getUsers: () => Promise<User[]>

  // 账单相关
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<Transaction>
  getTransactions: (userId: number, filters?: {
    startDate?: string
    endDate?: string
    type?: TransactionType
    categoryId?: number
  }) => Promise<Transaction[]>
  updateTransaction: (transaction: Transaction) => Promise<Transaction>
  deleteTransaction: (id: number) => Promise<void>

  // 分类相关
  getCategories: (type?: TransactionType) => Promise<Category[]>
  addCategory: (category: Omit<Category, 'id' | 'is_system'>) => Promise<{ success: boolean; category?: Category; message: string }>
  updateCategory: (id: number, updates: { name?: string; icon?: string; is_necessary?: boolean }) => Promise<{ success: boolean; category?: Category; message: string }>
  deleteCategory: (id: number) => Promise<{ success: boolean; message: string }>

  // 预算相关
  setBudget: (budget: Omit<Budget, 'id'>) => Promise<Budget>
  getBudget: (userId: number, month: string) => Promise<Budget | null>

  // 统计相关
  getStatistics: (userId: number, startDate: string, endDate: string) => Promise<StatisticsData>

  // 数据管理
  exportCSV: (userId: number, startDate: string, endDate: string) => Promise<string>
}
