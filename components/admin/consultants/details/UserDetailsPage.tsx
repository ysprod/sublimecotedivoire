"use client";
import { InfoRow } from "@/components/admin/consultants/details/InfoRow";
import Section from "@/components/admin/consultants/details/SectionOne";
import UserDetailsError from "@/components/admin/consultants/details/UserDetailsError";
import UserDetailsHeader from "@/components/admin/consultants/details/UserDetailsHeader";
import UserDetailsLoading from "@/components/admin/consultants/details/UserDetailsLoading";
import UserDetailsNotFound from "@/components/admin/consultants/details/UserDetailsNotFound";
import { formatDateFR } from "@/components/admin/consultations/DisplayConsultationCard/helpers";
import CacheLink from '@/components/commons/CacheLink';
import { useUserDetailsPage } from "@/hooks/admin/consultants/useUserDetailsPage";
import { joinList, safeString } from "@/lib/utils";
import {
    Activity, Calendar, Edit, Globe,
    Phone, Settings2, Shield, User as UserIcon
} from "lucide-react";

export default function UserDetailsPage() {
    const { user, loading, error } = useUserDetailsPage();

    if (loading) return <UserDetailsLoading />;
    if (error) return <UserDetailsError error={error} />;
    if (!user) return <UserDetailsNotFound />;

    return (
        <div className="w-full mx-auto  max-w-5xl px-4 py-10 bg-white text-slate-900">
            <div className="rounded-[28px] p-[1px] bg-[conic-gradient(from_180deg,rgba(124,58,237,0.20),rgba(6,182,212,0.14),rgba(236,72,153,0.12),rgba(124,58,237,0.20))] shadow-[0_24px_70px_-40px_rgba(2,6,23,0.35)]">
                <div className="relative rounded-[27px] border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 overflow-hidden">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <UserDetailsHeader username={user.username} role={user.role} />
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                            <CacheLink
                                href={`/admin/consultants/${user._id}/edit`}
                                className="inline-flex items-center gap-2 rounded-2xl bg-cosmic-indigo hover:bg-cosmic-purple px-4 py-2.5 text-sm font-extrabold text-white shadow-sm dark:bg-cosmic-pink dark:hover:bg-cosmic-indigo"
                            >
                                <Edit className="h-4 w-4" />
                                Modifier
                            </CacheLink>
                            <CacheLink
                                href="/admin/consultants"
                                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-slate-800"
                            >
                                Retour à la liste
                            </CacheLink>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-5">
                <Section
                    icon={<Settings2 className="h-5 w-5" />}
                    title="Préférences personnelles"
                    subtitle="Domaines"
                    defaultOpen
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <InfoRow icon={<Shield className="h-4 w-4" />} label="Spécialités" value={joinList(user.specialties)} />
                        <InfoRow icon={<Activity className="h-4 w-4" />} label="Rating" value={safeString(user.rating)} />
                    </div>
                </Section>
                <Section
                    icon={<UserIcon className="h-5 w-5" />}
                    title="Identité & Contact"
                    subtitle="Toutes les informations  "
                    defaultOpen
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <InfoRow icon={<Phone className="h-4 w-4" />} label="Téléphone" value={safeString(user.phone)} copyValue={user.phone ?? null} />
                        <InfoRow icon={<Globe className="h-4 w-4" />} label="Pays" value={safeString(user.country)} />
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Créé le" value={formatDateFR(typeof user.createdAt === 'string' ? user.createdAt : undefined)} />
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Mis à jour le" value={formatDateFR(typeof user.updatedAt === 'string' ? user.updatedAt : undefined)} />
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Nom" value={safeString(user.nom)} />
                        <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Prénoms" value={safeString(user.prenoms)} />
                        <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Genre" value={safeString(user.gender)} />
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date de naissance" value={formatDateFR(typeof user.dateNaissance === 'string' ? user.dateNaissance : typeof user.dateOfBirth === 'string' ? user.dateOfBirth : undefined)} />
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Heure de naissance" value={safeString(user.heureNaissance)} />
                        <InfoRow icon={<Globe className="h-4 w-4" />} label="Pays de naissance" value={safeString(user.paysNaissance)} />
                        <InfoRow icon={<Globe className="h-4 w-4" />} label="Ville de naissance" value={safeString(user.villeNaissance)} />
                    </div>
                </Section>
            </div>
        </div>
    );
}