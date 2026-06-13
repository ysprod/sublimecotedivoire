"use client";
import { useEditCategoryPage } from "@/hooks/admin/categories/useEditCategoryPage";
import { cx, rubriqueLabel } from "@/lib/functions";
import { Rubrique } from "@/lib/interfaces";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Eye, Layers, Sparkles, Tags } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useRubriquesPickerSimple } from "@/hooks/admin/rubriques/useRubriquesPickerSimple";
import { getRubriqueId } from "@/lib/functions";
import { Trash2, X } from "lucide-react";

type EditCategoryBannerProps = React.ComponentProps<typeof Banner>['banner'];
type EditCategorySwitcherProps = React.ComponentProps<typeof CategoryViewSwitcher>;
type BannerType = { type: "success" | "error" | "info"; message: string } | null;
type EditCategoryFormProps = React.ComponentProps<typeof CategoryForm>;
type EditCategoryPreviewProps = React.ComponentProps<typeof PreviewCard>;
type EditCategorySuccessProps = React.ComponentProps<typeof SuccessCard>;

interface RubriquesGridProps {
  normalized: Array<{ id: string; label: string }>;
  selectedSet: Set<string>;
  onToggle: (id: string) => void;
}

const RubriquesGrid: React.FC<RubriquesGridProps> = ({ normalized, selectedSet, onToggle }) => {

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {normalized.map(({ id, label }) => {
        const active = selectedSet.has(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            aria-label={`${label} ${active ? "sélectionnée" : "non sélectionnée"}`}
            className={cx(
              "relative overflow-hidden rounded-2xl border p-3 text-left transition-all",
              "active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-[#2E5AA6]/40",
              active
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20"
                : "border-slate-200 bg-white hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800/40"
            )}
          >
            <div
              className={cx(
                "absolute inset-x-0 top-0 h-1",
                active
                  ? "bg-gradient-to-r from-emerald-500 to-lime-500"
                  : "bg-gradient-to-r from-[#4F83D1]/20 to-[#2E5AA6]/20"
              )}
            />
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div
                  className={cx(
                    "text-[12px] font-extrabold leading-tight",
                    active ? "text-emerald-950 dark:text-emerald-100" : "text-slate-900 dark:text-white"
                  )}
                >
                  {label}
                </div>
                <div
                  className={cx(
                    "mt-1 text-[10px]",
                    active
                      ? "text-emerald-800/80 dark:text-emerald-200/80"
                      : "text-slate-500 dark:text-zinc-400"
                  )}
                >
                  {active ? "Sélectionnée" : "Toucher pour sélectionner"}
                </div>
              </div>
              <div
                className={cx(
                  "grid h-7 w-7 place-items-center rounded-xl border text-xs font-black",
                  active
                    ? "border-emerald-200 bg-white text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950 dark:text-emerald-200"
                    : "border-slate-200 bg-slate-50 text-slate-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                )}
              >
                {active ? <Check className="h-4 w-4" /> : "+"}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const RubriquesPickerLoading = React.memo(function RubriquesPickerLoading() {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-6 shadow-lg dark:border-[color:var(--theme-border)] dark:from-[#13274C] dark:via-[#0F1C3F] dark:to-[#162A56]"
    >
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-transparent via-blue-100/30 to-transparent dark:via-[#4F83D1]/10"
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-4 text-center">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2E5AA6] to-[#9BC2FF] opacity-50 blur-xl" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] shadow-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        <div className="space-y-1.5">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF] bg-clip-text text-sm font-bold text-transparent"
          >
            Chargement des rubriques
          </motion.p>
          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1]"
              />
            ))}
          </div>
        </div>

        {/* Skeleton grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0.3, 0.6, 0.3], y: 0 }}
              transition={{
                opacity: { duration: 1.5, repeat: Infinity, delay: i * 0.1 },
                y: { duration: 0.3, delay: i * 0.05 },
              }}
              className="h-8 rounded-lg bg-gradient-to-r from-blue-200 to-slate-200 dark:from-[#163A74] dark:to-[#13274C]"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});


interface RubriquesChipsProps {
  chips: Rubrique[];
  onRemove: (id: string) => void;
}

const RubriquesChips: React.FC<RubriquesChipsProps> = ({ chips, onRemove }) => {
  if (chips.length === 0) return null;

  return (
    <div className="mb-3 flex flex-wrap gap-1.5">
      {chips.map((r: Rubrique) => {
        const id = getRubriqueId(r);
        if (!id) return null;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onRemove(id)}
            className="group inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100"
            aria-label={`Retirer ${rubriqueLabel(r)}`}
            title="Retirer"
          >
            <Check className="h-3 w-3" />
            <span className="max-w-[200px] truncate">{rubriqueLabel(r)}</span>
            <X className="h-3 w-3 opacity-70 transition-opacity group-hover:opacity-100" />
          </button>
        );
      })}
    </div>
  );
};



const RubriquesPickerSimple = React.memo(function RubriquesPickerSimple({
  rubriques,
  selectedIds,
  selectedSet,
  loading,
  onToggle,
  onRemove,
  onClear,
}: {
  rubriques: Rubrique[];
  selectedIds: string[];
  selectedSet: Set<string>;
  loading: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {

  const { normalized, chips } = useRubriquesPickerSimple(rubriques, selectedIds);

  if (loading) {
    return <RubriquesPickerLoading />;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-[11px] font-extrabold text-slate-900 dark:text-white">
          Rubriques <span className="opacity-60">({selectedIds.length})</span>
        </div>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-800 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100 dark:hover:bg-rose-900/30"
            aria-label="Effacer la sélection"
          >
            <Trash2 className="h-3 w-3" /> Effacer
          </button>
        )}
      </div>

      {chips.length > 0 ? (
        <RubriquesChips chips={chips} onRemove={onRemove} />
      ) : (
        <div className="mb-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          Touchez une rubrique pour l’ajouter.
        </div>
      )}

      <RubriquesGrid normalized={normalized} selectedSet={selectedSet} onToggle={onToggle} />
    </div>
  );
});


interface CategoryFormProps {
  nom: string;
  setNom: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  rubriques: Rubrique[];
  rubriqueIds: string[];
  selectedSet: Set<string>;
  rubriquesLoading: boolean;
  toggleRubrique: (id: string) => void;
  clearSelection: () => void;
  goPreview: () => void;
  selectionSummary: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  nom, setNom, description, setDescription, rubriques, rubriqueIds, selectedSet, rubriquesLoading, toggleRubrique, clearSelection, goPreview
}) => (
  <div className="grid gap-3">
    <input
      className="theme-dark-input w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4F83D1] focus:ring-2 focus:ring-[#9BC2FF]/40 dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F] dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-[#4F83D1] dark:focus:ring-[#2E5AA6]/40"
      placeholder="Nom"
      value={nom}
      onChange={(e) => setNom(e.target.value)}
      aria-label="Nom de la catégorie"
    />

    <textarea
      className="theme-dark-input w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4F83D1] focus:ring-2 focus:ring-[#9BC2FF]/40 dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F] dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-[#4F83D1] dark:focus:ring-[#2E5AA6]/40"
      placeholder="Description"
      rows={3}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      aria-label="Description de la catégorie"
    />
    <RubriquesPickerSimple
      rubriques={rubriques}
      selectedIds={rubriqueIds}
      selectedSet={selectedSet}
      loading={rubriquesLoading}
      onToggle={toggleRubrique}
      onRemove={toggleRubrique}
      onClear={clearSelection}
    />
    <div className="flex justify-end">
      <button
        onClick={goPreview}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:from-[#254A8B] hover:to-[#3F73BE]"
        aria-label="Aller à l'aperçu"
      >
        <Eye className="h-4 w-4" />
        Aperçu
      </button>
    </div>
  </div>
);

const SuccessCard = React.memo(function SuccessCard({
  nom,
  onGoList,
  onEditAnother,
  reducedMotion,
}: {
  nom: string;
  onGoList: () => void;
  onEditAnother: () => void;
  reducedMotion: boolean;
}) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-900/20">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-lime-600 text-white shadow-sm">
          <Check className={cx("h-5 w-5", !reducedMotion && "animate-bounce")} />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100">Catégorie modifiée</h2>
          <p className="text-[11px] text-emerald-800 dark:text-emerald-200">
            “{nom || "Catégorie"}” a été mise à jour.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onEditAnother}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-zinc-950 dark:text-emerald-100 dark:hover:bg-emerald-900/30"
          aria-label="Retour à la liste"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </button>

        <button
          onClick={onGoList}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:from-[#254A8B] hover:to-[#3F73BE]"
          aria-label="Voir la liste des catégories"
        >
          Voir la liste <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});

const PreviewCard = React.memo(function PreviewCard({
  nom,
  description,
  selectedRubriques,
  busy,
  onBack,
  onConfirm,
}: {
  nom: string;
  description: string;
  selectedRubriques: Rubrique[];
  busy: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const items = useMemo(
    () => selectedRubriques.map(rubriqueLabel).filter(Boolean).sort((a, b) => a.localeCompare(b)),
    [selectedRubriques]
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-lime-600 text-white shadow-sm">
          <Eye className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Aperçu</h2>
          <p className="text-[11px] text-slate-600 dark:text-zinc-300">Vérifiez avant de modifier</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-[11px] font-bold text-slate-700 dark:text-zinc-200">Nom</div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">{nom.trim() || "—"}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-[11px] font-bold text-slate-700 dark:text-zinc-200">Description</div>
          <div className="text-[12px] text-slate-700 dark:text-zinc-200">{description.trim() || "—"}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 text-[11px] font-bold text-slate-700 dark:text-zinc-200">
            Rubriques ({items.length})
          </div>
          {items.length === 0 ? (
            <div className="text-[11px] text-slate-600 dark:text-zinc-300">Aucune rubrique.</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {items.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
            aria-label="Retour à l'édition"
          >
            <ArrowLeft className="h-4 w-4" /> Modifier
          </button>

          <button
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:from-[#254A8B] hover:to-[#3F73BE] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Confirmer la modification"
          >
            <Sparkles className={cx("h-4 w-4", busy && "animate-spin")} />
            {busy ? "Modification..." : "Enregistrer"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

interface CategoryViewSwitcherProps {
  view: string;
  pageLoading: boolean;
  formProps: EditCategoryFormProps;
  previewProps: EditCategoryPreviewProps;
  successProps: EditCategorySuccessProps;
}

const CategoryViewSwitcher: React.FC<CategoryViewSwitcherProps> = ({
  view, pageLoading, formProps, previewProps, successProps
}) => {
  if (pageLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-800" />
        <div className="mt-3 h-24 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-800" />
        <div className="mt-3 h-56 w-full animate-pulse rounded-3xl bg-slate-200 dark:bg-zinc-800" />
      </div>
    );
  }
  return (
    <AnimatePresence mode="wait" initial={false}>
      {view === "edit" && (
        <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <CategoryForm {...formProps} />
        </motion.div>
      )}

      {view === "preview" && (
        <PreviewCard {...previewProps} />
      )}

      {view === "success" && (
        <SuccessCard {...successProps} />
      )}
    </AnimatePresence>
  );
};

const viewVariants: Variants = {
  initial: { opacity: 0, y: 10, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.22 } },
  exit: { opacity: 0, y: -8, filter: "blur(2px)", transition: { duration: 0.16 } },
};

export function Banner({ banner }: { banner: BannerType }) {

  if (!banner) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={viewVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={
          [
            "mb-4 rounded-2xl border px-3 py-2 text-xs font-semibold",
            banner.type === "success" &&
            "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100",
            banner.type === "error" &&
            "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100",
            banner.type === "info" &&
            "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-100",
          ]
            .filter(Boolean)
            .join(" ")
        }
        role="status"
        aria-live="polite"
      >
        {banner.message}
      </motion.div>
    </AnimatePresence>
  );
}

interface EditCategoryMainContentProps {
  banner: EditCategoryBannerProps;
  view: string;
  pageLoading: boolean;
  formProps: EditCategorySwitcherProps['formProps'];
  previewProps: EditCategorySwitcherProps['previewProps'];
  successProps: EditCategorySwitcherProps['successProps'];
}

const EditCategoryMainContent: React.FC<EditCategoryMainContentProps> = ({
  banner,
  view,
  pageLoading,
  formProps,
  previewProps,
  successProps,
}) => (
  <>
    <Banner banner={banner} />

    <CategoryViewSwitcher
      view={view}
      pageLoading={pageLoading}
      formProps={formProps}
      previewProps={previewProps}
      successProps={successProps}
    />
  </>
);

interface EditCategoryTitleProps {
  selectionSummary: string;
}

const EditCategoryTitle: React.FC<EditCategoryTitleProps> = ({ selectionSummary }) => (
  <div className="mb-4 flex items-center gap-2">
    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] text-white shadow-sm">
      <Tags className="h-6 w-6" />
    </div>

    <div className="min-w-0">
      <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
        Modifier la catégorie
      </h1>
      <p className="text-[11px] text-slate-600 dark:text-[#AFC0DE]">
        {selectionSummary}
      </p>
    </div>
  </div>
);

interface EditCategoryHeaderProps {
  view: string;
  onBack: () => void;
}

const EditCategoryHeader: React.FC<EditCategoryHeaderProps> = ({ view, onBack }) => (
  <div className="mb-5 flex items-center justify-between gap-3">
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
      aria-label="Retour à la liste"
    >
      <ArrowLeft className="h-4 w-4" /> Retour
    </button>

    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
      <Layers className="h-4 w-4 text-[#2E5AA6] dark:text-[#9BC2FF]" />
      Vue :{" "}
      <span className="font-extrabold">
        {view === "edit" ? "Édition" : view === "preview" ? "Aperçu" : "Succès"}
      </span>
    </div>
  </div>
);

export default function EditCategoryPageClient() {
  const router = useRouter();
  const {
    rubriques, rubriquesLoading, description, pageLoading, view, selectedRubriques,
    banner, nom, selectionSummary, rubriqueIds, selectedSet, busy, goPreview,
    setNom, setDescription, toggleRubrique, goEdit, clearSelection, handleEdit,
  } = useEditCategoryPage();

  return (
    <div className="w-full mx-auto  px-3 py-6 sm:px-4 sm:py-10 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">

      <EditCategoryHeader
        view={view}
        onBack={() => {
          router.replace('/admin/categories');
          router.refresh();
        }}
      />
      <EditCategoryTitle selectionSummary={selectionSummary} />

      <EditCategoryMainContent
        banner={banner}
        view={view}
        pageLoading={pageLoading}
        formProps={{
          nom,
          setNom,
          description,
          setDescription,
          rubriques: rubriques ?? [],
          rubriqueIds,
          selectedSet,
          rubriquesLoading,
          toggleRubrique,
          clearSelection,
          goPreview,
          selectionSummary,
        }}
        previewProps={{
          nom,
          description,
          selectedRubriques,
          busy,
          onBack: goEdit,
          onConfirm: handleEdit,
        }}
        successProps={{
          nom,
          onGoList: () => {
            router.replace('/admin/categories');
            router.refresh();
          },
          onEditAnother: goEdit,
          reducedMotion: false,
        }}
      />
    </div>
  );
}