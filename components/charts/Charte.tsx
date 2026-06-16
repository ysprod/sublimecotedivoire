'use client';
import { MenuItem } from "@/lib/libs/interface";
import { memo } from "react";
import PieChart from "./PieChart";

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