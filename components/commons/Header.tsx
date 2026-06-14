"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import LogoutButton from "./LogoutButton";
import { APP_NAME } from "@/libs/constants";

const Header = React.memo(() => (
  <header>
    <div className="bg-white text-center container mx-auto flex flex-col items-center justify-center gap-2">

      <LogoutButton />

      <Link href="/" aria-label="Accueil"
        className="flex flex-col items-center"
        onClick={() => window.location.href = '/'}
      >
        <Image width={80} height={80} src="/logo.png" alt={APP_NAME} className="w-22 h-22" />

        <h2 className="bg-white text-blue-700 text-xxs font-bold text-center cursor-pointer">
          {APP_NAME}
        </h2>
      </Link>
    </div>
  </header>
));

Header.displayName = "Header";

export default Header;