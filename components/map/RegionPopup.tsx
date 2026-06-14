'use client';
import * as React from 'react';
import { Popup } from 'react-map-gl/mapbox';
import { Typography } from 'antd';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DataStatistique } from '@/lib/libs/interface';

const { Title, Text } = Typography;

interface Props {
    setSelectedRegion: (value: DataStatistique | null) => void;
    coordinates: [number, number];
    region: DataStatistique;
}

const RegionPopup: React.FC<Props> = ({ region, coordinates, setSelectedRegion }) => {

    return (
        <Popup
            longitude={coordinates[0]}
            latitude={coordinates[1]}
            onClose={() => setSelectedRegion(null)}
            closeButton={true}
            closeOnClick={false}
            anchor="bottom"
            offset={[-10, -30]}
        >
            <div className="p-3">
                <Title level={5} className="mb-3">{region.lib_reg}</Title>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Text>Total:</Text>
                        <Text strong className="text-lg">{region.Total}</Text>
                    </div>
                    <div className="flex justify-between items-center">
                        <Text>Hôtel:</Text>
                        <Text strong>{region.Inscription}</Text>
                    </div>
                    <div className="flex justify-between items-center">
                        <Text>Residence:</Text>
                        <Text strong>{region.Radiation}</Text>
                    </div>
                    <div className="flex justify-between items-center">
                        <Text>Maison d&apos;hotes:</Text>
                        <Text strong>{region.Rectification}</Text>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

RegionPopup.displayName = 'RegionPopup';

export default React.memo(RegionPopup);