import { ipcMain } from 'electron'
import * as db from './database'

// 注册所有 IPC 处理器
export function setupIpcHandlers(): void {
  // 用户注册
  ipcMain.handle('user:register', (_, username: string, password: string) => {
    return db.registerUser(username, password)
  })

  // 用户登录
  ipcMain.handle('user:login', (_, username: string, password: string) => {
    return db.loginUser(username, password)
  })

  // 获取用户列表
  ipcMain.handle('user:getUsers', () => {
    return db.getUsers()
  })

  // 添加账单
  ipcMain.handle('transaction:add', (_, transaction) => {
    return db.addTransaction(transaction)
  })

  // 获取账单列表
  ipcMain.handle('transaction:getList', (_, userId, filters) => {
    return db.getTransactions(userId, filters)
  })

  // 更新账单
  ipcMain.handle('transaction:update', (_, transaction) => {
    return db.updateTransaction(transaction)
  })

  // 删除账单
  ipcMain.handle('transaction:delete', (_, id) => {
    return db.deleteTransaction(id)
  })

  // 获取分类列表
  ipcMain.handle('category:getList', (_, type) => {
    return db.getCategories(type)
  })

  // 添加自定义分类
  ipcMain.handle('category:add', (_, category) => {
    return db.addCategory(category)
  })

  // 修改分类
  ipcMain.handle('category:update', (_, id, updates) => {
    return db.updateCategory(id, updates)
  })

  // 删除分类
  ipcMain.handle('category:delete', (_, id) => {
    return db.deleteCategory(id)
  })

  // 设置预算
  ipcMain.handle('budget:set', (_, budget) => {
    return db.setBudget(budget)
  })

  // 获取预算
  ipcMain.handle('budget:get', (_, userId, month) => {
    return db.getBudget(userId, month)
  })

  // 获取统计数据
  ipcMain.handle('statistics:get', (_, userId, startDate, endDate) => {
    return db.getStatistics(userId, startDate, endDate)
  })

  // 导出 CSV
  ipcMain.handle('data:exportCSV', (_, userId, startDate, endDate) => {
    return db.exportCSV(userId, startDate, endDate)
  })
}
