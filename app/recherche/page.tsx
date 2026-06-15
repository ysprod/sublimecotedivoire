"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/commons/Loader";
import { usePrincipale } from "@/hooks/datakwaba/usePrincipale";

const Filtre = dynamic(
  () => import("@/components/recherche/Filtre"),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const Principale = () => {
  const props = usePrincipale();
  return (<Filtre {...props} />);
};

export default memo(Principale);