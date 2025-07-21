import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import routes from '~react-pages'

// console.log('routes ===>', routes)

export default createBrowserRouter(routes as RouteObject[])
