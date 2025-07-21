import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function BaseLayout({ children }: LayoutProps) {
  return (
    <div>
      <aside>侧边栏</aside>
      <div>{children}</div>
    </div>
  )
}
