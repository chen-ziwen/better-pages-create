import { Link } from 'react-router-dom'

export default function CreateUser() {
  return (
    <div>
      <h1>创建用户</h1>
      <p>这是创建用户页 (src/pages/users/create.tsx)</p>

      <form>
        <div>
          <label>
            用户名:
            <input type="text" placeholder="输入用户名" />
          </label>
        </div>
        <div>
          <label>
            邮箱:
            <input type="email" placeholder="输入邮箱" />
          </label>
        </div>
        <button type="submit">创建用户</button>
      </form>

      <nav>
        <Link to="/users">返回用户列表</Link>
        {' '}
        |
        <Link to="/">返回首页</Link>
      </nav>
    </div>
  )
}
