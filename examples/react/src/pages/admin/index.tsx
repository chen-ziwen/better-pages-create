export default function AdminDashboard() {
  return (
    <div>
      <h1>管理后台仪表板</h1>
      <p>这是管理后台首页 (src/pages/admin/index.tsx)</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          <h3>用户统计</h3>
          <p>总用户数: 1,234</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
          <h3>订单统计</h3>
          <p>今日订单: 56</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
          <h3>收入统计</h3>
          <p>今日收入: ¥12,345</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
          <h3>系统状态</h3>
          <p>运行正常</p>
        </div>
      </div>
    </div>
  )
}
