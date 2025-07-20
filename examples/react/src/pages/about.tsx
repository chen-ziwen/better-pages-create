import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
      <h1>关于</h1>
      <p>这是关于页面 (src/pages/about.tsx)</p>
      <Link to="/">返回首页</Link>
    </div>
  )
}
