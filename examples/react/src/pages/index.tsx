import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div>
      <h1>🚀 Better Pages Create - 复杂路由示例</h1>
      <p>文件路由测试 - 这是首页 (src/pages/index.tsx)</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>

        {/* 基础路由 */}
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>📄 基础路由</h3>
          <ul>
            <li><Link to="/about">关于页面</Link></li>
            <li><Link to="/dashboard">仪表板</Link></li>
            <li><Link to="/debug">路由生成结构</Link></li>
          </ul>
        </div>

        {/* 嵌套路由 */}
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>📁 嵌套路由</h3>
          <ul>
            <li><Link to="/blog">博客列表</Link></li>
            <li><Link to="/blog/hello-world">博客详情</Link></li>
            <li><Link to="/blog/react-tips">React技巧</Link></li>
          </ul>
        </div>

        {/* 动态路由 */}
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>🔗 动态路由</h3>
          <ul>
            <li><Link to="/products">产品列表</Link></li>
            <li><Link to="/products/1">产品详情 #1</Link></li>
            <li><Link to="/products/999">产品详情 #999</Link></li>
          </ul>
        </div>

        {/* 多层嵌套路由 */}
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>🏗️ 多层嵌套路由</h3>
          <ul>
            <li><Link to="/users">用户管理</Link></li>
            <li><Link to="/users/create">创建用户</Link></li>
            <li><Link to="/users/1">用户详情</Link></li>
            <li><Link to="/users/1/edit">编辑用户</Link></li>
            <li><Link to="/users/1/profile">用户资料</Link></li>
          </ul>
        </div>

        {/* 布局路由 */}
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>🎨 布局路由</h3>
          <ul>
            <li><Link to="/admin">管理后台</Link></li>
            <li><Link to="/admin/settings">系统设置</Link></li>
            <li><Link to="/admin/logs">操作日志</Link></li>
            <li><Link to="/admin/reports">报表统计</Link></li>
          </ul>
        </div>

        {/* 捕获所有路由 */}
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>🌐 捕获所有路由</h3>
          <ul>
            <li><Link to="/docs/getting-started">快速开始</Link></li>
            <li><Link to="/docs/api/users">Users API</Link></li>
            <li><Link to="/docs/guides/installation">安装指南</Link></li>
            <li><Link to="/docs/not/found/path">不存在的文档</Link></li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>📊 路由统计</h3>
        <p>当前示例包含了以下路由类型：</p>
        <ul>
          <li>✅ 静态路由 (如 /about, /dashboard)</li>
          <li>✅ 嵌套路由 (如 /blog/index, /blog/[slug])</li>
          <li>✅ 动态路由 (如 /products/[id])</li>
          <li>✅ 多层嵌套 (如 /users/[id]/edit)</li>
          <li>✅ 布局路由 (如 /admin/layout + 子路由)</li>
          <li>✅ 捕获所有 (如 /docs/[...path])</li>
        </ul>
      </div>
    </div>
  )
}
