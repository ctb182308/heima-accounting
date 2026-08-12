import { useState, useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { formatAmount } from '@/lib/utils'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5856D6', '#FF2D55']

export default function Statistics() {
  const { currentUser } = useUserStore()
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      loadStats()
    }
  }, [currentUser, period])

  const loadStats = async () => {
    if (!currentUser) return
    setLoading(true)

    const now = new Date()
    let startDate = ''
    let endDate = now.toISOString().split('T')[0]

    if (period === 'week') {
      const d = new Date(now)
      d.setDate(d.getDate() - 7)
      startDate = d.toISOString().split('T')[0]
    } else if (period === 'month') {
      startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    } else {
      startDate = `${now.getFullYear()}-01-01`
    }

    const data = await window.api.getStatistics(currentUser.id, startDate, endDate)
    setStats(data)
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-text-secondary">加载中...</div>
  }

  const expenseData = stats?.expense_by_category?.map((item: any) => ({
    name: item.name,
    value: item.total
  })) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">统计</h2>
        <div className="flex bg-card rounded-lg p-1 shadow-card">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                period === p ? 'bg-primary text-white' : 'text-text-secondary'
              }`}
            >
              {p === 'week' ? '本周' : p === 'month' ? '本月' : '本年'}
            </button>
          ))}
        </div>
      </div>

      {/* 总览卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-card">
          <p className="text-sm text-text-secondary mb-1">总收入</p>
          <p className="text-2xl font-semibold text-success">{formatAmount(stats?.total_income || 0)}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card">
          <p className="text-sm text-text-secondary mb-1">总支出</p>
          <p className="text-2xl font-semibold text-danger">{formatAmount(stats?.total_expense || 0)}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card">
          <p className="text-sm text-text-secondary mb-1">结余</p>
          <p className="text-2xl font-semibold text-text-primary">{formatAmount(stats?.balance || 0)}</p>
        </div>
      </div>

      {/* 支出分类占比 */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <h3 className="font-medium text-text-primary mb-4">支出分类占比</h3>
        {expenseData.length === 0 ? (
          <p className="text-center text-text-secondary py-8">暂无支出数据</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {expenseData.map((_: any, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatAmount(value)} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
