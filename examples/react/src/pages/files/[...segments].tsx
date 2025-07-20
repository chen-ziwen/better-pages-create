import { Link, useParams } from 'react-router-dom'

/**
 * 文件浏览器页面
 * Splat 路由示例：files/[...segments].tsx → /files/*
 * 捕获 /files/ 后的所有路径段
 */
export default function FileBrowserPage() {
  const params = useParams()
  const segments = params['*']?.split('/').filter(Boolean) || []

  // 模拟文件系统数据
  const mockFiles = [
    { name: 'documents', type: 'folder', size: '-' },
    { name: 'images', type: 'folder', size: '-' },
    { name: 'videos', type: 'folder', size: '-' },
    { name: 'readme.txt', type: 'file', size: '1.2 KB' },
    { name: 'config.json', type: 'file', size: '856 B' },
  ]

  const currentPath = segments.join('/')
  const breadcrumbs = ['files', ...segments]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">文件浏览器</h1>
          <p className="mt-2 text-gray-600">
            Splat 路由示例：
            <code className="bg-gray-100 px-1 rounded">files/[...segments].tsx</code>
            {' '}
            →
            {' '}
            <code className="bg-blue-100 px-1 rounded">/files/*</code>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            捕获
            {' '}
            <code>/files/</code>
            {' '}
            后的所有路径段
          </p>
        </div>

        {/* 面包屑导航 */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <Link
                  to={`/${breadcrumbs.slice(0, index + 1).join('/')}`}
                  className={`ml-1 text-sm font-medium ${
                    index === breadcrumbs.length - 1
                      ? 'text-gray-500 cursor-default'
                      : 'text-gray-700 hover:text-gray-900'
                  } md:ml-2`}
                >
                  {crumb}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        {/* 当前路径信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">路径信息</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-blue-800">完整路径：</span>
              <code className="ml-2 bg-blue-100 px-2 py-1 rounded">
                /files/
                {currentPath}
              </code>
            </div>
            <div>
              <span className="font-medium text-blue-800">捕获的段：</span>
              <code className="ml-2 bg-blue-100 px-2 py-1 rounded">
                {segments.length > 0 ? `[${segments.map(s => `"${s}"`).join(', ')}]` : '[]'}
              </code>
            </div>
            <div>
              <span className="font-medium text-blue-800">原始参数：</span>
              <code className="ml-2 bg-blue-100 px-2 py-1 rounded">
                params['*'] = "
                {params['*'] || ''}
                "
              </code>
            </div>
          </div>
        </div>

        {/* 文件列表 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              当前目录内容
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      大小
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockFiles.map((file, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-5 w-5">
                            {file.type === 'folder'
                              ? (
                                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                  </svg>
                                )
                              : (
                                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {file.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {file.type === 'folder' ? '文件夹' : '文件'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {file.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {file.type === 'folder'
                          ? (
                              <Link
                                to={`/files/${currentPath}${currentPath ? '/' : ''}${file.name}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                打开
                              </Link>
                            )
                          : (
                              <button className="text-indigo-600 hover:text-indigo-900">
                                下载
                              </button>
                            )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Splat 路由功能说明
            </h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900">什么是 Splat 路由？</h4>
                <p>
                  使用
                  <code className="bg-gray-100 px-1 rounded">[...param]</code>
                  {' '}
                  语法可以捕获路径中的所有剩余段。
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">使用场景：</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>文件浏览器（如本页面）</li>
                  <li>文档系统的嵌套页面</li>
                  <li>多级分类页面</li>
                  <li>404 页面（捕获所有未匹配路径）</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">路径示例：</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <code className="bg-gray-100 px-1 rounded">/files/documents</code>
                    {' '}
                    → segments = ["documents"]
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded">/files/images/2023/vacation</code>
                    {' '}
                    → segments = ["images", "2023", "vacation"]
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded">/files/</code>
                    {' '}
                    → segments = []
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
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
