import { useAdminUsers } from '@/hooks/admin/users/useAdminUsers';
import api from '@/lib/api/client';
import { User } from '@/lib/interfaces';
import { getErrorMessage } from '@/lib/utils/errorHelpers';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type UserStatus = 'all' | 'active' | 'inactive';
export type UserRole = 'all' | 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'CONSULTANT';

export function useUsersPageController() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole>('CONSULTANT');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { users: apiUsers, total, loading, error, refetch } = useAdminUsers({
    search: searchQuery,
    status: statusFilter,
    role: roleFilter,
    page: currentPage,
    limit: 6,
  });

  const mapUserToUserData = (user: Partial<User>): User => ({
    _id: user._id,
    username: user.username ?? '',
    prenoms: user.prenoms ?? '',
    nom: user.nom ?? '',
    phone: user.phone ?? '',
    status: user.status ?? 'active',
    photo: user.photo ?? '',
    isActive: user.isActive,
    createdAt: user.createdAt ?? new Date().toISOString(),
    lastLogin: user.lastLogin ?? undefined,
    consultationsCount: user.consultationsCount ?? 0,
    totalConsultations: user.totalConsultations ?? user.consultationsCount ?? 0,
    rating: user.rating ?? 0,
    credits: user.credits ?? 0,
    country: user.country ?? '',
    gender: user.gender ?? 'male',
    premium: user.premium || false,
    role: user.role,
    avatar: user.avatar ?? '',
    customPermissions: user.customPermissions ?? [],
    dateOfBirth: user.dateOfBirth ?? undefined,
    updatedAt: user.updatedAt ?? new Date(),
    aspectsTexte: user.aspectsTexte ?? '',
    bio: user.bio ?? '',
    specialties: Array.isArray(user.specialties)
      ? user.specialties
      : typeof user.specialties === 'string'
        ? [user.specialties]
        : [],
    video: user.video ?? '',
    presentation: user.presentation ?? '',
    profilePicture: user.profilePicture ?? '',
    domains: Array.isArray(user.domains)
      ? user.domains
      : typeof user.domains === 'string'
        ? [user.domains]
        : [],
    methods: Array.isArray(user.methods)
      ? user.methods
      : typeof user.methods === 'string'
        ? [user.methods]
        : [],

  });

  const users: User[] = useMemo(() => (apiUsers ? apiUsers.map(mapUserToUserData) : []), [apiUsers]);

  // Nouvelle logique : stats globales (non paginées)
  const [globalStats, setGlobalStats] = useState<{
    total: number;

  } | null>(null);

  const fetchGlobalStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      // On suppose que res.data.users contient les stats globales
      setGlobalStats({
        total: res.data.users.total,
      });
    } catch (err: unknown) {
      console.error('Erreur stats globales', getErrorMessage(err, 'Erreur stats globales'));
    }
  }, []);

  // Chargement au montage et lors du refresh
  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  const stats = globalStats;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refetch]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
    setCurrentPage(1);
  }, []);

  const totalPages = Math.ceil(total / 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };


  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    },
    [setSearchQuery, setCurrentPage]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const hasActiveFilters = useMemo(
    () => statusFilter !== 'all' || roleFilter !== 'all',
    [statusFilter, roleFilter]
  );

  const hasFilters = useMemo(
    () => searchQuery.trim().length > 0 || hasActiveFilters,
    [searchQuery, hasActiveFilters]
  );

  const hasUsers = useMemo(() => users && users.length > 0, [users]);

  return {
    handlePageChange, handleSearch, handleClearSearch, handleResetFilters, handleRefresh,
    stats, searchQuery, isRefreshing, loading, error, users, containerVariants,
    cardVariants, currentPage, totalPages, hasUsers, hasFilters,
  };
}