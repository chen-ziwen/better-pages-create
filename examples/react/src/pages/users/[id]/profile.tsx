import { Link, useParams } from 'react-router-dom'

export default function UserProfile() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>用户资料</h1>
      <p>这是用户资料页 (src/pages/users/[id]/profile.tsx)</p>
      <p>
        用户ID:
        <strong>{id}</strong>
      </p>

      <div>
        <h2>详细资料：</h2>
        <p>注册时间: 2024-01-01</p>
        <p>最后登录: 2024-01-15</p>
        <p>
          登录次数:
          {Number.parseInt(id || '1') * 10}
        </p>
        <p>状态: 活跃</p>
      </div>

      <nav>
        <Link to={`/users/${id}`}>返回用户详情</Link>
        {' '}
        |
        <Link to={`/users/${id}/edit`}>编辑用户</Link>
        {' '}
        |
        <Link to="/users">返回用户列表</Link>
        {' '}
        |
        <Link to="/">返回首页</Link>
      </nav>
    </div>
  )
}
