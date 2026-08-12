import { useState, useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useTransactionStore } from '@/stores/transactionStore'
import { formatAmount } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, Trash2, Edit2 } from 'lucide-react'

export default function TransactionList() {
  const { currentUser } = useUserStore()
  const { transactions, getTransactions, deleteTransaction, categories, loadCategories } = useTransactionStore()
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (currentUser) {
      getTransactions(currentUser.id)
    }
  }, [currentUser])

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这条记录吗？')) {
      await deleteTransaction(id)
    }
  }

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || '未知'
  }

  const getCategoryIcon = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.icon || '📝'
  }

  // 按日期分组
  const groupedTransactions = transactions
    .filter((t) => filterType === 'all' || t.type === filterType)
    .reduce((groups, t) => {
      const date = t.transaction_date
      if (!groups[date]) groups[date] = []
      groups[date].push(t)
      return groups
    }, {} as Record<string, typeof transactions>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">账单</h2>
        <div className="flex bg-card rounded-lg p-1 shadow-card">
          {(['all', 'expense', 'income'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                filterType === type ? 'bg-primary text-white' : 'text-text-secondary'
              }`}
            >
              {type === 'all' ? '全部' : type === 'expense' ? '支出' : '收入'}
            </button>
          ))}
        </div>
      </div>

      {/* 账单列表 */}
      <div className="space-y-4">
        {Object.entries(groupedTransactions).length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center text-text-secondary shadow-card">
            暂无账单记录
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, items]) => (
            <div key={date} className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="px-5 py-2.5 bg-gray-50 border-b border-border">
                <span className="text-sm font-medium text-text-secondary">{date}</span>
              </div>
              <div className="divide-y divide-border">
                {items.map((t) => (
                  <div
                    key={t.id}
                    className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(t.category_id)}</span>
                      <div>
                        <p className="text-sm text-text-primary">{getCategoryName(t.category_id)}</p>
                        {t.note && (
                          <p className="text-xs text-text-secondary mt-0.5">{t.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-medium ${
                          t.type === 'income' ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                      </span>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 text-text-secondary hover:text-danger transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
