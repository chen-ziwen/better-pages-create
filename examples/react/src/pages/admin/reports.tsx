export default function AdminReports() {
  return (
    <div>
      <h1>报表统计</h1>
      <p>这是报表统计页 (src/pages/admin/reports.tsx)</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div>
          <h3>用户增长趋势</h3>
          <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            📈 用户增长图表
          </div>
        </div>

        <div>
          <h3>收入统计</h3>
          <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            💰 收入统计图表
          </div>
        </div>

        <div>
          <h3>热门内容</h3>
          <ul>
            <li>React 入门教程 (1,234 次浏览)</li>
            <li>JavaScript 高级技巧 (987 次浏览)</li>
            <li>CSS 布局指南 (765 次浏览)</li>
          </ul>
        </div>

        <div>
          <h3>系统性能</h3>
          <ul>
            <li>CPU 使用率: 45%</li>
            <li>内存使用率: 62%</li>
            <li>磁盘使用率: 78%</li>
            <li>网络延迟: 12ms</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
