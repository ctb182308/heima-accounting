import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js'
import { app } from 'electron'
import { join } from 'path'
import * as fs from 'fs'
import bcrypt from 'bcryptjs'
import type { User, Transaction, Category, Budget, StatisticsData, TransactionType } from '../shared/types'

// 数据库实例
let db: SqlJsDatabase

// 初始化数据库（异步）
export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs()
  const dbPath = join(app.getPath('userData'), 'heima-accounting.db')

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  // 启用外键
  db.run('PRAGMA foreign_keys = ON')

  createTables()
  initCategories()
}

// 保存数据库到文件
function saveDatabase(): void {
  const dbPath = join(app.getPath('userData'), 'heima-accounting.db')
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(dbPath, buffer)
}

// 执行查询并返回格式化结果
function queryAll(sql: string, params: any[] = []): any[] {
  const stmt = db.prepare(sql)
  if (params.length > 0) {
    stmt.bind(params)
  }
  const results: any[] = []
  while (stmt.step()) {
    results.push(stmt.getAsObject())
  }
  stmt.free()
  return results
}

// 执行查询并返回单个结果
function queryOne(sql: string, params: any[] = []): any | null {
  const results = queryAll(sql, params)
  return results.length > 0 ? results[0] : null
}

// 执行修改操作
function runSql(sql: string, params: any[] = []): void {
  db.run(sql, params)
  saveDatabase()
}

// 创建数据表
function createTables(): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      nickname TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      is_necessary INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      amount DECIMAL(10,2) NOT NULL,
      category_id INTEGER NOT NULL,
      is_necessary INTEGER DEFAULT 0,
      note TEXT,
      transaction_date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      month TEXT NOT NULL,
      total_budget DECIMAL(10,2) DEFAULT 0,
      necessary_budget DECIMAL(10,2) DEFAULT 0,
      unnecessary_budget DECIMAL(10,2) DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  saveDatabase()
}

// 初始化分类数据
function initCategories(): void {
  const count = queryOne('SELECT COUNT(*) as count FROM categories')
  if (count && count.count > 0) return

  const categories = [
    // 必要支出
    ['餐饮', '🍚', 'expense', 1, 1],
    ['居住', '🏠', 'expense', 1, 2],
    ['交通', '🚗', 'expense', 1, 3],
    ['医疗', '💊', 'expense', 1, 4],
    ['日用', '🛒', 'expense', 1, 5],
    // 非必要支出
    ['娱乐', '🎮', 'expense', 0, 6],
    ['购物', '👗', 'expense', 0, 7],
    ['社交', '🎁', 'expense', 0, 8],
    ['学习', '📚', 'expense', 0, 9],
    ['旅游', '✈️', 'expense', 0, 10],
    // 收入
    ['工资', '💰', 'income', 0, 1],
    ['奖金', '🎉', 'income', 0, 2],
    ['投资', '📈', 'income', 0, 3],
    ['兼职', '💼', 'income', 0, 4],
    ['其他', '🎁', 'income', 0, 5]
  ]

  const stmt = db.prepare(`
    INSERT INTO categories (name, icon, type, is_necessary, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `)

  for (const cat of categories) {
    stmt.bind(cat)
    stmt.step()
    stmt.reset()
  }
  stmt.free()

  saveDatabase()
}

// ==================== 用户操作 ====================

export function registerUser(username: string, password: string): { success: boolean; message: string } {
  try {
    const existing = queryOne('SELECT id FROM users WHERE username = ?', [username])
    if (existing) {
      return { success: false, message: '用户名已存在' }
    }

    const passwordHash = bcrypt.hashSync(password, 10)
    runSql('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, passwordHash])
    return { success: true, message: '注册成功' }
  } catch (error) {
    return { success: false, message: '注册失败: ' + (error as Error).message }
  }
}

export function loginUser(username: string, password: string): { success: boolean; user?: User; message: string } {
  const user = queryOne('SELECT * FROM users WHERE username = ?', [username])
  if (!user) {
    return { success: false, message: '用户名或密码错误' }
  }

  if (!bcrypt.compareSync(password, user.password_hash)) {
    return { success: false, message: '用户名或密码错误' }
  }

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      nickname: user.nickname || undefined,
      avatar: user.avatar || undefined,
      created_at: user.created_at
    },
    message: '登录成功'
  }
}

export function getUsers(): User[] {
  const users = queryAll('SELECT id, username, nickname, avatar, created_at FROM users')
  return users.map((u: any) => ({
    id: u.id,
    username: u.username,
    nickname: u.nickname || undefined,
    avatar: u.avatar || undefined,
    created_at: u.created_at
  }))
}

// ==================== 账单操作 ====================

export function addTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Transaction {
  runSql(
    `INSERT INTO transactions (user_id, type, amount, category_id, is_necessary, note, transaction_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      transaction.user_id,
      transaction.type,
      transaction.amount,
      transaction.category_id,
      transaction.is_necessary ? 1 : 0,
      transaction.note || null,
      transaction.transaction_date
    ]
  )

  const result = queryOne('SELECT last_insert_rowid() as id')
  return queryOne('SELECT * FROM transactions WHERE id = ?', [result.id]) as Transaction
}

export function getTransactions(
  userId: number,
  filters?: { startDate?: string; endDate?: string; type?: TransactionType; categoryId?: number }
): Transaction[] {
  let sql = 'SELECT * FROM transactions WHERE user_id = ?'
  const params: any[] = [userId]

  if (filters?.startDate) {
    sql += ' AND transaction_date >= ?'
    params.push(filters.startDate)
  }
  if (filters?.endDate) {
    sql += ' AND transaction_date <= ?'
    params.push(filters.endDate)
  }
  if (filters?.type) {
    sql += ' AND type = ?'
    params.push(filters.type)
  }
  if (filters?.categoryId) {
    sql += ' AND category_id = ?'
    params.push(filters.categoryId)
  }

  sql += ' ORDER BY transaction_date DESC, created_at DESC'

  return queryAll(sql, params) as Transaction[]
}

export function updateTransaction(transaction: Transaction): Transaction {
  runSql(
    `UPDATE transactions
     SET type = ?, amount = ?, category_id = ?, is_necessary = ?, note = ?, transaction_date = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      transaction.type,
      transaction.amount,
      transaction.category_id,
      transaction.is_necessary ? 1 : 0,
      transaction.note || null,
      transaction.transaction_date,
      transaction.id
    ]
  )

  return queryOne('SELECT * FROM transactions WHERE id = ?', [transaction.id]) as Transaction
}

export function deleteTransaction(id: number): void {
  runSql('DELETE FROM transactions WHERE id = ?', [id])
}

// ==================== 分类操作 ====================

export function getCategories(type?: TransactionType): Category[] {
  if (type) {
    return queryAll('SELECT * FROM categories WHERE type = ? ORDER BY sort_order', [type]) as Category[]
  }
  return queryAll('SELECT * FROM categories ORDER BY type, sort_order') as Category[]
}

// ==================== 预算操作 ====================

export function setBudget(budget: Omit<Budget, 'id'>): Budget {
  const existing = queryOne('SELECT id FROM budgets WHERE user_id = ? AND month = ?', [budget.user_id, budget.month])

  if (existing) {
    runSql(
      `UPDATE budgets SET total_budget = ?, necessary_budget = ?, unnecessary_budget = ?
       WHERE id = ?`,
      [budget.total_budget, budget.necessary_budget, budget.unnecessary_budget, existing.id]
    )
    return queryOne('SELECT * FROM budgets WHERE id = ?', [existing.id]) as Budget
  }

  runSql(
    `INSERT INTO budgets (user_id, month, total_budget, necessary_budget, unnecessary_budget)
     VALUES (?, ?, ?, ?, ?)`,
    [budget.user_id, budget.month, budget.total_budget, budget.necessary_budget, budget.unnecessary_budget]
  )

  const result = queryOne('SELECT last_insert_rowid() as id')
  return queryOne('SELECT * FROM budgets WHERE id = ?', [result.id]) as Budget
}

export function getBudget(userId: number, month: string): Budget | null {
  return queryOne('SELECT * FROM budgets WHERE user_id = ? AND month = ?', [userId, month]) as Budget || null
}

// ==================== 统计操作 ====================

export function getStatistics(userId: number, startDate: string, endDate: string): StatisticsData {
  // 总收入
  const incomeResult = queryOne(
    `SELECT COALESCE(SUM(amount), 0) as total
     FROM transactions WHERE user_id = ? AND type = 'income'
     AND transaction_date >= ? AND transaction_date <= ?`,
    [userId, startDate, endDate]
  )

  // 总支出
  const expenseResult = queryOne(
    `SELECT COALESCE(SUM(amount), 0) as total
     FROM transactions WHERE user_id = ? AND type = 'expense'
     AND transaction_date >= ? AND transaction_date <= ?`,
    [userId, startDate, endDate]
  )

  // 按分类统计支出
  const expenseByCategory = queryAll(
    `SELECT c.*, COALESCE(SUM(t.amount), 0) as total
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = ? AND t.type = 'expense'
     AND t.transaction_date >= ? AND t.transaction_date <= ?
     GROUP BY c.id
     ORDER BY total DESC`,
    [userId, startDate, endDate]
  )

  // 按分类统计收入
  const incomeByCategory = queryAll(
    `SELECT c.*, COALESCE(SUM(t.amount), 0) as total
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = ? AND t.type = 'income'
     AND t.transaction_date >= ? AND t.transaction_date <= ?
     GROUP BY c.id
     ORDER BY total DESC`,
    [userId, startDate, endDate]
  )

  return {
    total_income: incomeResult?.total || 0,
    total_expense: expenseResult?.total || 0,
    balance: (incomeResult?.total || 0) - (expenseResult?.total || 0),
    expense_by_category: expenseByCategory,
    income_by_category: incomeByCategory
  }
}

// ==================== 数据导出 ====================

export function exportCSV(userId: number, startDate: string, endDate: string): string {
  const transactions = getTransactions(userId, { startDate, endDate })

  const header = '日期,类型,金额,分类,是否必要,备注\n'
  const rows = transactions.map(t => {
    const category = queryOne('SELECT name FROM categories WHERE id = ?', [t.category_id])
    return `${t.transaction_date},${t.type === 'income' ? '收入' : '支出'},${t.amount},${category?.name || '未知'},${t.is_necessary ? '是' : '否'},"${t.note || ''}"`
  }).join('\n')

  return '﻿' + header + rows
}
