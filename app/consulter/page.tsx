"use client";
import DiambraWrapper from "@/components/commons/DiambraWrapper";
import Loader from "@/components/commons/Loader";
import { usePrincipale } from "@/hooks/usePrincipale";
import dynamic from "next/dynamic";
import React from "react";

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
 
    return (
             <DiambraWrapper>
                <MenuDiambra {...props} />
            </DiambraWrapper>
     );
};

Principale.displayName = "Principale";

export default React.memo(Principale);