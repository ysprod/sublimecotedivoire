'use client';
import { Typography } from 'antd';
import { memo } from 'react';
const { Text } = Typography;

const Legend = memo(() => (
    <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
        <div className="text-sm font-semibold mb-2">Nombre Etablissements</div>
        <div className="space-y-1">
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#ff4500] mr-2"></div>
                <Text className="text-xs">500+</Text>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#ffa500] mr-2"></div>
                <Text className="text-xs">100-499</Text>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#ffd700] mr-2"></div>
                <Text className="text-xs">1-99</Text>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#cccccc] mr-2"></div>
                <Text className="text-xs">0</Text>
            </div>
        </div>
    </div>
));

Legend.displayName = "Legend";

export default Legend;