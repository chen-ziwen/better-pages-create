import { Link } from 'react-router'

export default function LoginPage() {
  return (
    <div style={{ marginTop: '1rem' }}>
      <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>登录页面</h3>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="邮箱地址"
          style={{
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />
        <input
          type="password"
          placeholder="密码"
          style={{
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          登录
        </button>
      </form>

      <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        还没有账号？
        {' '}
        <Link to="/register" style={{ color: '#667eea' }}>立即注册</Link>
      </p>
    </div>
  )
}
