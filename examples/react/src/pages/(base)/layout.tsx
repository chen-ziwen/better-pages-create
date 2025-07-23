import { Link, Outlet, useLocation } from 'react-router'

export default function RootLayout() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '🏠 首页' },
    { path: '/blog', label: '📝 博客' },
    { path: '/login', label: '🔐 登录（登录布局）' },
    { path: '/stats', label: '📊 统计（统计布局）' },
  ]

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ path: '/', label: '首页' }]

    let currentPath = ''
    paths.forEach((segment) => {
      currentPath += `/${segment}`
      const navItem = navItems.find(item => item.path === currentPath)
      if (navItem) {
        breadcrumbs.push({ path: currentPath, label: navItem.label })
      }
      else {
        breadcrumbs.push({ path: currentPath, label: segment })
      }
    })

    return breadcrumbs
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="nav-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
            🚀 Better Pages
          </Link>

          <nav className="nav-links">
            {navItems.slice(0, 6).map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 面包屑导航 */}
        {location.pathname !== '/' && (
          <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            {getBreadcrumbs().map((crumb, index) => (
              <span key={crumb.path} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {index > 0 && ' / '}
                {index === getBreadcrumbs().length - 1
                  ? (
                      <span style={{ color: 'white', fontWeight: '500' }}>{crumb.label}</span>
                    )
                  : (
                      <Link to={crumb.path} style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                        {crumb.label}
                      </Link>
                    )}
              </span>
            ))}
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{
        background: 'rgba(0, 0, 0, 0.1)',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
      }}
      >
        <p>🎉 Better Pages Create - 让路由管理变得简单</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
          当前路径:
          {' '}
          <code>{location.pathname}</code>
        </p>
      </footer>
    </div>
  )
}
