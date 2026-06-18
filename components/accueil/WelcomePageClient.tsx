'use client';
import { ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';
import Bandeau from '../commons/Bandeau';
import CacheLink from '../commons/CacheLink';

const IMAGE_CONFIG = {
  src: '/carteorange.png',
  alt: 'Carte touristique de la Côte d’Ivoire',
  width: 300,
  height: 300,
  className: 'relative h-auto w-[220px] drop-shadow-2xl sm:w-[260px] md:w-[300px]',
  sizes: '(max-width: 640px) 220px, (max-width: 768px) 260px, 300px',
} as const;

const BUTTON_TEXT = 'Cliquez pour consulter les données';

const MapImage = memo(function MapImage() {
  return (
    <CacheLink href="/vert" className="items-center justify-center"
      aria-label="Consulter les données du tourisme"
    >
      <div className="mt-8 flex w-full justify-center sm:mt-10">
        <div className="relative flex justify-center">
          <Image
            src={IMAGE_CONFIG.src}
            alt={IMAGE_CONFIG.alt}
            width={IMAGE_CONFIG.width}
            height={IMAGE_CONFIG.height}
            priority
            className={IMAGE_CONFIG.className}
            sizes={IMAGE_CONFIG.sizes}
          />
        </div>
      </div>
    </CacheLink>
  );
});

const ActionLink = memo(function ActionLink() {
  return (
    <div className="mb-16 mt-8 flex w-full justify-center sm:mt-10">
      <CacheLink
        href="/vert"
        className="
          group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden
          rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500
          bg-[length:200%_100%] px-5 py-4 text-center text-sm font-bold text-white
          shadow-[0_14px_40px_rgba(249,115,22,0.28)] transition-all duration-300
          hover:shadow-[0_18px_50px_rgba(249,115,22,0.35)]
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
          sm:w-auto sm:px-8 sm:text-base md:px-10 md:py-4 md:text-lg
        "
        aria-label="Consulter les données du tourisme"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {BUTTON_TEXT}
          <ZoomIn className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
        </span>
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
      </CacheLink>
    </div>
  );
});

const ContentSection = memo(function ContentSection() {
  return (
    <section className="flex w-full flex-col items-center justify-center">
      <MapImage />
      <ActionLink />
    </section>
  );
});

const TourismDashboard = memo(function TourismDashboard() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 text-center">
      <Bandeau />
      <ContentSection />
    </main>
  );
});

export default TourismDashboard;