export const config = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    apiVersion: 'v1', // pas de version, routes directes
    timeout: 300000, // 5 minutes (hooks longs peuvent override)
  },
  auth: {
    tokenKey: 'monetoile_access_token',
    refreshTokenKey: 'monetoile_refresh_token',
    tokenExpirationBuffer: 360, // 360 secondes avant expiration
  },
  routes: {
    home: '/',
    login: '/auth/login',
    register: '/auth/register',
    dashboard: '/star/profil',
    adminDashboard: '/admin',
    profile: '/profile',
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};

export default config;