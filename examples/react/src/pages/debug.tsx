import { Link } from 'react-router-dom'
import routes from '~react-pages'

export default function DebugPage() {
  return (
    <div>
      <h1>调试页面</h1>
      <p>这是调试页面，用于查看生成的路由结构</p>

      <h2>生成的路由对象：</h2>
      <pre style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        overflow: 'auto',
        fontSize: '12px',
      }}
      >
        {JSON.stringify(routes, null, 2)}
      </pre>

      <h2>路由类型：</h2>
      <p>
        routes 的类型:
        {typeof routes}
      </p>
      <p>
        routes 是数组:
        {Array.isArray(routes) ? '是' : '否'}
      </p>
      <p>
        routes 长度:
        {Array.isArray(routes) ? routes.length : 'N/A'}
      </p>

      <nav style={{ marginTop: '20px' }}>
        <Link to="/">返回首页</Link>
      </nav>
    </div>
  )
}
