import { Navigate } from 'react-router-dom'

function Index() {
  return (
    <Navigate
      replace
      to="/home"
    />
  )
}

export default Index
