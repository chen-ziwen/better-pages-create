import { Link } from 'react-router'

export default function HomePage() {
  const routeExamples = [
    {
      title: '🔐 路由组 (Route Groups)',
      description: '使用括号组织相关页面，不影响 URL 结构',
      examples: [
        { file: '(auth)/login.tsx', url: '/login', desc: '认证相关页面' },
        { file: '(dashboard)/stats.tsx', url: '/stats', desc: '仪表板页面' },
      ],
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    },
    {
      title: '🎯 动态路由 (Dynamic Routes)',
      description: '使用方括号创建参数化路由',
      examples: [
        { file: 'blog/[slug].tsx', url: '/blog/hello-world', desc: '博客文章页面' },
      ],
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
  ]

  return (
    <div className="page-container">
      <div className="page-card" style={{ maxWidth: '1200px' }}>
        <h1 className="page-title">🚀 Better Pages Create</h1>
        <p className="page-subtitle">基于文件系统的自动路由生成 - 让路由管理变得简单而强大</p>

        {/* 核心特性 */}
        <div className="feature-grid" style={{ marginBottom: '3rem' }}>
          <div className="feature-card">
            <h3>📁 零配置路由</h3>
            <p>基于文件系统自动生成路由，告别繁琐的路由配置</p>
          </div>
          <div className="feature-card">
            <h3>🎯 智能布局</h3>
            <p>支持嵌套布局和路由组，代码组织更清晰</p>
          </div>
          <div className="feature-card">
            <h3>⚡ 按需加载</h3>
            <p>自动代码分割，提升应用加载性能</p>
          </div>
          <div className="feature-card">
            <h3>🔧 TypeScript</h3>
            <p>完整的类型支持，开发体验更佳</p>
          </div>
        </div>

        {/* 路由类型展示 */}
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#667eea' }}>
          🎨 路由类型演示
        </h2>

        <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem' }}>
          {routeExamples.map((example, index) => (
            <div
              key={index}
              style={{
                background: example.color,
                borderRadius: '15px',
                padding: '2rem',
                color: 'white',
              }}
            >
              <h3 style={{ marginBottom: '1rem' }}>{example.title}</h3>
              <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>{example.description}</p>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {example.examples.map((ex, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      padding: '1rem',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <code style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.25rem 0.5rem', borderRadius: '5px' }}>
                          {ex.file}
                        </code>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>{ex.desc}</p>
                      </div>
                      <Link
                        to={ex.url.split(' ')[0]}
                        style={{
                          background: 'rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        访问 →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 快速导航 */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#667eea' }}>🎯 快速体验</h3>
          <div className="nav-links" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="nav-link">🔐 认证布局</Link>
            <Link to="/stats" className="nav-link">📊 仪表板</Link>
            <Link to="/blog/hello-world" className="nav-link">📝 动态路由</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
