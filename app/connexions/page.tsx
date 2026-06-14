"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";
import DiambraWrapper from "@/components/commons/DiambraWrapper";
import ErrorFallback from "@/components/commons/ErrorFallback";
import Loader from "@/components/commons/Loader";

const MemoizedLoader = memo(() => <Loader />);
MemoizedLoader.displayName = "MemoizedLoader";

const LazyConnexions = dynamic(
  () => import("@/components/connexions/ConnexionHistory")
    .then((module) => {
      const Component = module.default || module;
      const MemoizedComponent = memo(Component);
      MemoizedComponent.displayName = "MemoizedConnexions";
      return MemoizedComponent;
    }), { loading: () => <MemoizedLoader />, ssr: false }
);

const Principale = memo(() => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <DiambraWrapper>
      <LazyConnexions />
    </DiambraWrapper>
  </ErrorBoundary>
));

Principale.displayName = "Principale";

export default Principale;