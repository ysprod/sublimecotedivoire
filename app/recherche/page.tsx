"use client";
import Loader from "@/components/commons/Loader";
import dynamic from "next/dynamic";
import { memo } from "react";

const Filtre = dynamic(
  () => import("@/components/recherche/Filtre"),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const Principale = () => {
  return (<Filtre />);
};

export default memo(Principale);