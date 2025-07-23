export default function StatsPage() {
  return (
    <div>
      <h1 style={{ color: '#667eea', marginBottom: '2rem' }}>📈 统计数据</h1>

      <div className="feature-grid">
        <div className="feature-card">
          <h3>👥 用户数量</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>1,234</p>
        </div>
        <div className="feature-card">
          <h3>📄 页面访问</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>5,678</p>
        </div>
        <div className="feature-card">
          <h3>🚀 转化率</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>12.3%</p>
        </div>
        <div className="feature-card">
          <h3>💰 收入</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>¥9,999</p>
        </div>
      </div>

      <div className="route-demo" style={{ marginTop: '2rem' }}>
        <h4>🎯 路由组优势展示</h4>
        <p>这个页面展示了路由组的强大功能：</p>
        <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
          <li>
            <strong>URL 简洁：</strong>
            <code>/stats</code>
            而不是
            <code>/dashboard/stats</code>
          </li>
          <li>
            <strong>布局共享：</strong>
            自动继承仪表板布局
          </li>
          <li>
            <strong>组织清晰：</strong>
            文件结构体现功能分组
          </li>
          <li>
            <strong>维护方便：</strong>
            相关页面集中管理
          </li>
        </ul>
      </div>
    </div>
  )
}
