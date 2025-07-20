import { Link, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <nav style={{
        width: '200px',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRight: '1px solid #ddd',
      }}
      >
        <h3>管理后台</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/admin">仪表板</Link></li>
          <li><Link to="/admin/settings">系统设置</Link></li>
          <li><Link to="/admin/logs">操作日志</Link></li>
          <li><Link to="/admin/reports">报表统计</Link></li>
        </ul>
        <hr />
        <Link to="/">返回前台</Link>
      </nav>

      {/* 主内容区 */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  )
}
