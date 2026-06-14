"use client";
import DiambraWrapper from "@/components/commons/DiambraWrapper";
import Loader from "@/components/commons/Loader";
import { usePrincipale } from "@/hooks/usePrincipale";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
 
const Filtre = dynamic(() => import("@/components/recherche/Filtre"), { loading: () => <Loader />, ssr: false });

const Principale = () => {
  const props = usePrincipale();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            50% {
              opacity: 0.5;
              transform: translate(-50%, -50%) scale(1.2);
            }
          }`;
    document.head.appendChild(style);

    return () => { document.head.removeChild(style); };
  }, []);

  return (
       <DiambraWrapper>
        <Filtre {...props} />
      </DiambraWrapper>
   );
};

export default React.memo(Principale); 