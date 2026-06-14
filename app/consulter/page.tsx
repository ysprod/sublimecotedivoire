"use client";
import Loader from "@/components/commons/Loader";
import { usePrincipale } from "@/hooks/usePrincipale";
import dynamic from "next/dynamic";
import { memo } from "react";

const MenuDiambra = dynamic(
    () => import("@/components/consulter/MenuDiambra").then(mod => mod.default || mod),
    {
        loading: () => <Loader />,
        ssr: false,
    }
);

const Principale = memo(function Principale() {
    const props = usePrincipale();
    return (<MenuDiambra {...props} />);
});

export default Principale;