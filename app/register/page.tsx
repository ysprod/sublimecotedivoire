"use client";
import DiambraWrapper from "@/components/commons/DiambraWrapper";
import Loader from "@/components/commons/Loader";
import dynamic from "next/dynamic";
import React from "react";

const Register = dynamic(() => import("@/components/Register/RegisterForm"), { loading: () => <Loader />, ssr: false });

const Principale = () => {
 
  return (
       <DiambraWrapper>
        <React.Suspense fallback={<Loader />}>
          <Register />
        </React.Suspense>
      </DiambraWrapper>
   );
};

export default React.memo(Principale);