export default function AdminLogs() {
  const logs = [
    { time: '2024-01-15 10:30:00', user: 'admin', action: '登录系统' },
    { time: '2024-01-15 10:25:00', user: 'alice', action: '创建新文章' },
    { time: '2024-01-15 10:20:00', user: 'bob', action: '修改个人资料' },
    { time: '2024-01-15 10:15:00', user: 'charlie', action: '删除评论' },
  ]

  return (
    <div>
      <h1>操作日志</h1>
      <p>这是操作日志页 (src/pages/admin/logs.tsx)</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>时间</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>用户</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.time}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.user}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
