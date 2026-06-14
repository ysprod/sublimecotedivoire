"use client";
import React, { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import dynamic from "next/dynamic";
import DiambraWrapper from "@/components/commons/DiambraWrapper";
import ErrorFallback from "@/components/commons/ErrorFallback";
import Loader from "@/components/commons/Loader";
import { handleLoadError } from "@/libs/functions";

const Profile = dynamic(() => import("@/components/profil/Profile"), { loading: () => <Loader />, ssr: false });

const Principale = () => {
    const errorBoundaryHandler = useMemo(() => (error: Error, info: { componentStack: string }) => handleLoadError(error, info), []);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => errorBoundaryHandler}>
            <DiambraWrapper>
                <React.Suspense fallback={<Loader />}>
                    <Profile />
                </React.Suspense>
            </DiambraWrapper>
        </ErrorBoundary>
    );
};

export default React.memo(Principale);