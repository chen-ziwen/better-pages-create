import { Link, Outlet } from 'react-router'

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <header style={{
        background: 'rgba(255, 255, 255, 0.2)',
        padding: '1rem 2rem',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      }}
      >
        <h2 style={{ color: 'white' }}>📊 仪表板布局</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
          来自
          <code>(dashboard)/layout.tsx</code>
        </p>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <aside className="sidebar">
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>导航菜单</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/stats" className="nav-link">📈 统计数据</Link>
          </nav>

          <div className="route-demo" style={{ marginTop: '2rem' }}>
            <strong>布局特点：</strong>
            <ul style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              <li>共享头部和侧边栏</li>
              <li>子页面在主区域渲染</li>
              <li>保持导航状态</li>
            </ul>
          </div>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
