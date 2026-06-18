'use client';
import { MenuItem } from "@/lib/libs/interface";
import { memo } from "react";
import { CHART_LOADING } from "@/lib/libs/constants";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () => <div className="h-[400px] flex items-center justify-center">{CHART_LOADING}</div>
});

const PieChart = memo(({ menuItems }: { menuItems: MenuItem[] }) => {
    const chartData = useMemo(() => {
        const validItems = menuItems.filter(item => item.title && item.tpsglobal !== undefined);
        return {
            series: validItems.map(item => item.nbetablissements),
            labels: validItems.map(item => item.title as string)
        };
    }, [menuItems]);

    const options: ApexOptions = useMemo(() => ({
        chart: {
            type: "pie",
            animations: {
                enabled: true,
                easing: 'easeout',
                speed: 800
            },
            toolbar: { show: true }
        },
        labels: chartData.labels,
        legend: {
            position: "bottom",
            fontSize: '14px',
            fontFamily: 'inherit',
            labels: { useSeriesColors: true },
            itemMargin: { horizontal: 10, vertical: 5 }
        },
        tooltip: {
            enabled: true,
            fillSeriesColor: true,
            theme: 'light'
        },
        responsive: [{
            breakpoint: 768,
            options: {
                chart: { width: "100%" },
                legend: {
                    position: "bottom",
                    horizontalAlign: "center",
                    fontSize: '12px'
                },
                plotOptions: { pie: { customScale: 0.8 } }
            }
        }],
        dataLabels: {
            enabled: true,
            style: { fontSize: '12px', fontFamily: 'inherit' },
            dropShadow: { enabled: true }
        },
        plotOptions: {
            pie: { offsetY: 0, donut: { labels: { show: true } } }
        }
    }), [chartData.labels]);

    return (
        <div className="w-full overflow-hidden mb-4">
            <Chart
                options={options}
                series={chartData.series}
                type="pie"
                width="100%"
                height={300}
            />
        </div>
    );

});

interface CharteProps {
    menuItems: MenuItem[];
}

const Charte = memo(({ menuItems }: CharteProps) => {
    return (
        <div className="w-full bg-white p-2 md:p-4 m-4 max-w-4xl mx-auto" >
            <PieChart menuItems={menuItems} />
        </div>
    );
});

export default Charte;