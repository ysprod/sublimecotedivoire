'use client';
import * as React from 'react';
import { Marker } from 'react-map-gl/mapbox';
import { Tooltip } from 'antd';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DataStatistique, FilterType } from '@/libs/interface';
import RegionPopup from './RegionPopup';

interface Props {
    filterType: FilterType;
    selectedRegion: DataStatistique | null;
    setSelectedRegion: (value: DataStatistique | null) => void;
    region: DataStatistique;
    coordinates: [number, number];
    value: number;
    color: string;
    zoomToRegion: (regionName: string) => void;
}

const RegionFragment: React.FC<Props> = ({ region, coordinates, value, color, filterType, zoomToRegion, selectedRegion, setSelectedRegion }) => {

    return (
        <React.Fragment key={region.lib_reg}>
            <Marker
                longitude={coordinates[0]} latitude={coordinates[1]}
                onClick={() => {
                    setSelectedRegion(region);
                    zoomToRegion(region.lib_reg);
                }}
            >
                <Tooltip title={`${region.lib_reg}: ${value} ${filterType === 'all' ? 'etablissemnts' : filterType}`}>
                    <div
                        className="marker-point hover:scale-110 transition-all duration-200 animate-pulse"
                        style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: color,
                            borderRadius: '50%',
                            border: '3px solid white',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                            transform: 'translate(-50%, -50%)'
                        }} />
                </Tooltip>
            </Marker>

            {selectedRegion?.lib_reg === region.lib_reg && (
                <RegionPopup region={region} coordinates={coordinates} setSelectedRegion={setSelectedRegion} />
            )}
        </React.Fragment>
    );
};

RegionFragment.displayName = 'RegionFragment';

export default React.memo(RegionFragment);