import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
      <h1>仪表板</h1>
      <p>这是仪表板页面 (src/pages/dashboard.tsx)</p>
      <Link to="/">返回首页</Link>
    </div>
  )
}
