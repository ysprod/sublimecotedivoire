"use client";
import Loader from "@/components/commons/Loader";
import dynamic from "next/dynamic";
import React from "react";

const Profile = dynamic(() => import("@/components/profil/Profile"), { loading: () => <Loader />, ssr: false });

const Principale = () => {

    return (
        <React.Suspense fallback={<Loader />}>
            <Profile />
        </React.Suspense>
    );
};

export default React.memo(Principale);