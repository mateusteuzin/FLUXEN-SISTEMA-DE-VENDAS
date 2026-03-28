import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div role="img" aria-label="Logo FLUXEN" className={cn('flex items-center justify-center', className)}>
      <img
        src="/fluxen.png"
        alt="FLUXEN"
        className="h-full w-full scale-[1.50] object-contain object-center drop-shadow-[0_12px_32px_rgba(15,23,42,0.22)]"
      />
    </div>
  );
}
