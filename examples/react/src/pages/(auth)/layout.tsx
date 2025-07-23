import { Link, Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="page-card" style={{ maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '0.5rem' }}>🔐 认证布局</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            来自
            <code>(auth)/layout.tsx</code>
            - 路由组布局
          </p>
        </div>

        <div className="route-demo">
          <strong>路由组特点：</strong>
          <ul style={{ textAlign: 'left', marginTop: '0.5rem', paddingLeft: '1rem' }}>
            <li>文件夹名用括号包围</li>
            <li>不会出现在 URL 中</li>
            <li>用于组织相关页面</li>
            <li>共享布局和样式</li>
          </ul>
        </div>

        <Outlet />

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
