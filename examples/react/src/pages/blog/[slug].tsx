import { Link, useParams } from 'react-router-dom'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  const posts: Record<string, { title: string, content: string }> = {
    'hello-world': {
      title: 'Hello World',
      content: '这是第一篇博客文章的内容...',
    },
    'react-tips': {
      title: 'React 技巧',
      content: '这里分享一些实用的 React 开发技巧...',
    },
    'vite-guide': {
      title: 'Vite 指南',
      content: '学习如何使用 Vite 构建现代前端应用...',
    },
  }

  const post = posts[slug || '']

  if (!post) {
    return (
      <div>
        <h1>文章未找到</h1>
        <p>
          文章 "
          {slug}
          " 不存在
        </p>
        <Link to="/blog">返回博客列表</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>这是博客详情页 (src/pages/blog/[slug].tsx)</p>
      <p>
        当前文章:
        <strong>{slug}</strong>
      </p>

      <div>
        <h2>内容：</h2>
        <p>{post.content}</p>
      </div>

      <nav>
        <Link to="/blog">返回博客列表</Link>
        {' '}
        |
        <Link to="/">返回首页</Link>
      </nav>
    </div>
  )
}
