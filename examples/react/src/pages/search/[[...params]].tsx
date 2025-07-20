import { Link, useParams, useSearchParams } from 'react-router-dom'

export default function SearchPage() {
  const urlParams = useParams<{ '*'?: string }>()
  const [searchParams] = useSearchParams()

  const params = urlParams['*'] || ''

  // 获取查询参数
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const page = searchParams.get('page') || '1'

  // 解析可选路径参数
  const pathSegments = params ? params.split('/') : []

  return (
    <div>
      <h1>搜索页面</h1>
      <p>这是可选参数路由的搜索页 (src/pages/search/[[...params]].tsx)</p>

      <div>
        <h2>路径信息：</h2>
        <p>
          完整路径:
          <strong>
            /search/
            {params || ''}
          </strong>
        </p>
        <p>
          路径段:
          {pathSegments.length > 0 ? pathSegments.join(' → ') : '无'}
        </p>
      </div>

      <div>
        <h2>查询参数：</h2>
        <p>
          搜索关键词:
          <strong>{query || '无'}</strong>
        </p>
        <p>
          分类:
          <strong>{category || '无'}</strong>
        </p>
        <p>
          页码:
          <strong>{page}</strong>
        </p>
      </div>

      <div>
        <h2>示例链接：</h2>
        <ul>
          <li><Link to="/search">基础搜索页</Link></li>
          <li><Link to="/search/advanced">高级搜索</Link></li>
          <li><Link to="/search/results/page/1">搜索结果第1页</Link></li>
          <li><Link to="/search?q=react&category=tutorial">搜索React教程</Link></li>
          <li><Link to="/search/filter/category/javascript?q=hooks">JavaScript Hooks搜索</Link></li>
        </ul>
      </div>

      {/* 模拟搜索结果 */}
      {query && (
        <div>
          <h2>搜索结果：</h2>
          <p>
            找到
            {Math.floor(Math.random() * 100)}
            {' '}
            个关于 "
            {query}
            " 的结果
          </p>
          <ul>
            <li>React Hooks 完全指南</li>
            <li>JavaScript 异步编程</li>
            <li>TypeScript 入门教程</li>
          </ul>
        </div>
      )}

      <nav style={{ marginTop: '20px' }}>
        <Link to="/">返回首页</Link>
      </nav>
    </div>
  )
}
