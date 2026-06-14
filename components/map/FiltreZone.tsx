'use client';
import * as React from 'react';
import { Tooltip, Select, Space, Button } from 'antd';
import { SortAscendingOutlined, FilterOutlined } from '@ant-design/icons';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ConfigSort, FilterType } from '@/lib/libs/interface';

interface Props {
    filterType: FilterType;
    setIsFilterModalOpen: (value: boolean) => void;
    setSortConfig: React.Dispatch<React.SetStateAction<ConfigSort | null>>;
    setFilterType: React.Dispatch<React.SetStateAction<FilterType>>
}

const CarteStat: React.FC<Props> = ({ setIsFilterModalOpen, filterType, setSortConfig, setFilterType }) => {
    const handleSort = (key: string) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    return (
        <div className="flex mb-4">
            <Select
                value={filterType}
                onChange={setFilterType}
                style={{ width: '100%' }}
                options={[
                    { value: 'all', label: 'Toutes les etablissements' },
                    { value: 'hotel', label: 'Hotels' },
                    { value: 'residence', label: 'Residences' },
                    { value: 'maison hote', label: 'Maisons hotes' }
                ]}
            />
            <Space>
                <Tooltip title="Trier">
                    <Button icon={<SortAscendingOutlined />} onClick={() => handleSort('Total')} />
                </Tooltip>
                <Tooltip title="Filtres avancés">
                    <Button icon={<FilterOutlined />} onClick={() => setIsFilterModalOpen(true)} />
                </Tooltip>
            </Space>
        </div>
    );
};

export default React.memo(CarteStat);