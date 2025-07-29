import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import routes from '~react-pages'

export default createBrowserRouter(routes as RouteObject[])
