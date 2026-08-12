import { useState, useEffect, useCallback } from 'react'
import { useTransactionStore } from '@/stores/transactionStore'
import type { Category, TransactionType } from '@shared/types'
import { Plus, Pencil, Trash2, Lock, X, Check } from 'lucide-react'

// 可选图标列表
const ICON_OPTIONS = ['🍚', '🏠', '🚗', '💊', '🛒', '🎮', '👗', '🎁', '📚', '✈️', '💰', '🎉', '📈', '💼', '☕', '🐱', '📱', '💄', '🎵', '🏋️', '🌿', '🔧', '📦', '❤️']

export default function Categories() {
  const { categories, loadCategories, addCategory, updateCategory, deleteCategory } = useTransactionStore()

  const [showAddForm, setShowAddForm] = useState<TransactionType | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [categoryMsg, setCategoryMsg] = useState('')

  // 新分类表单
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('📦')
  const [newIsNecessary, setNewIsNecessary] = useState(false)

  // 编辑表单
  const [editName, setEditName] = useState('')
  const [editIcon, setEditIcon] = useState('')
  const [editIsNecessary, setEditIsNecessary] = useState(false)

  // 加载分类
  const refreshCategories = useCallback(async () => {
    await loadCategories()
  }, [loadCategories])

  useEffect(() => {
    refreshCategories()
  }, [refreshCategories])

  // 按类型分组
  const necessaryExpense = categories.filter((c) => c.type === 'expense' && c.is_necessary)
  const unnecessaryExpense = categories.filter((c) => c.type === 'expense' && !c.is_necessary)
  const incomeCategories = categories.filter((c) => c.type === 'income')

  const showCategoryMsg = (msg: string) => {
    setCategoryMsg(msg)
    setTimeout(() => setCategoryMsg(''), 3000)
  }

  // 添加分类
  const handleAdd = async () => {
    if (!newName.trim() || !showAddForm) return
    const result = await addCategory({
      name: newName.trim(),
      icon: newIcon,
      type: showAddForm,
      is_necessary: showAddForm === 'expense' ? newIsNecessary : false,
      sort_order: 0
    })
    showCategoryMsg(result.message)
    if (result.success) {
      setNewName('')
      setNewIcon('📦')
      setNewIsNecessary(false)
      setShowAddForm(null)
    }
  }

  // 开始编辑
  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditIcon(cat.icon)
    setEditIsNecessary(cat.is_necessary)
  }

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null)
  }

  // 保存编辑
  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return
    const result = await updateCategory(id, {
      name: editName.trim(),
      icon: editIcon,
      is_necessary: editIsNecessary
    })
    showCategoryMsg(result.message)
    if (result.success) {
      setEditingId(null)
    }
  }

  // 删除分类
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return
    const result = await deleteCategory(id)
    showCategoryMsg(result.message)
  }

  // 取消添加
  const cancelAdd = () => {
    setShowAddForm(null)
    setNewName('')
    setNewIcon('📦')
    setNewIsNecessary(false)
  }

  // 渲染分类列表
  const renderCategoryGroup = (title: string, list: Category[], type: TransactionType) => (
    <div className="mb-5">
      <h4 className="text-sm font-medium text-text-secondary mb-3">{title}</h4>
      <div className="space-y-2">
        {list.map((cat) => (
          <div key={cat.id}>
            {editingId === cat.id ? (
              // ---- 编辑模式 ----
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-1 mr-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setEditIcon(icon)}
                      className={`w-7 h-7 text-base flex items-center justify-center rounded transition-colors ${
                        editIcon === icon ? 'bg-primary/15 ring-1 ring-primary' : 'hover:bg-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="分类名称"
                  autoFocus
                />
                {type === 'expense' && (
                  <label className="flex items-center gap-1 text-xs text-text-secondary whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={editIsNecessary}
                      onChange={(e) => setEditIsNecessary(e.target.checked)}
                      className="rounded"
                    />
                    必要
                  </label>
                )}
                <button onClick={() => handleUpdate(cat.id)} className="p-1.5 text-success hover:bg-green-50 rounded">
                  <Check size={16} />
                </button>
                <button onClick={cancelEdit} className="p-1.5 text-text-secondary hover:bg-gray-200 rounded">
                  <X size={16} />
                </button>
              </div>
            ) : (
              // ---- 显示模式 ----
              <div className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-sm text-text-primary">{cat.name}</span>
                  {cat.is_necessary && type === 'expense' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning font-medium">必要</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {cat.is_system ? (
                    <span className="text-text-secondary/50" title="系统预置分类，不可修改">
                      <Lock size={14} />
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/5 rounded transition-colors"
                        title="编辑分类"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/5 rounded transition-colors"
                        title="删除分类"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 添加新分类按钮 / 表单 */}
        {showAddForm === type ? (
          <div className="p-3 bg-gray-50 rounded-lg space-y-2.5">
            <div className="flex flex-wrap gap-1">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewIcon(icon)}
                  className={`w-7 h-7 text-base flex items-center justify-center rounded transition-colors ${
                    newIcon === icon ? 'bg-primary/15 ring-1 ring-primary' : 'hover:bg-gray-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="分类名称"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              {type === 'expense' && (
                <label className="flex items-center gap-1 text-xs text-text-secondary whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={newIsNecessary}
                    onChange={(e) => setNewIsNecessary(e.target.checked)}
                    className="rounded"
                  />
                  必要支出
                </label>
              )}
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="px-3 py-1.5 bg-primary text-white text-xs rounded-md hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                添加
              </button>
              <button onClick={cancelAdd} className="p-1.5 text-text-secondary hover:bg-gray-200 rounded">
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setShowAddForm(type)
              setNewName('')
              setNewIcon('📦')
              setNewIsNecessary(false)
              setEditingId(null)
            }}
            className="flex items-center gap-1.5 w-full p-2 text-xs text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors border border-dashed border-gray-200"
          >
            <Plus size={14} />
            添加自定义分类
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">分类管理</h2>

      <div className="bg-card rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-text-primary">所有分类</h3>
          {categoryMsg && (
            <span className={`text-xs ${categoryMsg.includes('成功') || categoryMsg.includes('已删除') ? 'text-success' : 'text-danger'}`}>
              {categoryMsg}
            </span>
          )}
        </div>
        <p className="text-xs text-text-secondary mb-4">
          系统预置分类 <Lock size={10} className="inline" /> 不可修改或删除。你可以添加、编辑和删除自己的自定义分类。
        </p>

        {renderCategoryGroup('支出 · 必要', necessaryExpense, 'expense')}
        {renderCategoryGroup('支出 · 非必要', unnecessaryExpense, 'expense')}
        {renderCategoryGroup('收入', incomeCategories, 'income')}
      </div>
    </div>
  )
}
