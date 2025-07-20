import { Link, useParams } from 'react-router-dom'

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()

  const users: Record<string, { name: string, email: string, role: string }> = {
    1: { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    2: { name: 'Bob', email: 'bob@example.com', role: 'User' },
    3: { name: 'Charlie', email: 'charlie@example.com', role: 'Editor' },
  }

  const user = users[id || '']

  if (!user) {
    return (
      <div>
        <h1>用户未找到</h1>
        <p>
          用户 ID "
          {id}
          " 不存在
        </p>
        <Link to="/users">返回用户列表</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>用户详情</h1>
      <p>这是用户详情页 (src/pages/users/[id].tsx)</p>
      <p>
        用户ID:
        <strong>{id}</strong>
      </p>

      <div>
        <h2>用户信息：</h2>
        <p>
          姓名:
          {user.name}
        </p>
        <p>
          邮箱:
          {user.email}
        </p>
        <p>
          角色:
          {user.role}
        </p>
      </div>

      <nav>
        <Link to={`/users/${id}/edit`}>编辑用户</Link>
        {' '}
        |
        <Link to={`/users/${id}/profile`}>查看资料</Link>
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
