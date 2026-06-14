"use client";
import { Table } from 'antd';
import { DataStatistique } from '@/lib/libs/interface';
import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Image from "next/image";
import { EnvironmentOutlined, BarChartOutlined } from "@ant-design/icons";

interface TableStatistiquesRegionProps {
    data: DataStatistique[];
    onRowClick?: (record: DataStatistique | { cod_reg: number | string; lib_reg: string; Total: number; Inscription: number; Radiation: number; Rectification: number; }) => void;
    zoomToRegion: (regionName: string) => void
}

const TableStatistiquesRegion: React.FC<TableStatistiquesRegionProps> = React.memo(({ data, onRowClick, zoomToRegion }) => {
    const columns = [
        {
            title: (
                <span className="flex items-center">
                    <EnvironmentOutlined style={{ marginRight: 8, fontSize: '16px' }} />REGION
                </span>
            ),
            dataIndex: 'lib_reg',
            key: 'lib_reg',
            width: '50px',
            render: (text: string) => (<a onClick={() => zoomToRegion(text)} style={{ cursor: 'pointer' }}>{text}</a>),
        },
        {
            title: (
                <span className="flex items-center whitespace-nowrap">
                    <BarChartOutlined style={{ marginRight: 8, fontSize: '16px' }} />TOTAL
                </span>
            ),
            dataIndex: 'Total',
            key: 'Total',
            sorter: (a: DataStatistique, b: DataStatistique) => a.Total - b.Total,
        },
        {
            title: (
                <div className="flex justify-center">
                    <div style={{ width: 24, height: 24, position: 'relative' }}>
                        <Image src="/icons/hotel.png" alt="HOTEL" fill style={{ objectFit: 'contain' }} />
                    </div>
                </div>
            ),
            dataIndex: 'Inscription',
            key: 'Inscription',
            sorter: (a: DataStatistique, b: DataStatistique) => a.Inscription - b.Inscription,
        },
        {
            title: (
                <div className="flex justify-center">
                    <div style={{ width: 24, height: 24, position: 'relative' }}>
                        <Image src="/icons/residence.png" alt="RESIDENCE" fill style={{ objectFit: 'contain' }} />
                    </div>
                </div>
            ),
            dataIndex: 'Radiation',
            key: 'Radiation',
            sorter: (a: DataStatistique, b: DataStatistique) => a.Radiation - b.Radiation,
        },
        {
            title: (
                <div className="flex justify-center">
                    <div style={{ width: 24, height: 24, position: 'relative' }}>
                        <Image src="/icons/maisondhote.png" alt="MAISON D'HÔTE" fill style={{ objectFit: 'contain' }} />
                    </div>
                </div>
            ),
            dataIndex: 'Rectification',
            key: 'Rectification',
            sorter: (a: DataStatistique, b: DataStatistique) => a.Rectification - b.Rectification,
        },
    ];

    const dataWithTotal = [...data, {
        cod_reg: "total", lib_reg: "Total",
        Total: data.reduce((sum, item) => sum + (item.Total || 0), 0),
        Inscription: data.reduce((sum, item) => sum + (item.Inscription || 0), 0),
        Radiation: data.reduce((sum, item) => sum + (item.Radiation || 0), 0),
        Rectification: data.reduce((sum, item) => sum + (item.Rectification || 0), 0),
    }];

    return (
        <Table
            columns={columns} dataSource={dataWithTotal} pagination={false} size="middle" className="mt-4 m-0 m-0"
            rowKey={(record) => record.cod_reg || record.lib_reg || Math.random().toString()}
            rowClassName={(record) => record.lib_reg === "Total" ? "bg-gray-100 font-bold" : ""}
            onRow={(record) => ({
                onClick: () => record.lib_reg !== "Total" && onRowClick ? onRowClick(record) : undefined,
                style: { cursor: record.lib_reg !== "Total" ? 'pointer' : 'default' }
            })}
        />
    );

});

TableStatistiquesRegion.displayName = "TableStatistiquesRegion";

export default TableStatistiquesRegion; 