import { Link, useParams } from 'react-router-dom'

/**
 * 文章页面
 * 可选参数示例：posts/-[lang].tsx → /posts/:lang?
 * lang 参数是可选的，用于多语言支持
 */
export default function PostsPage() {
  const { lang } = useParams<{ lang?: string }>()

  const supportedLanguages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
  ]

  const currentLang = supportedLanguages.find(l => l.code === lang) || supportedLanguages[0]
  const isDefaultLang = !lang || lang === 'zh'

  // 模拟多语言文章数据
  const posts = {
    zh: [
      { id: 1, title: 'React 18 新特性详解', excerpt: '深入了解 React 18 带来的并发特性、自动批处理等新功能...', date: '2024-01-15', author: '张三' },
      { id: 2, title: 'TypeScript 5.0 发布', excerpt: 'TypeScript 5.0 正式发布，带来了装饰器、const 断言等新特性...', date: '2024-01-10', author: '李四' },
      { id: 3, title: 'Vite 4.0 性能优化指南', excerpt: '学习如何使用 Vite 4.0 的新特性来优化你的开发体验...', date: '2024-01-05', author: '王五' },
    ],
    en: [
      { id: 1, title: 'React 18 New Features Explained', excerpt: 'Deep dive into React 18\'s concurrent features, automatic batching, and more...', date: '2024-01-15', author: 'John Doe' },
      { id: 2, title: 'TypeScript 5.0 Released', excerpt: 'TypeScript 5.0 is officially released with decorators, const assertions, and more...', date: '2024-01-10', author: 'Jane Smith' },
      { id: 3, title: 'Vite 4.0 Performance Guide', excerpt: 'Learn how to leverage Vite 4.0\'s new features to optimize your development experience...', date: '2024-01-05', author: 'Bob Johnson' },
    ],
    ja: [
      { id: 1, title: 'React 18の新機能解説', excerpt: 'React 18の並行機能、自動バッチ処理などの新機能を詳しく解説...', date: '2024-01-15', author: '田中太郎' },
      { id: 2, title: 'TypeScript 5.0リリース', excerpt: 'TypeScript 5.0が正式リリース、デコレータやconst アサーションなどの新機能...', date: '2024-01-10', author: '佐藤花子' },
      { id: 3, title: 'Vite 4.0パフォーマンスガイド', excerpt: 'Vite 4.0の新機能を使って開発体験を最適化する方法を学ぶ...', date: '2024-01-05', author: '鈴木一郎' },
    ],
    ko: [
      { id: 1, title: 'React 18 새로운 기능 설명', excerpt: 'React 18의 동시성 기능, 자동 배칭 등 새로운 기능에 대해 자세히 알아보기...', date: '2024-01-15', author: '김철수' },
      { id: 2, title: 'TypeScript 5.0 출시', excerpt: 'TypeScript 5.0이 정식 출시되어 데코레이터, const 어설션 등 새로운 기능 제공...', date: '2024-01-10', author: '이영희' },
      { id: 3, title: 'Vite 4.0 성능 최적화 가이드', excerpt: 'Vite 4.0의 새로운 기능을 활용하여 개발 경험을 최적화하는 방법 학습...', date: '2024-01-05', author: '박민수' },
    ],
  }

  const currentPosts = posts[lang as keyof typeof posts] || posts.zh

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentLang.flag}
            {' '}
            {currentLang.name === '中文'
              ? '技术博客'
              : currentLang.name === 'English'
                ? 'Tech Blog'
                : currentLang.name === '日本語' ? 'テックブログ' : '기술 블로그'}
          </h1>
          <p className="mt-2 text-gray-600">
            可选参数示例：
            <code className="bg-gray-100 px-1 rounded">posts/-[lang].tsx</code>
            {' '}
            →
            {' '}
            <code className="bg-blue-100 px-1 rounded">/posts/:lang?</code>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            当前路径：
            <code className="bg-yellow-100 px-1 rounded">
              /posts
              {lang ? `/${lang}` : ''}
            </code>
          </p>
        </div>

        {/* 语言切换 */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">语言选择</h3>
          <div className="flex flex-wrap gap-2">
            {supportedLanguages.map(language => (
              <Link
                key={language.code}
                to={language.code === 'zh' ? '/posts' : `/posts/${language.code}`}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  (isDefaultLang && language.code === 'zh') || lang === language.code
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </Link>
            ))}
          </div>
        </div>

        {/* 路径信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">路径参数信息</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-blue-800">lang 参数：</span>
              <code className="ml-2 bg-blue-100 px-2 py-1 rounded">
                {lang ? `"${lang}"` : 'undefined (使用默认语言)'}
              </code>
            </div>
            <div>
              <span className="font-medium text-blue-800">当前语言：</span>
              <code className="ml-2 bg-blue-100 px-2 py-1 rounded">
                {currentLang.flag}
                {' '}
                {currentLang.name}
              </code>
            </div>
            <div>
              <span className="font-medium text-blue-800">匹配的路径：</span>
              <code className="ml-2 bg-blue-100 px-2 py-1 rounded">
                {lang ? `/posts/${lang}` : '/posts (默认)'}
              </code>
            </div>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="space-y-6">
          {currentPosts.map(post => (
            <article key={post.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {currentLang.flag}
                    {' '}
                    {currentLang.name}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                    {currentLang.name === '中文'
                      ? '阅读更多'
                      : currentLang.name === 'English'
                        ? 'Read More'
                        : currentLang.name === '日本語' ? '続きを読む' : '더 읽기'}
                    {' '}
                    →
                  </button>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      👍
                      {' '}
                      {Math.floor(Math.random() * 50) + 10}
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      💬
                      {' '}
                      {Math.floor(Math.random() * 20) + 5}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 功能说明 */}
        <div className="mt-12 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              可选参数多语言支持说明
            </h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900">实现原理：</h4>
                <p>
                  使用
                  <code className="bg-gray-100 px-1 rounded">-[lang]</code>
                  {' '}
                  创建可选语言参数，支持多语言路径。
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">路径映射：</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <code className="bg-gray-100 px-1 rounded">/posts</code>
                    {' '}
                    → 默认语言（中文）
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded">/posts/en</code>
                    {' '}
                    → 英文版本
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded">/posts/ja</code>
                    {' '}
                    → 日文版本
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded">/posts/ko</code>
                    {' '}
                    → 韩文版本
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">优势：</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>SEO 友好的多语言 URL</li>
                  <li>支持默认语言（无需参数）</li>
                  <li>易于扩展新语言</li>
                  <li>保持 URL 结构简洁</li>
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
