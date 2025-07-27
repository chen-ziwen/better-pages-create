/**
 * @handle {
 * "title": "首页",
 * "requiresAuth": false,
 * "const": true,
 * "meta": {
 *   "description": "主页"
 *   }
 * }
 */

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
