# 🚀 Guide de Cache - Mon DATAKWABA

Ce document explique comment utiliser le système de cache multi-niveaux mis en place pour optimiser les performances du site.

## 📋 Architecture du Cache

Le système de cache est organisé en 3 niveaux:

### Niveau 1: Service Worker (Cache HTTP)
- **Localisation**: `public/service-worker.js`
- **Utilité**: Cache agressif des assets statiques, images, et pages
- **Stratégie**: 
  - Assets statiques (JS/CSS): Cache immutable pendant 1 an
  - Images: Cache pendant 30 jours
  - API: Cache pendant 5 minutes
  - Pages dynamiques: Cache pendant 24h

### Niveau 2: React Query (Cache Mémoire + localStorage)
- **Configuration**: `lib/cache/queryClient.ts`
- **Utilité**: Cache intelligent des données API en mémoire
- **Stratégie**:
  - `staleTime`: 10 minutes (données considérées fraîches)
  - `gcTime`: 5 minutes (durée avant garbage collection)
  - Persistance automatique dans localStorage
  - Retry automatique sur erreur

### Niveau 3: IndexedDB (Cache Long Terme)
- **Configuration**: `lib/cache/indexedDB.ts`
- **Utilité**: Stockage de données volumineuses (cartes du ciel, analyses)
- **Capacité**: Jusqu'à plusieurs centaines de Mo
- **TTL personnalisables**:
  - Consultations: 5 minutes
  - Cartes du ciel: 30 jours
  - Analyses: Variable selon le type

## 🎯 Utilisation Pratique

### 1. Utiliser React Query dans vos hooks

```typescript
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import { api } from '@/lib/api/client';

export function useMyData() {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.MY_FEATURE,
    queryFn: async () => {
      const response = await api.get('/my-endpoint');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30,   // 30 minutes
  });

  return { data, isLoading, error };
}
```

### 2. Utiliser IndexedDB pour les données volumineuses

```typescript
import { saveToCache, getFromCache } from '@/lib/cache/indexedDB';

// Sauvegarder une carte du ciel
await saveToCache('cartesDuCiel', {
  userId: 'user123',
  data: carteDuCielData,
  timestamp: Date.now(),
  expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 jours
});

// Récupérer une carte du ciel
const cached = await getFromCache('cartesDuCiel', 'user123');
if (cached && cached.expiresAt > Date.now()) {
  // Utiliser les données du cache
  return cached.data;
}
```

### 3. Hooks prêts à l'emploi avec cache

#### Notifications
```typescript
import { useNotificationsWithCache } from '@/hooks/cache/useNotificationsWithCache';

function MyComponent() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotificationsWithCache();

  return (
    <div>
      <h2>Notifications ({unreadCount})</h2>
      {notifications.map(notif => (
        <div key={notif.id} onClick={() => markAsRead(notif.id)}>
          {notif.message}
        </div>
      ))}
    </div>
  );
}
```

#### Carte du Ciel
```typescript
import { useCarteDuCielWithCache } from '@/hooks/cache/useCarteDuCielWithCache';

function CarteDuCiel({ userId }: { userId: string }) {
  const {
    carteDuCiel,
    isLoading,
    regenerate,
    isRegenerating,
  } = useCarteDuCielWithCache(userId);

  if (isLoading) return <Loading />;

  return (
    <div>
      <CarteDuCielDisplay data={carteDuCiel} />
      <button onClick={() => regenerate()} disabled={isRegenerating}>
        Regénérer
      </button>
    </div>
  );
}
```

## 🔧 Configuration Next.js

Les headers de cache HTTP sont configurés automatiquement dans [next.config.js](next.config.js):

- **Assets statiques** (`/_next/static/*`): Cache 1 an, immutable
- **Images** (`.jpg`, `.png`, `.webp`, etc.): Cache 1 an, immutable
- **Routes API** (`/api/*`): Pas de cache (must-revalidate)

## 📊 Monitoring du Cache

### En développement

Un indicateur visuel apparaît en bas à gauche montrant:
- État de la connexion (en ligne/hors ligne)
- Taille du cache actuel

### DevTools React Query

En mode développement, les React Query DevTools sont disponibles:
- Visualiser toutes les queries en cache
- Voir le statut (fresh, stale, fetching)
- Invalider manuellement des queries

## 🎨 Optimisations Next.js

### Images

```tsx
import Image from 'next/image';

<Image
  src="/mon-image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // Pour les images above-the-fold
  loading="lazy" // Pour les images below-the-fold
/>
```

Next.js génère automatiquement:
- Format WebP/AVIF
- Tailles responsive (srcset)
- Lazy loading

### Fonts

Les fonts sont préchargées et optimisées:
```typescript
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
```

## 🧹 Maintenance du Cache

### Nettoyer le cache expiré

Le nettoyage automatique se fait:
- Au chargement de l'application
- Toutes les heures

Pour forcer le nettoyage:
```typescript
import { cleanExpiredCache } from '@/lib/cache/indexedDB';

await cleanExpiredCache();
```

### Vider tout le cache

```typescript
import { clearAllCache } from '@/lib/cache/indexedDB';
import { clearServiceWorkerCache } from '@/lib/cache/serviceWorker.utils';

// Vider IndexedDB
await clearAllCache();

// Vider le Service Worker
await clearServiceWorkerCache();

// Vider React Query
queryClient.clear();
```

### Calculer la taille du cache

```typescript
import { getCacheSize } from '@/lib/cache/indexedDB';
import { getCacheSize as getSWCacheSize } from '@/lib/cache/serviceWorker.utils';

const indexedDBSize = await getCacheSize();
const swCacheSize = await getSWCacheSize();
const totalSize = indexedDBSize + swCacheSize;

console.log(`Taille totale du cache: ${formatBytes(totalSize)}`);
```

## 📝 Bonnes Pratiques

### 1. Définir des clés de query appropriées

```typescript
// ✅ Bon: clés spécifiques et descriptives
queryKey: QUERY_KEYS.CONSULTATION_DETAIL(consultationId)

// ❌ Mauvais: clés trop génériques
queryKey: ['data']
```

### 2. Invalider le cache après mutations

```typescript
const mutation = useMutation({
  mutationFn: updateConsultation,
  onSuccess: () => {
    // Invalider le cache des consultations
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONSULTATIONS });
  },
});
```

### 3. Utiliser des mises à jour optimistes

```typescript
const mutation = useMutation({
  mutationFn: markAsRead,
  onMutate: async (notifId) => {
    // Annuler les queries en cours
    await queryClient.cancelQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    
    // Sauvegarder l'état actuel
    const previous = queryClient.getQueryData(QUERY_KEYS.NOTIFICATIONS);
    
    // Mise à jour optimiste
    queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS, (old) => 
      old.map(n => n.id === notifId ? {...n, isRead: true} : n)
    );
    
    return { previous };
  },
  onError: (err, vars, context) => {
    // Rollback en cas d'erreur
    queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS, context.previous);
  },
});
```

### 4. Précharger les données critiques

```typescript
// Au chargement de la page
useEffect(() => {
  // Précharger les notifications
  queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS,
    queryFn: fetchNotifications,
  });
}, []);
```

### 5. Gérer le mode hors ligne

```typescript
import { isOnline } from '@/lib/cache/serviceWorker.utils';

if (!isOnline()) {
  // Utiliser uniquement le cache
  const cachedData = await getFromCache('consultations', consultationId);
  return cachedData?.data;
}
```

## 🔒 Sécurité

- **Jamais** mettre en cache des données sensibles (tokens, mots de passe)
- Les tokens JWT sont stockés dans localStorage/cookies, pas dans le cache
- Les données personnelles dans IndexedDB sont liées au domaine
- Le Service Worker ne cache pas les routes d'authentification

## 📈 Performances Attendues

Avec cette stratégie de cache:
- **Chargement initial**: ~2-3s
- **Chargements suivants**: ~200-500ms (depuis le cache)
- **Mode hors ligne**: Application fonctionnelle avec données en cache
- **Économie de bande passante**: ~70-80% pour les utilisateurs récurrents

## 🐛 Debugging

### Problèmes courants

**Cache pas mis à jour:**
```typescript
// Forcer le refetch
queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_DATA });
```

**Service Worker pas actif:**
- Vérifier dans DevTools > Application > Service Workers
- Désenregistrer et réenregistrer si nécessaire

**IndexedDB plein:**
```typescript
// Vérifier la taille
const size = await getCacheSize();
console.log(`Taille: ${formatBytes(size)}`);

// Nettoyer si nécessaire
if (size > 50 * 1024 * 1024) { // 50 Mo
  await cleanExpiredCache();
}
```

## 🚀 Déploiement

En production:
1. Le Service Worker est automatiquement enregistré
2. React Query persiste dans localStorage
3. IndexedDB nettoie automatiquement le cache expiré
4. Les headers HTTP sont servis par Next.js

Pas de configuration supplémentaire nécessaire!
