import React from 'react';
import { motion } from 'motion/react';
import type { SiteSettings } from '../../types';
import { Code2, Sparkles } from 'lucide-react';

interface HeroProps {
  settings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  return (
    <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden text-center">
      {/* Soft ambient background ornaments in blue & light blue */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10"
        aria-hidden="true"
      >
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[520px] h-[320px] bg-gradient-to-b from-blue-100/70 via-blue-50/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-16 -left-20 w-72 h-72 bg-blue-100/40 rounded-full blur-2xl" />
        <div className="absolute top-16 -right-20 w-72 h-72 bg-indigo-100/30 rounded-full blur-2xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hassty Official Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center mb-6"
        >
          <div className="relative group">
            {/* Soft blue glow behind the logo */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-2xl blur-lg transition duration-500 group-hover:scale-105" />
            <img
              src={settings.logo_url || '/hassty-logo.svg'}
              alt={settings.site_name || 'منصة حِصّتي'}
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-sm object-contain ring-1 ring-blue-100 bg-white"
              loading="eager"
            />
          </div>

          {settings.hero_badge && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mt-5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-xs"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{settings.hero_badge}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Big Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
        >
          {settings.page_title || 'فريق تطوير منصة حِصّتي'}
        </motion.h1>

        {/* Professional Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          {settings.page_subtitle ||
            'نحن الفريق المسؤول عن بناء وتطوير منصة حِصّتي، ونعمل باستمرار على تقديم تجربة تعليمية رقمية أكثر سهولة واحترافية.'}
        </motion.p>
      </div>
    </section>
  );
};
