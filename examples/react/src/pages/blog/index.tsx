import { Link } from 'react-router'

export default function BlogIndexPage() {
  const posts = [
    {
      slug: 'hello-world',
      title: '👋 Hello World - 我的第一篇博客',
      excerpt: '欢迎来到我的博客！这是一个展示动态路由功能的示例页面。',
      date: '2024-01-15',
      tags: ['入门', '博客', '动态路由'],
    },
    {
      slug: 'react-router',
      title: '🚀 React Router 深度解析',
      excerpt: 'React Router 是 React 应用中最重要的路由库之一，让我们深入了解它的工作原理。',
      date: '2024-01-20',
      tags: ['React', 'Router', '前端'],
    },
    {
      slug: 'file-based-routing',
      title: '📁 文件系统路由的优势',
      excerpt: '基于文件系统的路由让项目结构更清晰，开发效率更高。',
      date: '2024-01-25',
      tags: ['路由', '文件系统', '开发效率'],
    },
  ]

  return (
    <div className="page-container">
      <div className="page-card" style={{ maxWidth: '900px' }}>
        <h1 className="page-title">📝 博客文章</h1>
        <p className="page-subtitle">探索动态路由的强大功能</p>

        <div className="route-demo" style={{ marginBottom: '2rem' }}>
          <h4>🎯 动态路由说明</h4>
          <p><strong>文件结构：</strong></p>
          <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
            <li>
              <code>blog/index.tsx</code>
              {' '}
              →
              {' '}
              <code>/blog</code>
              {' '}
              (博客列表)
            </li>
            <li>
              <code>blog/[slug].tsx</code>
              {' '}
              →
              {' '}
              <code>/blog/:slug</code>
              {' '}
              (文章详情)
            </li>
          </ul>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {posts.map(post => (
            <article
              key={post.slug}
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'left',
              }}
            >
              <header style={{ marginBottom: '1rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>
                  <Link
                    to={`/blog/${post.slug}`}
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    {post.title}
                  </Link>
                </h2>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  📅
                  {' '}
                  {post.date}
                  {' '}
                  • 🏷️
                  {' '}
                  {post.tags.join(', ')}
                </div>
              </header>

              <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>{post.excerpt}</p>

              <Link
                to={`/blog/${post.slug}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontWeight: '500',
                }}
              >
                阅读全文 →
              </Link>
            </article>
          ))}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            💡 点击任意文章标题或"阅读全文"按钮体验动态路由功能
          </p>
        </div>
      </div>
    </div>
  )
}
