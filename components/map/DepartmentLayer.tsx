// components/map/DepartmentLayer.tsx
'use client';

import { memo, useCallback, useEffect } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/mapbox';

interface DepartmentLayerProps {
  departments: any[];
  onDepartmentClick: (department: any) => void;
  selectedDepartment?: any;
}

export const DepartmentLayer = memo(({ departments, onDepartmentClick, selectedDepartment }: DepartmentLayerProps) => {
  const { current: map } = useMap();

  // ✅ Gestion du clic via l'événement map
  useEffect(() => {
    if (!map) return;

    const handleClick = (e: any) => {
      const features = e.features || [];
      const clickedFeature = features.find((f: any) => f.layer?.id === 'departments-fill');
      
      if (clickedFeature) {
        const department = departments.find(d => d.id === clickedFeature.properties?.id);
        if (department) {
          onDepartmentClick(department);
        }
      }
    };

    map.on('click', handleClick);
    
    map.on('mouseenter', 'departments-fill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'departments-fill', () => {
      map.getCanvas().style.cursor = 'default';
    });

    return () => {
      map.off('click', handleClick);
    //   map.off('mouseenter', 'departments-fill');
    //   map.off('mouseleave', 'departments-fill');
    };
  }, [map, departments, onDepartmentClick]);

  const geoJsonData = {
    type: 'FeatureCollection' as const,
    features: departments.map(dept => ({
      type: 'Feature' as const,
      properties: {
        id: dept.id,
        name: dept.name,
        value: dept.value || 0
      },
      geometry: dept.geometry
    }))
  };

  if (!geoJsonData.features.length) return null;

  return (
    <Source id="departments" type="geojson" data={geoJsonData}>
      <Layer
        id="departments-fill"
        type="fill"
        paint={{
          'fill-color': [
            'case',
            ['==', ['get', 'id'], selectedDepartment?.id || ''],
            '#E8A838',
            '#F5D98E'
          ],
          'fill-opacity': [
            'case',
            ['==', ['get', 'id'], selectedDepartment?.id || ''],
            0.8,
            0.6
          ],
          'fill-outline-color': '#CC8A2E'
        }}
      />
      <Layer
        id="departments-outline"
        type="line"
        paint={{
          'line-color': '#CC8A2E',
          'line-width': 2
        }}
      />
      <Layer
        id="departments-labels"
        type="symbol"
        layout={{
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0],
          'text-anchor': 'center'
        }}
        paint={{
          'text-color': '#6B4C1A',
          'text-halo-color': 'white',
          'text-halo-width': 2
        }}
      />
    </Source>
  );
});

DepartmentLayer.displayName = 'DepartmentLayer';