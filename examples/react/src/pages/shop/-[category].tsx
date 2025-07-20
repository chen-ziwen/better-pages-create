// import { Link, useParams } from 'react-router-dom'

// /**
//  * 商店页面
//  * 可选参数示例：shop/-[category].tsx → /shop/:category?
//  * category 参数是可选的，可以匹配 /shop 和 /shop/electronics 等
//  */
// export default function ShopPage() {
//   const { category } = useParams<{ category?: string }>()

//   // 模拟商品数据
//   const categories = [
//     { id: 'electronics', name: '电子产品', count: 156 },
//     { id: 'clothing', name: '服装', count: 234 },
//     { id: 'books', name: '图书', count: 89 },
//     { id: 'home', name: '家居用品', count: 167 },
//     { id: 'sports', name: '运动用品', count: 78 },
//   ]

//   const products = {
//     electronics: [
//       { id: 1, name: 'iPhone 15', price: 5999, image: '📱' },
//       { id: 2, name: 'MacBook Pro', price: 12999, image: '💻' },
//       { id: 3, name: 'AirPods Pro', price: 1899, image: '🎧' },
//     ],
//     clothing: [
//       { id: 4, name: 'T恤', price: 99, image: '👕' },
//       { id: 5, name: '牛仔裤', price: 299, image: '👖' },
//       { id: 6, name: '运动鞋', price: 599, image: '👟' },
//     ],
//     books: [
//       { id: 7, name: 'JavaScript 高级程序设计', price: 89, image: '📚' },
//       { id: 8, name: 'React 实战', price: 79, image: '📖' },
//       { id: 9, name: 'TypeScript 入门', price: 69, image: '📘' },
//     ],
//     home: [
//       { id: 10, name: '咖啡机', price: 1299, image: '☕' },
//       { id: 11, name: '台灯', price: 199, image: '💡' },
//       { id: 12, name: '花瓶', price: 89, image: '🏺' },
//     ],
//     sports: [
//       { id: 13, name: '篮球', price: 199, image: '🏀' },
//       { id: 14, name: '跑步机', price: 2999, image: '🏃' },
//       { id: 15, name: '瑜伽垫', price: 99, image: '🧘' },
//     ],
//   }

//   const currentProducts = category ? products[category as keyof typeof products] || [] : []
//   const currentCategory = categories.find(cat => cat.id === category)

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             {category ? `${currentCategory?.name || '未知分类'}商店` : '在线商店'}
//           </h1>
//           <p className="mt-2 text-gray-600">
//             可选参数示例：
//             <code className="bg-gray-100 px-1 rounded">shop/-[category].tsx</code>
//             {' '}
//             →
//             {' '}
//             <code className="bg-blue-100 px-1 rounded">/shop/:category?</code>
//           </p>
//           <p className="mt-1 text-sm text-gray-500">
//             当前路径：
//             <code className="bg-yellow-100 px-1 rounded">
//               /shop
//               {category ? `/${category}` : ''}
//             </code>
//           </p>
//         </div>

//         {/* 路径信息 */}
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//           <h3 className="text-lg font-medium text-blue-900 mb-2">路径参数信息</h3>
//           <div className="space-y-2 text-sm">
//             <div>
//               <span className="font-medium text-blue-800">category 参数：</span>
//               <code className="ml-2 bg-blue-100 px-2 py-1 rounded">
//                 {category ? `"${category}"` : 'undefined (可选参数未提供)'}
//               </code>
//             </div>
//             <div>
//               <span className="font-medium text-blue-800">匹配的路径：</span>
//               <code className="ml-2 bg-blue-100 px-2 py-1 rounded">
//                 {category
//                   ? `/shop/${category}`
//                   : '/shop'}
//               </code>
//             </div>
//           </div>
//         </div>

//         {!category
//           ? (
//         // 显示所有分类
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">商品分类</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {categories.map(cat => (
//                     <Link
//                       key={cat.id}
//                       to={`/shop/${cat.id}`}
//                       className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
//                     >
//                       <div className="p-6">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0">
//                             <div className="w-12 h-12 bg-indigo-500 rounded-md flex items-center justify-center">
//                               <span className="text-white font-bold text-lg">
//                                 {cat.name.charAt(0)}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="ml-4">
//                             <h3 className="text-lg font-medium text-gray-900">
//                               {cat.name}
//                             </h3>
//                             <p className="text-sm text-gray-500">
//                               {cat.count}
//                               {' '}
//                               件商品
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//         // 显示特定分类的商品
//               <div>
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     {currentCategory?.name || '未知分类'}
//                   </h2>
//                   <Link
//                     to="/shop"
//                     className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     ← 返回所有分类
//                   </Link>
//                 </div>

//                 {currentProducts.length > 0
//                   ? (
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {currentProducts.map(product => (
//                           <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg">
//                             <div className="p-6">
//                               <div className="text-center">
//                                 <div className="text-6xl mb-4">{product.image}</div>
//                                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                                   {product.name}
//                                 </h3>
//                                 <p className="text-2xl font-bold text-indigo-600 mb-4">
//                                   ¥
//                                   {product.price}
//                                 </p>
//                                 <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
//                                   加入购物车
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )
//                   : (
//                       <div className="text-center py-12">
//                         <p className="text-gray-500">该分类下暂无商品</p>
//                       </div>
//                     )}
//               </div>
//             )}

//         {/* 功能说明 */}
//         <div className="mt-12 bg-white shadow rounded-lg">
//           <div className="px-4 py-5 sm:p-6">
//             <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//               可选参数功能说明
//             </h3>
//             <div className="space-y-4 text-sm text-gray-600">
//               <div>
//                 <h4 className="font-medium text-gray-900">什么是可选参数？</h4>
//                 <p>
//                   使用
//                   <code className="bg-gray-100 px-1 rounded">-[param]</code>
//                   {' '}
//                   语法创建可选参数，转换为
//                   <code className="bg-gray-100 px-1 rounded">:param?</code>
//                   。
//                 </p>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">使用场景：</h4>
//                 <ul className="list-disc list-inside space-y-1 ml-4">
//                   <li>商品分类页面（可显示所有分类或特定分类）</li>
//                   <li>多语言支持（可选语言参数）</li>
//                   <li>分页功能（可选页码参数）</li>
//                   <li>搜索结果（可选搜索关键词）</li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">路径示例：</h4>
//                 <ul className="list-disc list-inside space-y-1 ml-4">
//                   <li>
//                     <code className="bg-gray-100 px-1 rounded">/shop</code>
//                     {' '}
//                     → category = undefined
//                   </li>
//                   <li>
//                     <code className="bg-gray-100 px-1 rounded">/shop/electronics</code>
//                     {' '}
//                     → category = "electronics"
//                   </li>
//                   <li>
//                     <code className="bg-gray-100 px-1 rounded">/shop/clothing</code>
//                     {' '}
//                     → category = "clothing"
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 flex justify-center">
//           <Link
//             to="/"
//             className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//           >
//             返回首页
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }
