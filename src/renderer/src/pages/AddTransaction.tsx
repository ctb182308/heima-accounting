import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/stores/userStore'
import { useTransactionStore } from '@/stores/transactionStore'
import { formatDate } from '@/lib/utils'

export default function AddTransaction() {
  const navigate = useNavigate()
  const { currentUser } = useUserStore()
  const { addTransaction, categories, loadCategories } = useTransactionStore()

  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState<number>(0)
  const [isNecessary, setIsNecessary] = useState(true)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(formatDate(new Date()))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories(type)
  }, [type])

  // 当分类加载后，默认选中第一个
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id)
      if (type === 'expense') {
        setIsNecessary(categories[0].is_necessary)
      }
    }
  }, [categories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !amount || Number(amount) <= 0) return

    setLoading(true)
    try {
      await addTransaction({
        user_id: currentUser.id,
        type,
        amount: Number(amount),
        category_id: categoryId,
        is_necessary: isNecessary,
        note,
        transaction_date: date
      })
      navigate('/')
    } catch (error) {
      console.error('添加账单失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter((c) =>
    type === 'expense' ? true : c.type === 'income'
  )

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">记一笔</h2>

      {/* 收入/支出切换 */}
      <div className="bg-card rounded-xl p-1 flex shadow-card">
        <button
          type="button"
          onClick={() => { setType('expense'); setCategoryId(0) }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            type === 'expense' ? 'bg-danger text-white' : 'text-text-secondary'
          }`}
        >
          支出
        </button>
        <button
          type="button"
          onClick={() => { setType('income'); setCategoryId(0) }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            type === 'income' ? 'bg-success text-white' : 'text-text-secondary'
          }`}
        >
          收入
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 金额输入 */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <label className="text-sm text-text-secondary mb-2 block">金额</label>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl text-text-secondary">¥</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 text-4xl font-semibold text-text-primary border-none outline-none bg-transparent"
              placeholder="0.00"
              autoFocus
            />
          </div>
        </div>

        {/* 必要/非必要切换（仅支出显示） */}
        {type === 'expense' && (
          <div className="bg-card rounded-xl p-1 flex shadow-card">
            <button
              type="button"
              onClick={() => setIsNecessary(true)}
              className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                isNecessary ? 'bg-primary text-white' : 'text-text-secondary'
              }`}
            >
              必要支出
            </button>
            <button
              type="button"
              onClick={() => setIsNecessary(false)}
              className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                !isNecessary ? 'bg-primary text-white' : 'text-text-secondary'
              }`}
            >
              非必要支出
            </button>
          </div>
        )}

        {/* 分类选择 */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <label className="text-sm text-text-secondary mb-3 block">分类</label>
          <div className="grid grid-cols-5 gap-3">
            {filteredCategories
              .filter((c) => type === 'income' || c.is_necessary === isNecessary)
              .map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                    categoryId === cat.id
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs text-text-primary">{cat.name}</span>
                </button>
              ))}
          </div>
        </div>

        {/* 日期和备注 */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">备注（选填）</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="添加备注..."
            />
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading || !amount}
          className={`w-full py-3 rounded-xl font-medium text-white transition-colors disabled:opacity-50 ${
            type === 'expense' ? 'bg-danger hover:bg-danger/90' : 'bg-success hover:bg-success/90'
          }`}
        >
          {loading ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  )
}
