/**
 * Inbox Module Routes Configuration
 * Centralized routing configuration for the Inbox module
 */

import { lazy } from 'react';

import { IRouteConfig } from '../types';

// Lazy load Inbox pages for code splitting
const InboxList = lazy(() =>
  import('../../pages/Inbox').then((module) => ({ default: module.InboxList }))
);

const InboxDetail = lazy(() =>
  import('../../pages/Inbox').then((module) => ({ default: module.InboxDetail }))
);

const InboxCompose = lazy(() =>
  import('../../pages/Inbox').then((module) => ({ default: module.InboxCompose }))
);

/**
 * Inbox module routes
 * All routes related to inbox/messaging functionality
 */
export const inboxRoutes: IRouteConfig[] = [
  {
    path: '/inbox',
    element: InboxList,
    title: 'Inbox',
    description: 'View and manage your messages',
    protected: true,
  },
  {
    path: '/inbox/compose',
    element: InboxCompose,
    title: 'Compose Message',
    description: 'Create a new message',
    protected: true,
  },
  {
    path: '/inbox/:messageId',
    element: InboxDetail,
    title: 'Message Details',
    description: 'View message details',
    protected: true,
  },
];

export default inboxRoutes;
