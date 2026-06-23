// components/map/CommuneLayer.tsx
'use client';

import { memo, useEffect } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/mapbox';

interface CommuneLayerProps {
  communes: any[];
  onCommuneClick: (commune: any) => void;
}

export const CommuneLayer = memo(({ communes, onCommuneClick }: CommuneLayerProps) => {
  const { current: map } = useMap();

  // ✅ Gestion du clic via l'événement map
  useEffect(() => {
    if (!map) return;

    const handleClick = (e: any) => {
      const features = e.features || [];
      const clickedFeature = features.find((f: any) => f.layer?.id === 'communes-fill');
      
      if (clickedFeature) {
        const commune = communes.find(c => c.id === clickedFeature.properties?.id);
        if (commune) {
          onCommuneClick(commune);
        }
      }
    };

    map.on('click', handleClick);
    
    map.on('mouseenter', 'communes-fill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'communes-fill', () => {
      map.getCanvas().style.cursor = 'default';
    });

    return () => {
      map.off('click', handleClick);
    //   map.off('mouseenter', 'communes-fill');
    //   map.off('mouseleave', 'communes-fill');
    };
  }, [map, communes, onCommuneClick]);

  const geoJsonData = {
    type: 'FeatureCollection' as const,
    features: communes.map(commune => ({
      type: 'Feature' as const,
      properties: {
        id: commune.id,
        name: commune.name,
        value: commune.value || 0
      },
      geometry: commune.geometry
    }))
  };

  if (!geoJsonData.features.length) return null;

  return (
    <Source id="communes" type="geojson" data={geoJsonData}>
      <Layer
        id="communes-fill"
        type="fill"
        paint={{
          'fill-color': '#7BC8A4',
          'fill-opacity': 0.7,
          'fill-outline-color': '#4A9E7A'
        }}
      />
      <Layer
        id="communes-outline"
        type="line"
        paint={{
          'line-color': '#4A9E7A',
          'line-width': 1.5
        }}
      />
      <Layer
        id="communes-labels"
        type="symbol"
        layout={{
          'text-field': ['get', 'name'],
          'text-size': 10,
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0],
          'text-anchor': 'center'
        }}
        paint={{
          'text-color': '#1A4A3A',
          'text-halo-color': 'white',
          'text-halo-width': 2
        }}
      />
    </Source>
  );
});

CommuneLayer.displayName = 'CommuneLayer';