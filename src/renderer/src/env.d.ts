/// <reference types="vite/client" />

// 预加载脚本暴露的 API 类型
interface Window {
  api: {
    // 用户相关
    register: (username: string, password: string) => Promise<{ success: boolean; message: string }>
    login: (username: string, password: string) => Promise<{ success: boolean; user?: any; message: string }>
    getUsers: () => Promise<any[]>

    // 账单相关
    addTransaction: (transaction: any) => Promise<any>
    getTransactions: (userId: number, filters?: any) => Promise<any[]>
    updateTransaction: (transaction: any) => Promise<any>
    deleteTransaction: (id: number) => Promise<void>

    // 分类相关
    getCategories: (type?: string) => Promise<any[]>

    // 预算相关
    setBudget: (budget: any) => Promise<any>
    getBudget: (userId: number, month: string) => Promise<any>

    // 统计相关
    getStatistics: (userId: number, startDate: string, endDate: string) => Promise<any>

    // 数据管理
    exportCSV: (userId: number, startDate: string, endDate: string) => Promise<string>
  }
}
