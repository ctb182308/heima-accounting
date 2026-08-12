import { useState } from 'react'
import { useUserStore } from '@/stores/userStore'

export default function Settings() {
  const { currentUser } = useUserStore()
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState('')

  const handleExportCSV = async () => {
    if (!currentUser) return
    setExporting(true)
    setMessage('')
    try {
      const now = new Date()
      const startDate = `${now.getFullYear()}-01-01`
      const endDate = now.toISOString().split('T')[0]
      const csv = await window.api.exportCSV(currentUser.id, startDate, endDate)
      // 触发下载
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `黑马记账_数据导出_${endDate}.csv`
      a.click()
      URL.revokeObjectURL(url)
      setMessage('导出成功！')
    } catch {
      setMessage('导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">设置</h2>

      {/* 用户信息 */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <h3 className="font-medium text-text-primary mb-4">用户信息</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">用户名</span>
            <span className="text-sm text-text-primary">{currentUser?.username}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">注册时间</span>
            <span className="text-sm text-text-primary">
              {currentUser?.created_at?.split(' ')[0] || '-'}
            </span>
          </div>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <h3 className="font-medium text-text-primary mb-4">数据管理</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-text-primary">导出数据</p>
              <p className="text-xs text-text-secondary mt-0.5">将所有账单导出为 CSV 文件</p>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {exporting ? '导出中...' : '导出'}
            </button>
          </div>
          {message && (
            <p className={`text-sm ${message.includes('成功') ? 'text-success' : 'text-danger'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* 关于 */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <h3 className="font-medium text-text-primary mb-4">关于</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">应用名称</span>
            <span className="text-sm text-text-primary">黑马记账</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">版本</span>
            <span className="text-sm text-text-primary">1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
