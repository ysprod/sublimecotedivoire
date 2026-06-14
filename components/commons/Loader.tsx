'use client';
import { Spin } from "antd";
import clsx from "clsx";
import { motion } from "framer-motion";
import { memo } from "react";

interface LoaderProps {
    spinnerSize?: "small" | "default" | "large";
    spinnerColor?: string;
    backdropBlur?: boolean;
    className?: string;
    texte?: string
}

const Loader = memo(({ spinnerSize = "large", spinnerColor = "border-orange-600", backdropBlur = true, className, texte = '' }: LoaderProps) => {

    return (
        <div className="p-4 max-w-7xl mx-auto flex flex-col justify-center items-center min-h-[1vh]">

            <div className="text-lg mb-1 text-gray-600 uppercase font-semibold">
                {texte}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
                className={clsx("flex flex-col justify-center items-center bg-white/80 mt-2",
                    backdropBlur && "backdrop-blur-md", className
                )}
                aria-live="polite" aria-busy="true" role="status"
            >

                <div className={`p-4 rounded-full border-4 ${spinnerColor}`}>
                    <Spin size={spinnerSize} />
                </div>
            </motion.div>

        </div>
    );
});

Loader.displayName = "Loader";

export default Loader;