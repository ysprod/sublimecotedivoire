'use client';
import { memo } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import Bandeau from '@/components/commons/Bandeau';
import CacheLink from '@/components/commons/CacheLink';

const IMAGE_CONFIG = {
  src: '/carteorange.png',
  alt: 'Carte touristique de la Côte d’Ivoire',
  width: 300,
  height: 300,
  className:
    'relative h-auto w-[220px] drop-shadow-2xl sm:w-[260px] md:w-[300px]',
  sizes: '(max-width: 640px) 220px, (max-width: 768px) 260px, 300px',
} as const;

const BUTTON_TEXT = 'Cliquez pour consulter les données.';
const NAVIGATION_TARGET = '/vert';
const ICON_CLASSES = 'h-5 w-5';

const BUTTON_STYLES = [
  'group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden',
  'rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500',
  'bg-[length:200%_100%] px-5 py-4 text-center text-sm font-bold text-white',
  'shadow-[0_14px_40px_rgba(249,115,22,0.28)] transition-colors duration-200',
  'hover:shadow-[0_18px_50px_rgba(249,115,22,0.35)]',
  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
  'sm:w-auto sm:px-8 sm:text-base md:px-10 md:py-4 md:text-lg',
].join(' ');

interface ActionLinkProps {
  href?: string;
  text?: string;
  icon?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

interface MapImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  href?: string;
  priority?: boolean;
}

const MapImageContent = memo(function MapImageContent({
  src = IMAGE_CONFIG.src,
  alt = IMAGE_CONFIG.alt,
  width = IMAGE_CONFIG.width,
  height = IMAGE_CONFIG.height,
  sizes = IMAGE_CONFIG.sizes,
  className = IMAGE_CONFIG.className,
  priority = true,
}: Omit<MapImageProps, 'href'>) {
  return (
    <div className="mt-4 flex w-full justify-center sm:mt-10">
      <div className="relative flex justify-center">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={className}
          sizes={sizes}
        />
      </div>
    </div>
  );
});

const MapImage = memo(function MapImage({
  href = NAVIGATION_TARGET,
  ...imageProps
}: MapImageProps) {
  return (
    <CacheLink
      href={href}
      className="flex w-full items-center justify-center"
      aria-label={`Consulter les données du tourisme via ${imageProps.alt || 'la carte'}`}
    >
      <MapImageContent {...imageProps} />
    </CacheLink>
  );
});

const ActionLink = memo(function ActionLink({
  href = NAVIGATION_TARGET,
  text = BUTTON_TEXT,
  icon = <ZoomIn className={ICON_CLASSES} aria-hidden="true" />,
  className = BUTTON_STYLES,
  ariaLabel = 'Consulter les données du tourisme',
}: ActionLinkProps) {
  return (
    <div className="mb-16 mt-8 flex w-full justify-center sm:mt-10">
      <CacheLink
        href={href}
        className={className}
        aria-label={ariaLabel}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {text}
          {icon}
        </span>
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
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
    <div className="mx-auto w-full max-w-5xl px-4">
      <Bandeau />
      <ContentSection />
    </div>
  );
});

export default TourismDashboard;