'use client';
import { useState, useCallback, useMemo } from 'react';
import Map, { NavigationControl, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { REGIONS_DATA, DEPARTMENTS_DATA, COMMUNES_DATA } from '@/lib/libs/geographie';
import { CommuneLayer } from './CommuneLayer';
import { DepartmentLayer } from './DepartmentLayer';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { MapPopup } from './MapPopup';
import { RegionLayer } from './RegionLayer';

interface InteractiveMapProps {
  onRegionClick?: (region: any) => void;
  onDepartmentClick?: (department: any) => void;
  onCommuneClick?: (commune: any) => void;
  initialView?: { longitude: number; latitude: number; zoom: number };
}

type ViewLevel = 'country' | 'region' | 'department' | 'commune';

export const InteractiveMap = ({
  onRegionClick,
  onDepartmentClick,
  onCommuneClick,
  initialView = { longitude: -5.2769, latitude: 7.5400, zoom: 6.5 }
}: InteractiveMapProps) => {
  const [viewState, setViewState] = useState(initialView);
  const [viewLevel, setViewLevel] = useState<ViewLevel>('country');
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [popupInfo, setPopupInfo] = useState<any>(null);

  // Données filtrées selon le niveau de vue
  const visibleRegions = useMemo(() => {
    if (viewLevel === 'country') return REGIONS_DATA;
    if (viewLevel === 'region' && selectedRegion) {
      return REGIONS_DATA.filter(r => r.id === selectedRegion.id);
    }
    return [];
  }, [viewLevel, selectedRegion]);

  const visibleDepartments = useMemo(() => {
    if (viewLevel === 'region' && selectedRegion) {
      return DEPARTMENTS_DATA.filter(d => d.regionId === selectedRegion.id);
    }
    if (viewLevel === 'department' && selectedDepartment) {
      return DEPARTMENTS_DATA.filter(d => d.id === selectedDepartment.id);
    }
    return [];
  }, [viewLevel, selectedRegion, selectedDepartment]);

  const visibleCommunes = useMemo(() => {
    if (viewLevel === 'department' && selectedDepartment) {
      return COMMUNES_DATA.filter(c => c.departmentId === selectedDepartment.id);
    }
    return [];
  }, [viewLevel, selectedDepartment]);

  // Handlers
  const handleRegionClick = useCallback((region: any) => {
    setSelectedRegion(region);
    setViewLevel('region');
    setViewState({
      ...viewState,
      longitude: region.center[0],
      latitude: region.center[1],
      zoom: 9
    });
    onRegionClick?.(region);
  }, [viewState, onRegionClick]);

  const handleDepartmentClick = useCallback((department: any) => {
    setSelectedDepartment(department);
    setViewLevel('department');
    setViewState({
      ...viewState,
      longitude: department.center[0],
      latitude: department.center[1],
      zoom: 11
    });
    onDepartmentClick?.(department);
  }, [viewState, onDepartmentClick]);

  const handleCommuneClick = useCallback((commune: any) => {
    setViewLevel('commune');
    setViewState({
      ...viewState,
      longitude: commune.center[0],
      latitude: commune.center[1],
      zoom: 13
    });
    onCommuneClick?.(commune);
    setPopupInfo(commune);
  }, [viewState, onCommuneClick]);

  const handleBack = useCallback(() => {
    if (viewLevel === 'commune') {
      setViewLevel('department');
      setPopupInfo(null);
      setViewState({
        ...viewState,
        zoom: 11
      });
    } else if (viewLevel === 'department') {
      setViewLevel('region');
      setSelectedDepartment(null);
      setViewState({
        ...viewState,
        zoom: 9
      });
    } else if (viewLevel === 'region') {
      setViewLevel('country');
      setSelectedRegion(null);
      setViewState({
        ...viewState,
        zoom: 6.5
      });
    }
  }, [viewLevel, viewState]);

  return (
    <div className="relative w-full h-[700px] rounded-lg overflow-hidden shadow-lg">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        minZoom={5}
        maxZoom={16}
      >
        <NavigationControl position="top-right" />

        {/* Contrôles de navigation */}
        <MapControls
          viewLevel={viewLevel}
          onBack={handleBack}
          levelName={
            viewLevel === 'commune' ? selectedDepartment?.name :
            viewLevel === 'department' ? selectedRegion?.name :
            viewLevel === 'region' ? 'Côte d\'Ivoire' :
            'Côte d\'Ivoire'
          }
        />

        {/* Couches */}
        {viewLevel !== 'department' && viewLevel !== 'commune' && (
          <RegionLayer
            regions={visibleRegions}
            onRegionClick={handleRegionClick}
            selectedRegion={selectedRegion}
          />
        )}

        {(viewLevel === 'region' || viewLevel === 'department') && (
          <DepartmentLayer
            departments={visibleDepartments}
            onDepartmentClick={handleDepartmentClick}
            selectedDepartment={selectedDepartment}
          />
        )}

        {viewLevel === 'department' && (
          <CommuneLayer
            communes={visibleCommunes}
            onCommuneClick={handleCommuneClick}
          />
        )}

        {/* Popup */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.center[0]}
            latitude={popupInfo.center[1]}
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            anchor="bottom"
            className="z-50"
          >
            <MapPopup data={popupInfo} type="commune" />
          </Popup>
        )}

        <MapLegend />
      </Map>
    </div>
  );
};