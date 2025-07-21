import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html>
      <body>
        <header>
          <nav>全局导航</nav>
        </header>
        <main>{children}</main>
        <footer>全局页脚</footer>
      </body>
    </html>
  )
}
