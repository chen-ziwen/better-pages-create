import { Link, useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>产品详情</h1>
      <p>这是产品详情页 (src/pages/products/[id].tsx)</p>
      <p>
        产品ID:
        <strong>{id}</strong>
      </p>

      <div>
        <h2>产品信息：</h2>
        <p>
          产品名称: 产品
          {id}
        </p>
        <p>
          价格: ¥
          {(Number.parseInt(id || '1') * 100).toFixed(2)}
        </p>
      </div>

      <nav>
        <Link to="/products">返回产品列表</Link>
        {' '}
        |
        <Link to="/">返回首页</Link>
      </nav>
    </div>
  )
}
