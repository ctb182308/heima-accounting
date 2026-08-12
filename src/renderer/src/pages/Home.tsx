import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/stores/userStore'
import { useTransactionStore } from '@/stores/transactionStore'
import { formatAmount, formatDate, getCurrentMonth } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()
  const { currentUser } = useUserStore()
  const { transactions, getTransactions } = useTransactionStore()
  const [monthExpense, setMonthExpense] = useState(0)
  const [monthIncome, setMonthIncome] = useState(0)
  const [todayExpense, setTodayExpense] = useState(0)

  useEffect(() => {
    if (currentUser) {
      const now = new Date()
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
      const monthEnd = formatDate(now)
      getTransactions(currentUser.id, { startDate: monthStart, endDate: monthEnd })
    }
  }, [currentUser])

  useEffect(() => {
    const today = formatDate(new Date())
    let expense = 0
    let income = 0
    let todayExp = 0

    transactions.forEach((t) => {
      if (t.type === 'expense') {
        expense += t.amount
        if (t.transaction_date === today) todayExp += t.amount
      } else {
        income += t.amount
      }
    })

    setMonthExpense(expense)
    setMonthIncome(income)
    setTodayExpense(todayExp)
  }, [transactions])

  // 最近 5 条记录
  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">首页</h2>
        <button
          onClick={() => navigate('/add')}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          记一笔
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-card">
          <p className="text-sm text-text-secondary mb-1">本月支出</p>
          <p className="text-2xl font-semibold text-danger">{formatAmount(monthExpense)}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card">
          <p className="text-sm text-text-secondary mb-1">本月收入</p>
          <p className="text-2xl font-semibold text-success">{formatAmount(monthIncome)}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card">
          <p className="text-sm text-text-secondary mb-1">今日支出</p>
          <p className="text-2xl font-semibold text-text-primary">{formatAmount(todayExpense)}</p>
        </div>
      </div>

      {/* 结余卡片 */}
      <div className="bg-primary rounded-xl p-5 text-white">
        <p className="text-sm opacity-80 mb-1">本月结余</p>
        <p className="text-3xl font-semibold">{formatAmount(monthIncome - monthExpense)}</p>
      </div>

      {/* 最近记录 */}
      <div className="bg-card rounded-xl shadow-card">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-medium text-text-primary">最近记录</h3>
          <button
            onClick={() => navigate('/transactions')}
            className="text-sm text-text-secondary hover:text-primary transition-colors"
          >
            查看全部
          </button>
        </div>
        <div className="divide-y divide-border">
          {recentTransactions.length === 0 ? (
            <div className="px-5 py-8 text-center text-text-secondary text-sm">
              暂无记录，点击"记一笔"开始记账吧
            </div>
          ) : (
            recentTransactions.map((t) => (
              <div key={t.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      t.type === 'income' ? 'bg-success/10' : 'bg-danger/10'
                    }`}
                  >
                    {t.type === 'income' ? (
                      <ArrowUpRight size={16} className="text-success" />
                    ) : (
                      <ArrowDownRight size={16} className="text-danger" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-text-primary">{t.note || (t.type === 'income' ? '收入' : '支出')}</p>
                    <p className="text-xs text-text-secondary">{t.transaction_date}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-medium ${
                    t.type === 'income' ? 'text-success' : 'text-danger'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
