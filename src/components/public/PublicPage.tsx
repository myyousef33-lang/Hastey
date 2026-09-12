import React from 'react';
import type { Developer, SiteSettings } from '../../types';
import { Hero } from './Hero';
import { DeveloperCard } from './DeveloperCard';
import { Footer } from './Footer';
import { ShieldCheck, Settings, Users, ArrowRight } from 'lucide-react';

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
  onOpenAdmin,
  onRefresh
}) => {
  // Filter visible developers for public view
  const visibleDevelopers = developers.filter((dev) => dev.is_visible);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      {/* Discreet Admin Floating Toolbar when logged in */}
      {isAdminLoggedIn && (
        <aside 
          aria-label="شريط أدوات الإدارة"
          className="sticky top-0 z-50 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2.5 text-xs flex items-center justify-between shadow-md border-b border-slate-800"
        >
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">وضع المعاينة الحية للموقع (أنت مسجل كمسؤول)</span>
          </div>
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition font-medium text-xs shadow-xs"
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
        <section aria-labelledby="developers-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 id="developers-heading" className="sr-only">قائمة أعضاء فريق التطوير</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-8 animate-pulse flex flex-col items-center text-center"
                >
                  <div className="w-32 h-32 rounded-full bg-slate-200 mb-4" />
                  <div className="h-6 w-36 bg-slate-200 rounded-md mb-2" />
                  <div className="h-4 w-24 bg-slate-200 rounded-md mb-4" />
                  <div className="h-3 w-48 bg-slate-200 rounded-md mb-2" />
                  <div className="h-3 w-40 bg-slate-200 rounded-md mb-6" />
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleDevelopers.length === 0 ? (
            <div className="text-center py-16 px-4 bg-blue-50/40 rounded-2xl border border-blue-100 max-w-lg mx-auto">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">
                لا يوجد مطورون معروضون حالياً
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                يمكن إضافة مطورين وتفعيل ظهورهم من خلال لوحة التحكم.
              </p>
              {isAdminLoggedIn ? (
                <button
                  onClick={onOpenAdmin}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                >
                  إضافة أول مطور الآن
                </button>
              ) : (
                <button
                  onClick={onOpenAdmin}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                >
                  دخول المسؤول
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
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
