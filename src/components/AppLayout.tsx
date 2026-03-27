import type { ReactNode } from 'react';
import AppSidebar from '@/components/AppSidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <AppSidebar />

      <div className="md:pl-[250px]">
        <main className="min-h-screen px-4 pb-6 pt-4 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
