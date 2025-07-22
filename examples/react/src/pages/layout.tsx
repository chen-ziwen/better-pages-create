import { Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <html>
      <body>
        <header>
          <nav>全局导航</nav>
        </header>
        <main>
          <Outlet />
        </main>
        <footer>全局页脚</footer>
      </body>
    </html>
  )
}
