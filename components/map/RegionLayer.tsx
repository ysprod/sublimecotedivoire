// components/map/RegionLayer.tsx
'use client';

import { memo, useCallback, useEffect } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/mapbox';

interface RegionLayerProps {
  regions: any[];
  onRegionClick: (region: any) => void;
  selectedRegion?: any;
}

export const RegionLayer = memo(({ regions, onRegionClick, selectedRegion }: RegionLayerProps) => {
  const { current: map } = useMap();

  // ✅ Gestion du clic via l'événement map
  useEffect(() => {
    if (!map) return;

    const handleClick = (e: any) => {
      const features = e.features || [];
      const clickedFeature = features.find((f: any) => f.layer?.id === 'regions-fill');
      
      if (clickedFeature) {
        const region = regions.find(r => r.id === clickedFeature.properties?.id);
        if (region) {
          onRegionClick(region);
        }
      }
    };

    map.on('click', handleClick);
    
    // Curseur interactif
    map.on('mouseenter', 'regions-fill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'regions-fill', () => {
      map.getCanvas().style.cursor = 'default';
    });

    return () => {
      map.off('click', handleClick);
    //   map.off('mouseenter', 'regions-fill');
    //   map.off('mouseleave', 'regions-fill');
    };
  }, [map, regions, onRegionClick]);

  const geoJsonData = {
    type: 'FeatureCollection' as const,
    features: regions.map(region => ({
      type: 'Feature' as const,
      properties: {
        id: region.id,
        name: region.name,
        value: region.value || 0
      },
      geometry: region.geometry
    }))
  };

  if (!geoJsonData.features.length) return null;

  return (
    <Source id="regions" type="geojson" data={geoJsonData}>
      <Layer
        id="regions-fill"
        type="fill"
        paint={{
          'fill-color': [
            'case',
            ['==', ['get', 'id'], selectedRegion?.id || ''],
            '#4F83D1',
            '#B8D4F0'
          ],
          'fill-opacity': [
            'case',
            ['==', ['get', 'id'], selectedRegion?.id || ''],
            0.8,
            0.6
          ],
          'fill-outline-color': '#2E5AA6'
        }}
      />
      <Layer
        id="regions-outline"
        type="line"
        paint={{
          'line-color': '#2E5AA6',
          'line-width': 2,
          'line-opacity': 0.8
        }}
      />
      <Layer
        id="regions-labels"
        type="symbol"
        layout={{
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0],
          'text-anchor': 'center'
        }}
        paint={{
          'text-color': '#1a3a5c',
          'text-halo-color': 'white',
          'text-halo-width': 2
        }}
      />
    </Source>
  );
});

RegionLayer.displayName = 'RegionLayer';