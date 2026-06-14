"use client";
import React, { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import dynamic from "next/dynamic";
import DiambraWrapper from "@/components/commons/DiambraWrapper";
import ErrorFallback from "@/components/commons/ErrorFallback";
import Loader from "@/components/commons/Loader";
import { usePrincipale } from "@/hooks/usePrincipale";
import { handleLoadError } from "@/libs/functions";

const MemoizedLoader = React.memo(() => <Loader />);

MemoizedLoader.displayName = "MemoizedLoader";

const MenuDiambra = dynamic(
    () => import("@/components/consulter/MenuDiambra")
        .then((mod) => {
            const Component = mod.default || mod;
            const MemoizedComponent = React.memo(Component);
            MemoizedComponent.displayName = "MemoizedMenuDiambra";
            return MemoizedComponent;
        }),
    { loading: () => <MemoizedLoader />, ssr: false }
);

const Principale = () => {
    const props = usePrincipale();

    const errorBoundaryHandler = useMemo(() => (error: Error, info: { componentStack: string }) => handleLoadError(error, info), []);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => errorBoundaryHandler}>
            <DiambraWrapper>
                <MenuDiambra {...props} />
            </DiambraWrapper>
        </ErrorBoundary>
    );
};

Principale.displayName = "Principale";

export default React.memo(Principale);