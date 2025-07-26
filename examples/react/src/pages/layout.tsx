import { Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Outlet />
    </div>
  )
}
