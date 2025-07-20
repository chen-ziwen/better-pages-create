import { Link } from 'react-router-dom'

/**
 * 统计页面
 * 路由组示例：(dashboard)/stats.tsx → /stats
 * 路由组 (dashboard) 会被移除，实际路由为 /stats
 */
export default function StatsPage() {
  const stats = [
    { label: '总用户数', value: '12,345', change: '+12%', color: 'text-green-600' },
    { label: '活跃用户', value: '8,901', change: '+8%', color: 'text-green-600' },
    { label: '页面浏览量', value: '234,567', change: '+15%', color: 'text-green-600' },
    { label: '转化率', value: '3.2%', change: '-2%', color: 'text-red-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">数据统计</h1>
          <p className="mt-2 text-gray-600">
            路由组示例：
            <code className="bg-gray-100 px-1 rounded">(dashboard)/stats.tsx</code>
            {' '}
            →
            {' '}
            <code className="bg-blue-100 px-1 rounded">/stats</code>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            路由组
            {' '}
            <code>(dashboard)</code>
            {' '}
            被移除，但可以用于组织相关页面
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.label}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.color}`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              路由组功能说明
            </h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900">什么是路由组？</h4>
                <p>
                  路由组使用括号
                  <code className="bg-gray-100 px-1 rounded">(groupName)</code>
                  {' '}
                  包围，用于组织相关页面，但不会出现在最终的 URL 中。
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">使用场景：</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>组织相关功能页面（如认证相关页面）</li>
                  <li>共享布局或样式</li>
                  <li>逻辑分组，便于代码管理</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">示例：</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <code className="bg-gray-100 px-1 rounded">(auth)/login.tsx</code>
                    {' '}
                    →
                    {' '}
                    <code className="bg-blue-100 px-1 rounded">/login</code>
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded">(auth)/register.tsx</code>
                    {' '}
                    →
                    {' '}
                    <code className="bg-blue-100 px-1 rounded">/register</code>
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded">(dashboard)/stats.tsx</code>
                    {' '}
                    →
                    {' '}
                    <code className="bg-blue-100 px-1 rounded">/stats</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            查看仪表板
          </Link>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
