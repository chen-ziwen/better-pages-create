import { Link, useParams } from 'react-router-dom'

export default function EditUser() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>编辑用户</h1>
      <p>这是编辑用户页 (src/pages/users/[id]/edit.tsx)</p>
      <p>
        编辑用户ID:
        <strong>{id}</strong>
      </p>

      <form>
        <div>
          <label>
            用户名:
            <input type="text" defaultValue={`用户${id}`} />
          </label>
        </div>
        <div>
          <label>
            邮箱:
            <input type="email" defaultValue={`user${id}@example.com`} />
          </label>
        </div>
        <div>
          <label>
            角色:
            <select defaultValue="user">
              <option value="admin">管理员</option>
              <option value="user">普通用户</option>
              <option value="editor">编辑者</option>
            </select>
          </label>
        </div>
        <button type="submit">保存修改</button>
      </form>

      <nav>
        <Link to={`/users/${id}`}>返回用户详情</Link>
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
