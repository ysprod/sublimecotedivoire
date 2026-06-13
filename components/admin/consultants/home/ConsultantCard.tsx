"use client";
import type { User } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import { toMediaUrl } from "@/lib/functions";
import Image from "next/image";
import { useState } from "react";

function safeStr(value: unknown, fallback = "—") {
  const normalized =
    typeof value === "string"
      ? value.trim()
      : value == null
        ? ""
        : String(value).trim();

  return normalized || fallback;
}

const ConsultantCard = memo(({
  practitioner, 
}: {
  practitioner: User; 
}) => {
    const [imageError, setImageError] = useState(false);

  const initial = practitioner?.nom ? practitioner.nom.slice(0, 1).toUpperCase() : "✨";
  const displayName = practitioner?.nomconsultant || practitioner?.username || practitioner?.nom || "Guide Spirituel";
 

  const photoUrl = useMemo(() => {
    const photo = safeStr(practitioner?.photo, "");
    const profilePicture = safeStr(practitioner?.profilePicture, "");
    const avatar = safeStr(practitioner?.avatar, "");
    return toMediaUrl(photo || profilePicture || avatar || null);
  }, [practitioner?.avatar, practitioner?.photo, practitioner?.profilePicture]);

 
  return (
    <article
     
      className="relative group w-full overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl" />
      </div>
      

      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative aspect-[4/4]">
          {photoUrl && !imageError ? (
            <>
              <Image
                src={photoUrl}
                alt={displayName}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover transition-all duration-700 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            </>
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-indigo-100 to-purple-100">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl font-black text-indigo-400"
              >
                {initial}
              </motion.div>
            </div>
          )}
        </div>
      </div>

 
    </ article>
  );
});

export default ConsultantCard;