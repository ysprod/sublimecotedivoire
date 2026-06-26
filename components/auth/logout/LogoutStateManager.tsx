'use client';
import { LogoutState } from "@/lib/libs/interface";
import { LoadingState } from "./LoadingState";
import { SuccessState } from "./SuccessState";
import { ErrorState } from "./ErrorState";

interface LogoutStateManagerProps {
  progress: number;
  status: LogoutState;
}

export function LogoutStateManager({ progress, status }: LogoutStateManagerProps) {
  switch (status) {
    case "loading":
      return <LoadingState progress={progress} />;
    case "success":
      return <SuccessState />;
    case "error":
      return <ErrorState />;
    default:
      return null;
  }
}