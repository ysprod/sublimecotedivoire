'use client';
import { RETRY_MESSAGE } from "@/libs/constants";
import React, { memo } from "react";

type ErrorRetryProps = {
  error: string;
  refresh: () => void;
};

const Reessayer: React.FC<ErrorRetryProps> = memo(({ error = '', refresh }) => {

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col justify-center items-center min-h-[60vh]">

      <div className="text-red-500 mb-4">{error}</div>

      <button
        onClick={refresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        {RETRY_MESSAGE}
      </button>
    </div>
  );
});

Reessayer.displayName = "Reessayer";

export default Reessayer;