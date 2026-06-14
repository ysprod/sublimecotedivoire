"use client";
import DiambraWrapper from "@/components/commons/DiambraWrapper";
import Loader from "@/components/commons/Loader";
import dynamic from "next/dynamic";
import React from "react";

const Profile = dynamic(() => import("@/components/profil/Profile"), { loading: () => <Loader />, ssr: false });

const Principale = () => {

    return (
        <DiambraWrapper>
            <React.Suspense fallback={<Loader />}>
                <Profile />
            </React.Suspense>
        </DiambraWrapper>
    );
};

export default React.memo(Principale);