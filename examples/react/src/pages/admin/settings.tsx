export default function AdminSettings() {
  return (
    <div>
      <h1>系统设置</h1>
      <p>这是系统设置页 (src/pages/admin/settings.tsx)</p>

      <form>
        <div style={{ marginBottom: '15px' }}>
          <label>
            网站标题:
            <input type="text" defaultValue="我的网站" style={{ marginLeft: '10px', padding: '5px' }} />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            网站描述:
            <textarea defaultValue="这是一个很棒的网站" style={{ marginLeft: '10px', padding: '5px' }} />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input type="checkbox" defaultChecked />
            {' '}
            启用用户注册
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input type="checkbox" />
            {' '}
            启用邮件通知
          </label>
        </div>
        <button type="submit">保存设置</button>
      </form>
    </div>
  )
}
