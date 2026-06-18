"use client";
import Loader from "@/components/commons/Loader";
import React from "react";
import dynamic from "next/dynamic";

const Profile = dynamic(() => import("@/components/profil/Profile"), { loading: () => <Loader />, ssr: false });

const Principale = () => {

    return (
        <React.Suspense fallback={<Loader />}>
            <Profile />
        </React.Suspense>
    );
};

export default React.memo(Principale);