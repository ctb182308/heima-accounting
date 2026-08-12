import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useUserStore } from './stores/userStore'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AddTransaction from './pages/AddTransaction'
import TransactionList from './pages/TransactionList'
import Statistics from './pages/Statistics'
import Budget from './pages/Budget'
import Settings from './pages/Settings'
import Categories from './pages/Categories'

function App() {
  const { currentUser } = useUserStore()

  return (
    <Router>
      <Routes>
        {/* 未登录时的路由 */}
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />

        {/* 已登录后的路由 */}
        <Route path="/" element={currentUser ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Home />} />
          <Route path="add" element={<AddTransaction />} />
          <Route path="transactions" element={<TransactionList />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="budget" element={<Budget />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
