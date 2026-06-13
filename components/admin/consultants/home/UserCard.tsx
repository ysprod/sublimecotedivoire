"use client";
import CacheLink from '@/components/commons/CacheLink';
import { prefetchAdminUserDetail } from '@/lib/cache/route-prefetch';
import { cx } from "@/lib/functions";
import type { User } from "@/lib/interfaces";
import { useQueryClient } from '@tanstack/react-query';
import type { Variants } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Edit,
  Globe,
  Phone,
  User as UserIcon
} from "lucide-react";
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useMemo } from "react";

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

type UserCardProps = {
  user: User;
  cardVariants: Variants;
};

function safeInitial(username?: string | null) {
  const s = (username ?? "").trim();
  return s ? s[0]!.toUpperCase() : "U";
}

function formatDateTimeFR(input?: string | number | Date | null) {
  if (!input) return "—";
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

const Pill = memo(function Pill({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border",
        "bg-cosmic-pink/10 border-cosmic-indigo text-cosmic-indigo dark:bg-cosmic-pink/20 dark:border-cosmic-pink dark:text-cosmic-pink",
        className,
      )}
    >
      {children}
    </span>
  );
});
Pill.displayName = "Pill";

function UserCardBase({ user, cardVariants }: UserCardProps) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = String(user._id ?? user.id ?? '');

  const handlePrefetch = useCallback(() => {
    if (!userId) return;
    void router.prefetch(`/admin/consultants/${userId}/details`);
    void prefetchAdminUserDetail(queryClient, userId);
  }, [queryClient, router, userId]);

  const vm = useMemo(() => {
    const username = user.username ?? "Utilisateur";
    const phone = user.phone ?? "";
    const country = user.country ?? "";
    const gender = user.gender ?? "";
    const createdAtLabel = formatDateTimeFR(user.createdAt);
    const lastLoginLabel = formatDateTimeFR(user.lastLogin);
    const photo=user.photo??"";

    const role = user.role ?? "USER";
    const isActive = Boolean(user.isActive);
    const premium = Boolean(user.premium);
    const notif = Boolean(user.preferences?.notifications);
    const totalConsultations = Number(user.totalConsultations ?? 0);

    const genderLabel =
      gender === "male" ? "Homme" : gender === "female" ? "Femme" : "";

    const initial = safeInitial(username);

    return {
      username,
      initial,
      phone,
      photo,
      country,
      genderLabel,
      createdAtLabel,
      lastLoginLabel,
      role,
      isActive,
      premium,
      notif,
      totalConsultations,
    };
  }, [user]);

  return (
    <motion.article
      variants={cardVariants}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
      className={cx(
        "group relative overflow-hidden rounded-2xl border p-3 flex flex-col w-full h-full min-h-[340px] max-w-sm min-w-[280px]",
        "border-slate-200/80 bg-white/75 shadow-sm backdrop-blur",
        "hover:shadow-md hover:border-slate-300/80",
        "dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/7 dark:hover:border-white/15",
        "transition-all",
      )}
      style={{ minHeight: 340, minWidth: 280, maxWidth: 384, height: '100%' }}
    >
      {/* Accent glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={cx(
            "absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl opacity-70",
            vm.premium ? "bg-amber-400/25 dark:bg-amber-400/10" : "bg-indigo-400/20 dark:bg-indigo-400/10",
          )}
        />
        <div className="absolute -bottom-20 right-[-30px] h-48 w-48 rounded-full bg-[#4F83D1]/15 blur-3xl dark:bg-[#2E5AA6]/12" />
      </div>

      <div className="relative flex items-center gap-3">       
        <ConsultantCard practitioner={user}  />        
      </div>

        
      {/* Details */}
      <div className="relative mt-3 space-y-1.5 border-t border-slate-200/60 pt-3 dark:border-white/10">
      <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
            {vm.username}
          </h3>
        </div>
        {vm.phone ? (
          <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/75">
            <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/35" />
            <span className="truncate">{vm.phone}</span>
          </div>
        ) : null}

        {vm.country ? (
          <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/75">
            <Globe className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/35" />
            <span className="truncate">{vm.country}</span>
          </div>
        ) : null}

        {vm.genderLabel ? (
          <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/75">
            <UserIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/35" />
            <span className="truncate">{vm.genderLabel}</span>
          </div>
        ) : null}

        <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/75">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/35" />
          <span className="truncate">Créé : {vm.createdAtLabel}</span>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/75">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/35" />
          <span className="truncate">Dernière connexion : {vm.lastLoginLabel}</span>
        </div>
      </div>  

      <div className="relative mt-3 grid grid-cols-3 gap-2">
        <CacheLink
          href={`/admin/consultants/${userId}/details`}
          onMouseEnter={handlePrefetch}
          onFocus={handlePrefetch}
          className={cx(
            "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold",
            "bg-gradient-to-r from-slate-500 to-slate-700 text-white shadow-sm",
            "hover:shadow-md hover:from-slate-600 hover:to-slate-800 transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:focus-visible:ring-slate-700/40",
          )}
        >
          <UserIcon className="h-4 w-4" />
          Détails
        </CacheLink>

        <CacheLink
          href={`/admin/consultants/${userId}/edit`}
          onMouseEnter={handlePrefetch}
          onFocus={handlePrefetch}
          className={cx(
            "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold",
            "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm",
            "hover:shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-700/40",
          )}
        >
          <Edit className="h-4 w-4" />
          Modifier
        </CacheLink>
      </div>
    </motion.article>
  );
}

const UserCard = memo(
  UserCardBase,
  (prev, next) => {
    return (
      prev.user._id === next.user._id
    );
  },
);

UserCard.displayName = "UserCard";

export default UserCard;