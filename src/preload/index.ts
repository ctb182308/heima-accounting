import { contextBridge, ipcRenderer } from 'electron'

// 暴露安全的 IPC API 给渲染进程
contextBridge.exposeInMainWorld('api', {
  // 用户相关
  register: (username: string, password: string) => ipcRenderer.invoke('user:register', username, password),
  login: (username: string, password: string) => ipcRenderer.invoke('user:login', username, password),
  getUsers: () => ipcRenderer.invoke('user:getUsers'),

  // 账单相关
  addTransaction: (transaction: any) => ipcRenderer.invoke('transaction:add', transaction),
  getTransactions: (userId: number, filters?: any) => ipcRenderer.invoke('transaction:getList', userId, filters),
  updateTransaction: (transaction: any) => ipcRenderer.invoke('transaction:update', transaction),
  deleteTransaction: (id: number) => ipcRenderer.invoke('transaction:delete', id),

  // 分类相关
  getCategories: (type?: string) => ipcRenderer.invoke('category:getList', type),

  // 预算相关
  setBudget: (budget: any) => ipcRenderer.invoke('budget:set', budget),
  getBudget: (userId: number, month: string) => ipcRenderer.invoke('budget:get', userId, month),

  // 统计相关
  getStatistics: (userId: number, startDate: string, endDate: string) =>
    ipcRenderer.invoke('statistics:get', userId, startDate, endDate),

  // 数据管理
  exportCSV: (userId: number, startDate: string, endDate: string) =>
    ipcRenderer.invoke('data:exportCSV', userId, startDate, endDate)
})
