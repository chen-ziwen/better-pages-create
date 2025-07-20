import { Link } from 'react-router-dom'

export default function BlogIndex() {
  const posts = [
    { id: 1, slug: 'hello-world', title: 'Hello World' },
    { id: 2, slug: 'react-tips', title: 'React 技巧' },
    { id: 3, slug: 'vite-guide', title: 'Vite 指南' },
  ]

  return (
    <div>
      <h1>博客列表</h1>
      <p>这是博客列表页 (src/pages/blog/index.tsx)</p>

      <h2>文章列表：</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>

      <Link to="/">返回首页</Link>
    </div>
  )
}
