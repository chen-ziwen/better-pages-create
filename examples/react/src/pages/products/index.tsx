import { Link } from 'react-router-dom'

export default function ProductList() {
  const products = [
    { id: 1, name: '笔记本电脑' },
    { id: 2, name: '智能手机' },
    { id: 3, name: '平板电脑' },
    { id: 999, name: '特殊产品' },
  ]

  return (
    <div>
      <h1>产品列表</h1>
      <p>这是产品列表页 (src/pages/products/index.tsx)</p>

      <h2>产品列表：</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </li>
        ))}
      </ul>

      <Link to="/">返回首页</Link>
    </div>
  )
}
