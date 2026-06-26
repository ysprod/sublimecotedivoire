export const endpoints = {
  root: '/',
  auth: {
    register: '/api/v1/auth/register',
    login: '/api/v1/auth/login',
    refresh: '/api/v1/auth/refresh',
    me: '/api/v1/auth/me',
    logout: '/api/v1/auth/logout',
  },
  users: {
    list: '/users',
    byId: (id: string) => `/users/${id}`,
    stats: (id: string) => `/users/${id}/stats`,
    role: (id: string) => `/users/${id}/role`,
    permissions: (id: string) => `/users/${id}/permissions`,
    password: (id: string) => `/users/${id}/password`,
  },

  services: {
    list: '/services',
    create: '/services',
    byId: (id: string) => `/services/${id}`,
    featured: '/services/featured',
  },

  notifications: {
    list: '/notifications',
    unread: '/notifications/unread',
    unreadCount: '/notifications/unread/count',
    byId: (id: string) => `/notifications/${id}`,
    markAsRead: (id: string) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    preferences: '/notifications/preferences',
  },

  userAccess: {
    mySubscription: '/user-access/subscription-info',
    checkAccess: (rubriqueId: string) => `/user-access/check-access/${rubriqueId}`,
  },
};

export default endpoints;