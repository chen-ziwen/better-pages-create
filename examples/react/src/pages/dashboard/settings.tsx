import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    language: 'zh-CN',
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>⚙️ 设置页面</h1>
      <p>在这里可以配置系统设置。</p>

      <div style={{ marginTop: '20px' }}>
        <h2>🎨 外观设置</h2>
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <strong>主题:</strong>
            <select
              value={settings.theme}
              onChange={e => handleSettingChange('theme', e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="auto">自动</option>
            </select>
          </label>

          <label style={{ display: 'block', marginBottom: '10px' }}>
            <strong>语言:</strong>
            <select
              value={settings.language}
              onChange={e => handleSettingChange('language', e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="zh-CN">中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
            </select>
          </label>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>🔔 通知设置</h2>
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={e => handleSettingChange('notifications', e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            <strong>启用通知</strong>
          </label>
        </div>
      </div>

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '5px',
      }}
      >
        <h3>📋 当前设置</h3>
        <pre style={{ fontSize: '12px', margin: '10px 0 0 0' }}>
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/dashboard" style={{ color: '#007acc', textDecoration: 'none', marginRight: '20px' }}>
          ← 返回仪表盘
        </Link>
        <Link to="/" style={{ color: '#007acc', textDecoration: 'none' }}>
          返回首页
        </Link>
      </div>
    </div>
  )
}
