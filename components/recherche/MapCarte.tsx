// app/recherche/components/MapCarte.tsx
'use client';

import { REGIONS_COORDINATES } from '@/lib/libs/constants';
import { DataStatistique, FilterType } from '@/lib/libs/interface';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { memo, useCallback, useEffect, useRef } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import Legend from '../../components/map/Legend';
import RegionFragment from '../../components/map/RegionFragment';

interface MapCarteProps {
  data: DataStatistique[];
  filterType: FilterType;
  selectedRegion: DataStatistique | null;
  setSelectedRegion: (value: DataStatistique | null) => void;
  getColor: (total: number) => "#cccccc" | "#ffd700" | "#ffa500" | "#ff4500";
  getValue: (region: DataStatistique) => number;
  getFilteredAndSortedData: () => DataStatistique[];
}

export const MapCarte = memo(({
  data,
  filterType,
  selectedRegion,
  setSelectedRegion,
  getColor,
  getValue,
  getFilteredAndSortedData
}: MapCarteProps) => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current && data?.length > 0) {
      const timer = setTimeout(() => {
        const bounds = new mapboxgl.LngLatBounds();
        data.forEach(region => {
          const coordinates = REGIONS_COORDINATES[region.lib_reg.trim()];
          if (coordinates) {
            bounds.extend([coordinates[0], coordinates[1]]);
          }
        });
        if (!bounds.isEmpty()) {
          mapRef.current.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            maxZoom: 7,
            duration: 1500,
            easing: (t: number) => t * (2 - t)
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const zoomToRegion = useCallback((regionName: string) => {
    const coordinates = REGIONS_COORDINATES[regionName.trim()];
    if (coordinates && mapRef.current) {
      mapRef.current.flyTo({
        center: [coordinates[0], coordinates[1]],
        zoom: 8,
        duration: 1500,
        essential: true
      });
    }
  }, []);

  return (
    <div style={{ height: '700px', width: '100%', position: 'relative' }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ longitude: -5.2769, latitude: 7.5400, zoom: 6.5 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onLoad={(event) => {
          const map = event.target;
          map.setLayoutProperty('country-label', 'text-field', [
            'match',
            ['get', 'name_en'],
            'Ivory Coast',
            'Côte d\'Ivoire',
            ['get', 'name_en']
          ]);
        }}
        minZoom={6}
        maxZoom={10}
        maxBounds={[[-8.6, 4.2], [-2.5, 10.7]]}
      >
        <NavigationControl position="top-right" />
        {getFilteredAndSortedData().map(region => {
          const coordinates = REGIONS_COORDINATES[region.lib_reg.trim()];
          if (!coordinates) return null;
          const value = getValue(region);
          const color = getColor(value);
          return (
            <RegionFragment
              key={region.lib_reg}
              filterType={filterType}
              region={region}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              coordinates={coordinates}
              value={value}
              color={color}
              zoomToRegion={zoomToRegion}
            />
          );
        })}
      </Map>
      <Legend />
    </div>
  );
});

MapCarte.displayName = "MapCarte";