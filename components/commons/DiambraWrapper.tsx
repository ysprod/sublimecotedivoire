"use client";
import { diambraMoov } from "@/libs/constants";
import { motion } from "framer-motion";
import { memo } from "react";

interface DiambraWrapperProps {
    children?: React.ReactNode;
}

const DiambraWrapper: React.FC<DiambraWrapperProps> = memo(({ children }) => {
    return (
        <motion.div key="diambrawrapper"  {...diambraMoov}
            className="bg-white w-full mb-2 flex flex-col items-center justify-center"
        >

            <div className="w-full max-w-lg p-1 flex flex-col items-center justify-center">
                {children}
            </div>

        </motion.div>
    );
});

DiambraWrapper.displayName = "DiambraWrapper";

export default DiambraWrapper;