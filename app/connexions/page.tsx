"use client";
import Loader from "@/components/commons/Loader";
import { ComponentType, lazy, memo, Suspense } from "react";

const LazyConnexions = lazy<ComponentType>(
  () => import("@/components/connexions/ConnexionHistory")
);

const Principale = memo(function Principale() {
  return (
    <Suspense fallback={<Loader />}>
      <LazyConnexions />
    </Suspense>
  );
});

export default Principale;