// app/logout/LogoutClient.tsx (Client Component)
'use client';

import { useLogoutPage } from "@/hooks/auth/logout/useLogoutPage";
import { LogoutStateManager } from "./LogoutStateManager";
import { SecurityBadge } from "./SecurityBadge";
import { LogoutState } from "@/lib/libs/interface";


export default function LogoutClient() {
    const { progress, status } = useLogoutPage();

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-white p-4">
            <div className="relative z-10 w-full max-w-sm sm:max-w-md">
                <LogoutStateManager progress={progress} status={status as LogoutState} />
                <SecurityBadge />
            </div>
        </div>
    );
}