import { useState, useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useTransactionStore } from '@/stores/transactionStore'
import { formatAmount, getCurrentMonth } from '@/lib/utils'
import { AlertTriangle, CheckCircle } from 'lucide-react'

export default function Budget() {
  const { currentUser } = useUserStore()
  const { transactions, getTransactions } = useTransactionStore()
  const [totalBudget, setTotalBudget] = useState(0)
  const [necessaryBudget, setNecessaryBudget] = useState(0)
  const [unnecessaryBudget, setUnnecessaryBudget] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const currentMonth = getCurrentMonth()

  useEffect(() => {
    if (currentUser) {
      loadBudget()
      getTransactions(currentUser.id, {
        startDate: `${currentMonth}-01`,
        endDate: new Date().toISOString().split('T')[0],
        type: 'expense'
      })
    }
  }, [currentUser])

  const loadBudget = async () => {
    if (!currentUser) return
    setLoading(true)
    const budget = await window.api.getBudget(currentUser.id, currentMonth)
    if (budget) {
      setTotalBudget(budget.total_budget)
      setNecessaryBudget(budget.necessary_budget)
      setUnnecessaryBudget(budget.unnecessary_budget)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!currentUser) return
    setSaving(true)
    await window.api.setBudget({
      user_id: currentUser.id,
      month: currentMonth,
      total_budget: totalBudget,
      necessary_budget: necessaryBudget,
      unnecessary_budget: unnecessaryBudget
    })
    setSaving(false)
  }

  // 计算已花费
  const totalExpense = transactions.reduce((sum, t) => sum + t.amount, 0)
  const necessaryExpense = transactions.filter((t) => t.is_necessary).reduce((sum, t) => sum + t.amount, 0)
  const unnecessaryExpense = transactions.filter((t) => !t.is_necessary).reduce((sum, t) => sum + t.amount, 0)

  // 计算进度百分比
  const getProgress = (spent: number, budget: number) => {
    if (budget === 0) return 0
    return Math.min((spent / budget) * 100, 100)
  }

  const getStatusColor = (spent: number, budget: number) => {
    if (budget === 0) return 'bg-gray-200'
    const ratio = spent / budget
    if (ratio >= 1) return 'bg-danger'
    if (ratio >= 0.8) return 'bg-warning'
    return 'bg-success'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">预算管理</h2>
      <p className="text-sm text-text-secondary">{currentMonth} 月度预算</p>

      {/* 预算设置 */}
      <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
        <h3 className="font-medium text-text-primary">设置预算</h3>

        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">总预算（元）</label>
          <input
            type="number"
            value={totalBudget || ''}
            onChange={(e) => setTotalBudget(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="输入月度总预算"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">必要支出预算</label>
            <input
              type="number"
              value={necessaryBudget || ''}
              onChange={(e) => setNecessaryBudget(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">非必要支出预算</label>
            <input
              type="number"
              value={unnecessaryBudget || ''}
              onChange={(e) => setUnnecessaryBudget(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="0"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存预算'}
        </button>
      </div>

      {/* 预算进度 */}
      {totalBudget > 0 && (
        <div className="bg-card rounded-xl p-5 shadow-card space-y-5">
          <h3 className="font-medium text-text-primary">预算使用情况</h3>

          {/* 总预算 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-primary">总预算</span>
              <span className="text-sm text-text-secondary">
                {formatAmount(totalExpense)} / {formatAmount(totalBudget)}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getStatusColor(totalExpense, totalBudget)}`}
                style={{ width: `${getProgress(totalExpense, totalBudget)}%` }}
              />
            </div>
            {totalExpense / totalBudget >= 0.8 && (
              <p className="text-xs text-warning mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {totalExpense / totalBudget >= 1 ? '已超出预算！' : '即将超出预算'}
              </p>
            )}
          </div>

          {/* 必要支出 */}
          {necessaryBudget > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-primary">必要支出</span>
                <span className="text-sm text-text-secondary">
                  {formatAmount(necessaryExpense)} / {formatAmount(necessaryBudget)}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getStatusColor(necessaryExpense, necessaryBudget)}`}
                  style={{ width: `${getProgress(necessaryExpense, necessaryBudget)}%` }}
                />
              </div>
            </div>
          )}

          {/* 非必要支出 */}
          {unnecessaryBudget > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-primary">非必要支出</span>
                <span className="text-sm text-text-secondary">
                  {formatAmount(unnecessaryExpense)} / {formatAmount(unnecessaryBudget)}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getStatusColor(unnecessaryExpense, unnecessaryBudget)}`}
                  style={{ width: `${getProgress(unnecessaryExpense, unnecessaryBudget)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
