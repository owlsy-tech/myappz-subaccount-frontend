/**
 * AppRoutes Component
 * Renders application routes from configuration
 */

import { Routes, Route } from 'react-router-dom';

import { routes } from './config';
import { IRouteConfig } from './types';

/**
 * Recursively renders a single route and its children
 */
const renderRoute = (route: IRouteConfig, index: number) => {
  const Element = route.element;
  const key = `${route.path}-${index}`;

  // If route has children, render nested routes
  if (route.children && route.children.length > 0) {
    return (
      <Route key={key} path={route.path} element={<Element />}>
        {route.children.map((childRoute, childIndex) => renderRoute(childRoute, childIndex))}
      </Route>
    );
  }

  // Render regular route
  return <Route key={key} path={route.path} element={<Element />} index={route.index} />;
};

/**
 * Main AppRoutes Component
 * Renders all application routes from configuration
 */
const AppRoutes = () => {
  return <Routes>{routes.map((route, index) => renderRoute(route, index))}</Routes>;
};

export default AppRoutes;
