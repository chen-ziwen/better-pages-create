import { Link, useParams } from 'react-router'

export default function BlogPostPage() {
  const { slug } = useParams()

  const posts = {
    'hello-world': {
      title: '👋 Hello World - 我的第一篇博客',
      content: '欢迎来到我的博客！这是一个展示动态路由功能的示例页面。',
      date: '2024-01-15',
      tags: ['入门', '博客', '动态路由'],
    },
    'react-router': {
      title: '🚀 React Router 深度解析',
      content: 'React Router 是 React 应用中最重要的路由库之一，让我们深入了解它的工作原理。',
      date: '2024-01-20',
      tags: ['React', 'Router', '前端'],
    },
    'file-based-routing': {
      title: '📁 文件系统路由的优势',
      content: '基于文件系统的路由让项目结构更清晰，开发效率更高。',
      date: '2024-01-25',
      tags: ['路由', '文件系统', '开发效率'],
    },
  }

  const post = posts[slug as keyof typeof posts] || {
    title: '📄 文章未找到',
    content: `抱歉，没有找到 slug 为 "${slug}" 的文章。`,
    date: new Date().toISOString().split('T')[0],
    tags: ['404'],
  }

  return (
    <div className="page-container">
      <div className="page-card" style={{ maxWidth: '800px', textAlign: 'left' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/blog" style={{ color: '#667eea', textDecoration: 'none' }}>
            ← 返回博客列表
          </Link>
        </div>

        <div className="route-demo" style={{ marginBottom: '2rem' }}>
          <h4>🎯 动态路由演示</h4>
          <p>
            <strong>文件路径：</strong>
            {' '}
            <code>blog/[slug].tsx</code>
          </p>
          <p>
            <strong>当前参数：</strong>
            {' '}
            <code>
              slug = "
              {slug}
              "
            </code>
          </p>
          <p>
            <strong>URL 模式：</strong>
            {' '}
            <code>/blog/:slug</code>
          </p>
        </div>

        <article>
          <header style={{ marginBottom: '2rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem' }}>
            <h1 style={{ color: '#333', marginBottom: '1rem' }}>{post.title}</h1>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#666' }}>
              <span>
                📅
                {post.date}
              </span>
              <span>
                🏷️
                {post.tags.join(', ')}
              </span>
            </div>
          </header>

          <div style={{ lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '2rem' }}>
            <p>{post.content}</p>

            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '10px',
              marginTop: '2rem',
            }}
            >
              <h3>💡 动态路由的优势</h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li>URL 参数自动解析为组件 props</li>
                <li>
                  支持多个参数：
                  <code>[category]/[slug].tsx</code>
                </li>
                <li>类型安全的参数访问</li>
                <li>SEO 友好的 URL 结构</li>
              </ul>
            </div>
          </div>
        </article>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>🔗 尝试其他文章</h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {Object.keys(posts).filter(key => key !== slug).map(key => (
              <Link
                key={key}
                to={`/blog/${key}`}
                className="nav-link"
                style={{ fontSize: '0.9rem' }}
              >
                {posts[key as keyof typeof posts].title.split(' - ')[0]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
