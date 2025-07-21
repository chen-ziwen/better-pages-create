// 声明虚拟模块类型
declare module '~react-pages' {
  import type { ReactElement } from 'react'

  const routes: ReactElement[]
  export default routes
}

declare module 'virtual:better-pages-create' {
  import type { ReactElement } from 'react'

  const routes: ReactElement[]
  export default routes
}
