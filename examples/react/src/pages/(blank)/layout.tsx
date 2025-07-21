import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function BlankLayout({ children }: LayoutProps) {
  return (
    <div>
      {children}
    </div>
  )
}
