'use client';
import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MenuItem } from '@/libs/interface';
import { CHART_LOADING } from '@/libs/constants';

const ApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => <div className="h-[400px] flex items-center justify-center">{CHART_LOADING}</div>
});

const colors = ['#008FFB', '#00E396', '#FEB019'];

const DistributedBarChart = ({ menuItems }: { menuItems: MenuItem[] }) => {

    const chartData = useMemo(() => {
        const validItems = menuItems.filter(item => item.title && item.tpsglobal !== undefined);
        return {
            series: [{ data: validItems.map(item => item.nbetablissements) }],
            labels: validItems.map(item => item.title as string)
        };
    }, [menuItems]);

    const [chartState] = useState({
        options: {
            chart: {
                height: 350,
                type: 'bar' as const,
                toolbar: { show: true },
                events: {
                    click: function (chart: unknown, w: unknown, e: unknown) {
                        console.log(chart, w, e);
                    }
                }
            },
            colors: colors,
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                    borderRadius: 4
                }
            },
            grid: { padding: { left: 10, right: 10 } },
            dataLabels: { enabled: true },
            legend: { show: false },
            xaxis: {
                categories: chartData.labels,
                labels: {
                    style: {
                        colors: colors,
                        fontSize: '12px',
                        fontWeight: 600
                    }
                },
                axisBorder: { show: true },
                axisTicks: { show: true }
            },
            yaxis: { show: true },
            tooltip: { enabled: true }
        },
        series: chartData.series
    });

    return (
        <div className="bg-white flex flex-col items-center justify-center min-h-[400px] p-2">
            <div className="w-full max-w-[700px]">
                <div id="chart" className="px-4">
                    {typeof window !== 'undefined' && (
                        <ApexChart
                            options={chartState.options}
                            series={chartState.series}
                            type="bar"
                            height={400}
                            width="100%"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(DistributedBarChart);