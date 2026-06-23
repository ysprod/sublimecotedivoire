// lib/data/geographie.ts

// Données des régions (GeoJSON simplifié)
export const REGIONS_DATA = [
  {
    id: 'abidjan',
    name: 'Abidjan',
    center: [-4.0083, 5.3599],
    geometry: { /* GeoJSON polygon */ }
  },
  {
    id: 'yamoussoukro',
    name: 'Yamoussoukro',
    center: [-5.2769, 6.8276],
    geometry: { /* GeoJSON polygon */ }
  },
  // ... autres régions
];

// Données des départements
export const DEPARTMENTS_DATA = [
  {
    id: 'abidjan-sud',
    name: 'Abidjan Sud',
    regionId: 'abidjan',
    center: [-4.0083, 5.3199],
    geometry: { /* GeoJSON polygon */ }
  },
  // ... autres départements
];

// Données des communes
export const COMMUNES_DATA = [
  {
    id: 'cocody',
    name: 'Cocody',
    departmentId: 'abidjan-sud',
    center: [-3.9983, 5.3499],
    geometry: { /* GeoJSON polygon */ }
  },
  // ... autres communes
];