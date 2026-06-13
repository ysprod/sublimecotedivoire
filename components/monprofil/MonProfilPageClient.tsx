"use client";
import { memo } from "react";
 
import UserHub from "./utilisateur/UserHub";

function MonProfilPageClientImpl() {

  return (
    <main className="relative mx-auto w-full max-w-5xl px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div className="w-full mx-auto flex flex-col items-center justify-center gap-4">
        <UserHub />
      </div>
    </main>
  );
}

const MonProfilPageClient = memo(MonProfilPageClientImpl);

export default MonProfilPageClient;