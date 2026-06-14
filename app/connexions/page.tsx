"use client";
import DiambraWrapper from "@/components/commons/DiambraWrapper";
import Loader from "@/components/commons/Loader";
import dynamic from "next/dynamic";
import { memo } from "react";

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
    <DiambraWrapper>
      <LazyConnexions />
    </DiambraWrapper> 
));

Principale.displayName = "Principale";

export default Principale;