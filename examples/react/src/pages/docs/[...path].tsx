import { Link, useParams } from 'react-router-dom'

export default function DocsPage() {
  const params = useParams<{ '*': string }>()
  const path = params['*'] || ''

  // 将路径分割成数组
  const pathSegments = path ? path.split('/') : []

  const docs: Record<string, { title: string, content: string }> = {
    'getting-started': {
      title: '快速开始',
      content: '这里是快速开始的文档内容...',
    },
    'api/users': {
      title: 'Users API',
      content: '用户相关的 API 文档...',
    },
    'api/products': {
      title: 'Products API',
      content: '产品相关的 API 文档...',
    },
    'guides/installation': {
      title: '安装指南',
      content: '详细的安装步骤...',
    },
    'guides/configuration': {
      title: '配置指南',
      content: '如何配置系统...',
    },
  }

  const docKey = pathSegments.join('/')
  const doc = docs[docKey]

  return (
    <div>
      <h1>文档页面</h1>
      <p>这是捕获所有路由的文档页 (src/pages/docs/[...path].tsx)</p>
      <p>
        当前路径:
        <strong>
          /
          {path || ''}
        </strong>
      </p>
      <p>
        路径段:
        {pathSegments.length > 0 ? pathSegments.join(' → ') : '无'}
      </p>

      {doc
        ? (
            <div>
              <h2>{doc.title}</h2>
              <p>{doc.content}</p>
            </div>
          )
        : (
            <div>
              <h2>文档未找到</h2>
              <p>
                路径 "/
                {path}
                " 对应的文档不存在
              </p>

              <h3>可用的文档：</h3>
              <ul>
                {Object.entries(docs).map(([key, doc]) => (
                  <li key={key}>
                    <Link to={`/docs/${key}`}>{doc.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

      <nav style={{ marginTop: '20px' }}>
        <Link to="/">返回首页</Link>
      </nav>
    </div>
  )
}
