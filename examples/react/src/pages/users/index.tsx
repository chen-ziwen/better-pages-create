import { Link } from 'react-router-dom'

export default function UserList() {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  ]

  return (
    <div>
      <h1>用户管理</h1>
      <p>这是用户列表页 (src/pages/users/index.tsx)</p>

      <nav>
        <Link to="/users/create">创建新用户</Link>
      </nav>

      <h2>用户列表：</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
            {' '}
            (
            {user.email}
            )
            -
            <Link to={`/users/${user.id}/edit`}>编辑</Link>
            -
            {' '}
            <Link to={`/users/${user.id}/profile`}>资料</Link>
          </li>
        ))}
      </ul>

      <Link to="/">返回首页</Link>
    </div>
  )
}
