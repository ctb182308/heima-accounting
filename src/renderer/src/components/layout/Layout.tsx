import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/stores/userStore'
import {
  Home,
  PlusCircle,
  List,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  User,
  Tag
} from 'lucide-react'

// 侧边栏菜单项
const menuItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/add', icon: PlusCircle, label: '记账' },
  { path: '/transactions', icon: List, label: '账单' },
  { path: '/statistics', icon: BarChart3, label: '统计' },
  { path: '/budget', icon: Wallet, label: '预算' },
  { path: '/categories', icon: Tag, label: '分类' },
  { path: '/settings', icon: Settings, label: '设置' }
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useUserStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <aside className="w-56 bg-card border-r border-border flex flex-col">
        {/* Logo 区域 */}
        <div className="h-14 flex items-center px-5 border-b border-border drag-region">
          <h1 className="text-lg font-semibold text-primary no-drag">记账App</h1>
        </div>

        {/* 用户信息 */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <span className="text-sm font-medium truncate">
              {currentUser?.nickname || currentUser?.username}
            </span>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 py-2 px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* 退出登录 */}
        <div className="p-2 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-gray-100 hover:text-danger transition-colors"
          >
            <LogOut size={18} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        {/* 顶部栏（用于窗口拖动） */}
        <div className="h-7 drag-region" />
        {/* 页面内容 */}
        <div className="px-8 pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
