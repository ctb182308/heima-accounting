import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUserStore } from '@/stores/userStore'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useUserStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('请输入用户名和密码')
      return
    }

    setLoading(true)
    try {
      const result = await login(username, password)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.message)
      }
    } catch {
      setError('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-text-primary">记账App</h1>
            <p className="text-text-secondary text-sm mt-2">登录您的账户</p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-danger/10 text-danger text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="请输入用户名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="请输入密码"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          {/* 注册链接 */}
          <p className="text-center text-sm text-text-secondary mt-6">
            还没有账户？{' '}
            <Link to="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
