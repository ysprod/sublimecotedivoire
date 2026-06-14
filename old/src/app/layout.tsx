import type { Metadata } from "next";
import "./globals.css";
import clsx from "clsx";
import { ErrorBoundary } from "react-error-boundary";
import ClientLayout from "../../../components/commons/ClientLayout";
import ErrorFallback from "@/components/commons/ErrorFallback";
import Header from "../../../components/commons/Header";
import { AuthProvider } from "@/context/AuthContext";
import { APP_NAME, APP_DESCRIPTION, APP_AUTHOR, APP_ICONS, APP_KEYWORDS } from "@/libs/constants";
import { memo } from "react";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
  authors: [APP_AUTHOR],
  icons: APP_ICONS,
  manifest: "/manifest.json",
  robots: "index, follow",
};

const MemoizedHeader = memo(Header);

const MainContent = memo(({ children }: { children: React.ReactNode }) => (
  <main role="main" className="bg-white w-full flex-grow">
    <ClientLayout />
    <MemoizedHeader />
    {children}
  </main>
));

MainContent.displayName = "MainContent";

const RootLayoutComponent = memo(({ children }: { children: React.ReactNode }) => (
  <html lang="fr">
    <body className={clsx("bg-white flex flex-col")}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthProvider>
          <MainContent>{children}</MainContent>
        </AuthProvider>
      </ErrorBoundary>
    </body>
  </html>
));

RootLayoutComponent.displayName = "RootLayoutComponent";

export default RootLayoutComponent;