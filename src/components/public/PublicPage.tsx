import React from 'react';
import type { Developer, SiteSettings } from '../../types';
import { Hero } from './Hero';
import { DeveloperCard } from './DeveloperCard';
import { JourneyTimeline } from './JourneyTimeline';
import { HasstyMotionStory } from './motion-story/HasstyMotionStory';
import { Footer } from './Footer';
import { Settings, Users, ArrowRight, ShieldCheck } from 'lucide-react';

interface PublicPageProps {
  developers: Developer[];
  settings: SiteSettings;
  isLoading: boolean;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onRefresh: () => void;
}

export const PublicPage: React.FC<PublicPageProps> = ({
  developers,
  settings,
  isLoading,
  isAdminLoggedIn,
  onOpenAdmin
}) => {
  // Filter visible developers for public view
  const visibleDevelopers = developers.filter((dev) => dev.is_visible);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden">
      {/* Ambient background subtle decorative elements (Very subtle, GPU-accelerated) */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden -z-20"
        aria-hidden="true"
      >
        {/* Subtle Tech Dot Grid Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.035]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="bg-grid-dots" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#2563EB" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-grid-dots)" />
        </svg>

        {/* Top-right soft blue blob */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-100/35 blur-3xl animate-ambient-float" />

        {/* Mid-left floating subtle circle */}
        <div className="absolute top-1/3 -left-40 w-[420px] h-[420px] rounded-full bg-sky-50/40 blur-3xl animate-ambient-float-alt" />

        {/* Floating delicate thin blue geometric ring */}
        <div className="absolute top-1/4 right-[12%] w-60 h-60 rounded-full border border-blue-200/30 animate-ambient-float opacity-40 pointer-events-none" />

        {/* Floating small delicate transparent circle */}
        <div className="absolute top-2/3 left-[15%] w-36 h-36 rounded-full border border-blue-300/25 animate-ambient-float-alt opacity-50 pointer-events-none" />

        {/* Bottom-right soft indigo accent */}
        <div className="absolute bottom-20 -right-24 w-80 h-80 rounded-full bg-blue-50/50 blur-3xl animate-ambient-float" />
      </div>

      {/* Discreet Admin Floating Toolbar when logged in */}
      {isAdminLoggedIn && (
        <aside
          aria-label="شريط أدوات الإدارة"
          className="sticky top-0 z-50 bg-slate-900/95 text-white backdrop-blur-md px-4 py-2.5 text-xs flex items-center justify-between shadow-md border-b border-slate-800"
        >
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">وضع المعاينة الحية للموقع (مسجل كمسؤول)</span>
          </div>
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition font-medium text-xs shadow-xs"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>العودة إلى لوحة التحكم</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero settings={settings} />

        {/* Developers Section */}
        <section
          aria-labelledby="developers-heading"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <h2 id="developers-heading" className="sr-only">
            قائمة أعضاء فريق التطوير
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 animate-pulse flex flex-col items-center text-center shadow-xs"
                >
                  <div className="w-44 h-44 rounded-full bg-slate-100 mb-6 ring-4 ring-slate-50" />
                  <div className="h-6 w-44 bg-slate-100 rounded-lg mb-3" />
                  <div className="h-4 w-32 bg-slate-100 rounded-full mb-5" />
                  <div className="h-3 w-56 bg-slate-100 rounded-md mb-2" />
                  <div className="h-3 w-48 bg-slate-100 rounded-md mb-6" />
                  <div className="flex gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-slate-100" />
                    <div className="w-10 h-10 rounded-full bg-slate-100" />
                    <div className="w-10 h-10 rounded-full bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleDevelopers.length === 0 ? (
            <div className="text-center py-16 px-6 bg-blue-50/50 rounded-3xl border border-blue-100/80 max-w-lg mx-auto shadow-2xs">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">
                لا يوجد مطورون معروضون حالياً
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-5">
                يمكنك إضافة المطورين وتفعيل ظهورهم بكل سهولة عبر لوحة التحكم.
              </p>
              {isAdminLoggedIn ? (
                <button
                  onClick={onOpenAdmin}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  إضافة أول مطور الآن
                </button>
              ) : (
                <button
                  onClick={onOpenAdmin}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  دخول المسؤول
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-stretch">
              {visibleDevelopers.map((developer, index) => (
                <DeveloperCard
                  key={developer.id}
                  developer={developer}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* The Journey Timeline Section */}
        <JourneyTimeline />

        {/* The Motion Graphics Story Scene: من الفكرة إلى حِصّتي */}
        <HasstyMotionStory settings={settings} />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={onOpenAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
      />
    </div>
  );
};
