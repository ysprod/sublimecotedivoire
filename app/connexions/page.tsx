"use client";
import { ComponentType, lazy, memo, Suspense } from "react";
import Loader from "@/components/commons/Loader";

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