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

        {/* 路由组 */}
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>📂 路由组 (Route Groups)</h3>
          <ul>
            <li>
              <Link to="/login">登录页面</Link>
              {' '}
              <small>(auth)/login.tsx</small>
            </li>
            <li>
              <Link to="/register">注册页面</Link>
              {' '}
              <small>(auth)/register.tsx</small>
            </li>
            <li>
              <Link to="/stats">数据统计</Link>
              {' '}
              <small>(dashboard)/stats.tsx</small>
            </li>
          </ul>
        </div>

        {/* Splat 路由 */}
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>🌐 Splat 路由 (Catch-all)</h3>
          <ul>
            <li><Link to="/docs/getting-started">快速开始</Link></li>
            <li><Link to="/docs/api/users">Users API</Link></li>
            <li><Link to="/docs/guides/installation">安装指南</Link></li>
            <li>
              <Link to="/files">文件浏览器</Link>
              {' '}
              <small>[...segments].tsx</small>
            </li>
            <li><Link to="/files/documents/2023">文件子目录</Link></li>
          </ul>
        </div>

        {/* 可选参数 */}
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>❓ 可选参数 (Optional Params)</h3>
          <ul>
            <li>
              <Link to="/shop">商店首页</Link>
              {' '}
              <small>-[category].tsx</small>
            </li>
            <li><Link to="/shop/electronics">电子产品</Link></li>
            <li><Link to="/shop/clothing">服装分类</Link></li>
            <li>
              <Link to="/posts">技术博客</Link>
              {' '}
              <small>-[lang].tsx</small>
            </li>
            <li><Link to="/posts/en">English Posts</Link></li>
            <li><Link to="/posts/ja">日本語記事</Link></li>
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
          <li>✅ Splat 路由 (如 /docs/[...path], /files/[...segments])</li>
          <li>✅ 路由组 (如 (auth)/login.tsx → /login)</li>
          <li>✅ 可选参数 (如 -[category].tsx → /:category?)</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h3>🔧 buildReactRoutePath 功能展示</h3>
        <p>
          本示例展示了
          <code>buildReactRoutePath</code>
          {' '}
          函数支持的所有路由解析功能：
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div>
            <h4>🗂️ 路由组</h4>
            <ul style={{ fontSize: '14px' }}>
              <li>
                <code>(auth)/login.tsx</code>
                {' '}
                →
                {' '}
                <code>/login</code>
              </li>
              <li>
                <code>(dashboard)/stats.tsx</code>
                {' '}
                →
                {' '}
                <code>/stats</code>
              </li>
            </ul>
          </div>
          <div>
            <h4>🌟 Splat 路由</h4>
            <ul style={{ fontSize: '14px' }}>
              <li>
                <code>[...segments].tsx</code>
                {' '}
                →
                {' '}
                <code>/*</code>
              </li>
              <li>
                <code>[...path].tsx</code>
                {' '}
                →
                {' '}
                <code>/*</code>
              </li>
            </ul>
          </div>
          <div>
            <h4>🔗 动态参数</h4>
            <ul style={{ fontSize: '14px' }}>
              <li>
                <code>[id].tsx</code>
                {' '}
                →
                {' '}
                <code>/:id</code>
              </li>
              <li>
                <code>[slug].tsx</code>
                {' '}
                →
                {' '}
                <code>/:slug</code>
              </li>
            </ul>
          </div>
          <div>
            <h4>❓ 可选参数</h4>
            <ul style={{ fontSize: '14px' }}>
              <li>
                <code>-[category].tsx</code>
                {' '}
                →
                {' '}
                <code>/:category?</code>
              </li>
              <li>
                <code>-[lang].tsx</code>
                {' '}
                →
                {' '}
                <code>/:lang?</code>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
