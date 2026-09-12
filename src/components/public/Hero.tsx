import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { SiteSettings } from '../../types';
import { Code2, Sparkles } from 'lucide-react';

interface HeroProps {
  settings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  const shouldReduceMotion = useReducedMotion();

  // Gentle, professional transition settings
  const smoothEasing = [0.22, 1, 0.36, 1];

  return (
    <section className="relative pt-16 pb-10 md:pt-24 md:pb-14 overflow-hidden text-center">
      {/* Subtle ambient decorative shapes */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10"
        aria-hidden="true"
      >
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[620px] h-[380px] bg-gradient-to-b from-blue-100/60 via-blue-50/30 to-transparent rounded-full blur-3xl animate-subtle-glow" />

        {/* Floating Subtle Circle 1 */}
        <div className="absolute top-20 -left-12 w-64 h-64 rounded-full bg-blue-100/35 blur-2xl animate-ambient-float" />

        {/* Floating Subtle Circle 2 */}
        <div className="absolute top-24 -right-12 w-72 h-72 rounded-full bg-indigo-50/40 blur-2xl animate-ambient-float-alt" />

        {/* Subtle Decorative Geometric Lines/Dots Pattern */}
        <svg
          className="absolute top-12 left-1/2 -translate-x-1/2 opacity-25 w-full max-w-4xl h-48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#3B82F6" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. Official Hassty Logo with Fade + Scale (0.85 -> 1) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: smoothEasing }}
          className="flex flex-col items-center justify-center mb-5"
        >
          <div className="relative group cursor-default">
            {/* Soft breathing blue glow behind the logo */}
            <div
              className="absolute -inset-2.5 bg-gradient-to-r from-blue-600/25 via-blue-400/25 to-indigo-500/25 rounded-3xl blur-xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
              aria-hidden="true"
            />

            <div className="relative w-22 h-22 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-2xl shadow-sm ring-1 ring-blue-200/80 bg-white p-2.5 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]">
              <img
                src={settings.logo_url || '/hassty-logo.svg'}
                alt={settings.site_name || 'منصة حِصّتي'}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </div>

          {/* Badge */}
          {settings.hero_badge && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: smoothEasing }}
              className="mt-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{settings.hero_badge}</span>
            </motion.div>
          )}
        </motion.div>

        {/* 2. Main Title reveals smoothly */}
        <motion.h1
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: smoothEasing }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
        >
          {settings.page_title || 'فريق تطوير منصة حِصّتي'}
        </motion.h1>

        {/* 3. Description appears below title with subtle slide-up from below */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: smoothEasing }}
          className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          {settings.page_subtitle ||
            'نحن الفريق المسؤول عن بناء وتطوير منصة حِصّتي، ونعمل باستمرار على تقديم تجربة تعليمية رقمية أكثر سهولة واحترافية.'}
        </motion.p>
      </div>
    </section>
  );
};
