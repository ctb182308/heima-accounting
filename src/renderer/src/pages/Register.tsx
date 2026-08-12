import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUserStore } from '@/stores/userStore'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useUserStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('请输入用户名和密码')
      return
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    if (password.length < 6) {
      setError('密码至少6位')
      return
    }

    setLoading(true)
    try {
      const result = await register(username, password)
      if (result.success) {
        navigate('/login')
      } else {
        setError(result.message)
      }
    } catch {
      setError('注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-text-primary">黑马记账</h1>
            <p className="text-text-secondary text-sm mt-2">创建新账户</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-danger/10 text-danger text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="至少6位密码"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="请再次输入密码"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            已有账户？{' '}
            <Link to="/login" className="text-primary hover:underline">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
