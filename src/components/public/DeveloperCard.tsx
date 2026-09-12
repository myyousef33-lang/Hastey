import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Developer } from '../../types';
import {
  Github,
  Linkedin,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Quote,
  Terminal,
  Code
} from 'lucide-react';

interface DeveloperCardProps {
  developer: Developer;
  index: number;
}

export const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer, index }) => {
  const shouldReduceMotion = useReducedMotion();

  // Smooth custom easing for natural, professional feel
  const smoothEasing = [0.22, 1, 0.36, 1];

  // Staggered timing for sequential child elements
  const cardDelay = index * 0.22;
  const photoDelay = cardDelay + 0.1;
  const nameDelay = cardDelay + 0.2;
  const roleDelay = cardDelay + 0.28;
  const bioDelay = cardDelay + 0.35;
  const socialDelay = cardDelay + 0.42;
  const quoteDelay = cardDelay + 0.5;

  return (
    <motion.article
      id={`dev-card-${developer.id}`}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.65, delay: cardDelay, ease: smoothEasing }}
      whileHover={shouldReduceMotion ? {} : { y: -6 }}
      className="group relative bg-white rounded-3xl p-6 sm:p-8 md:p-9 border border-slate-200/90 shadow-sm hover:shadow-xl hover:shadow-blue-900/8 hover:border-blue-300 transition-all duration-300 ease-out flex flex-col justify-between"
    >
      {/* Top subtle highlight gradient bar on card hover */}
      <div
        className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/50 transition-all duration-500 rounded-full"
        aria-hidden="true"
      />

      {/* Main card content */}
      <div className="flex flex-col items-center text-center">
        {/* 1. Developer Photo Hero with Enlarged Circle and Multi-layered Glow */}
        <div className="relative mb-6 pt-2">
          {/* Blue Decorative Geometric Ornament Behind the Photo */}
          <div
            className="absolute -inset-2.5 sm:-inset-3 rounded-3xl bg-gradient-to-tr from-blue-600/15 via-blue-400/10 to-indigo-500/15 border border-blue-200/50 rotate-3 group-hover:rotate-6 group-hover:scale-105 transition-transform duration-500 ease-out -z-10"
            aria-hidden="true"
          />

          {/* Soft Blue Radial Glow */}
          <div
            className="absolute -inset-3 sm:-inset-4 rounded-full bg-gradient-to-tr from-blue-600/25 via-blue-400/20 to-sky-400/20 blur-xl opacity-75 group-hover:opacity-100 group-hover:scale-108 transition-all duration-500 -z-10"
            aria-hidden="true"
          />

          {/* Enlarged Circular Photo Container:
              Mobile: w-38 h-38 (152px) to w-40 h-40 (160px)
              Desktop: w-46 h-46 (184px) to w-48 h-48 (192px)
          */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: photoDelay, ease: smoothEasing }}
            className="relative w-38 h-38 sm:w-44 sm:h-44 md:w-46 md:h-46 lg:w-48 lg:h-48 rounded-full p-1.5 bg-white shadow-md ring-4 ring-blue-50 border-2 border-blue-100/90 overflow-hidden"
          >
            <img
              src={developer.image_url || '/uploads/default-avatar.svg'}
              alt={developer.name}
              className="w-full h-full rounded-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/uploads/default-avatar.svg';
              }}
            />
          </motion.div>

          {/* Tech icon badge floating on bottom corner with subtle bounce */}
          <div
            className="absolute bottom-1 right-2 sm:bottom-2 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md ring-2 ring-white group-hover:scale-105 transition-transform duration-300"
            aria-hidden="true"
          >
            {index % 2 === 0 ? (
              <Terminal className="w-4 h-4" />
            ) : (
              <Code className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* 2. Developer Name (Staggered reveal) */}
        <motion.h2
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: nameDelay, ease: smoothEasing }}
          className="text-xl sm:text-2xl md:text-[26px] font-bold text-slate-900 mb-2 tracking-tight"
        >
          {developer.name}
        </motion.h2>

        {/* 3. Role / Job Title (Staggered reveal) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: roleDelay, ease: smoothEasing }}
          className="mb-4"
        >
          <span className="inline-block px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50/90 border border-blue-100 shadow-2xs">
            {developer.role}
          </span>
        </motion.div>

        {/* 4. Short Bio (Staggered reveal) */}
        {developer.bio && (
          <motion.p
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: bioDelay, ease: smoothEasing }}
            className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-md"
          >
            {developer.bio}
          </motion.p>
        )}

        {/* 5. Social and Contact Links (Staggered reveal + Smooth hover scale & color transition) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: socialDelay, ease: smoothEasing }}
          className="flex items-center justify-center flex-wrap gap-2.5 mb-6"
        >
          {developer.github_url && (
            <a
              href={developer.github_url}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-200 ease-out hover:scale-110 shadow-2xs"
            >
              <Github className="w-4 h-4" />
              <span className="sr-only">GitHub</span>
            </a>
          )}

          {developer.linkedin_url && (
            <a
              href={developer.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-200 ease-out hover:scale-110 shadow-2xs"
            >
              <Linkedin className="w-4 h-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
          )}

          {developer.email && (
            <a
              href={`mailto:${developer.email}`}
              title="البريد الإلكتروني"
              className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-200 ease-out hover:scale-110 shadow-2xs"
            >
              <Mail className="w-4 h-4" />
              <span className="sr-only">البريد الإلكتروني</span>
            </a>
          )}

          {developer.website_url && (
            <a
              href={developer.website_url}
              target="_blank"
              rel="noopener noreferrer"
              title="الموقع الشخصي"
              className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-200 ease-out hover:scale-110 shadow-2xs"
            >
              <Globe className="w-4 h-4" />
              <span className="sr-only">الموقع الشخصي</span>
            </a>
          )}

          {developer.facebook_url && (
            <a
              href={developer.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-200 ease-out hover:scale-110 shadow-2xs"
            >
              <Facebook className="w-4 h-4" />
              <span className="sr-only">Facebook</span>
            </a>
          )}

          {developer.instagram_url && (
            <a
              href={developer.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-200 ease-out hover:scale-110 shadow-2xs"
            >
              <Instagram className="w-4 h-4" />
              <span className="sr-only">Instagram</span>
            </a>
          )}
        </motion.div>
      </div>

      {/* 6. Short Personal Quote at bottom (Staggered reveal) */}
      {developer.quote && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: quoteDelay, ease: smoothEasing }}
          className="mt-auto pt-4 border-t border-slate-100"
        >
          <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100/80 text-right flex items-start gap-3 transition-colors group-hover:bg-blue-50/90">
            <Quote className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 rotate-180" />
            <p className="text-xs sm:text-[13px] text-blue-950 font-medium leading-relaxed italic">
              "{developer.quote}"
            </p>
          </div>
        </motion.div>
      )}
    </motion.article>
  );
};
