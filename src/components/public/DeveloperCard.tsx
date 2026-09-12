import React from 'react';
import { motion } from 'motion/react';
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
  return (
    <motion.article
      id={`dev-card-${developer.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top subtle blue highlight line on hover */}
      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/40 transition-all duration-500" />

      {/* Main card content */}
      <div className="flex flex-col items-center text-center">
        {/* Photo Container with Blue Glow */}
        <div className="relative mb-5">
          {/* Blue visual effect / gradient glow behind photo */}
          <div
            className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-blue-600/35 via-blue-400/25 to-indigo-500/30 blur-md opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            aria-hidden="true"
          />

          {/* Circular Frame */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1 bg-white shadow-md ring-2 ring-blue-100/90 overflow-hidden">
            <img
              src={developer.image_url || '/uploads/default-avatar.svg'}
              alt={developer.name}
              className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                // Fallback to default avatar if image fails to load
                (e.target as HTMLImageElement).src = '/uploads/default-avatar.svg';
              }}
            />
          </div>

          {/* Tech icon badge floating on bottom corner */}
          <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md ring-2 ring-white">
            {index % 2 === 0 ? (
              <Terminal className="w-4 h-4" />
            ) : (
              <Code className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Developer Name */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 tracking-tight">
          {developer.name}
        </h2>

        {/* Role / Job Title */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50/90 border border-blue-100">
            {developer.role}
          </span>
        </div>

        {/* Short Bio */}
        {developer.bio && (
          <p className="text-slate-600 text-sm leading-relaxed mb-5 max-w-md">
            {developer.bio}
          </p>
        )}

        {/* Social and Contact Links */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-6">
          {developer.github_url && (
            <a
              href={developer.github_url}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 flex items-center justify-center transition-colors"
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
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 flex items-center justify-center transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
          )}

          {developer.email && (
            <a
              href={`mailto:${developer.email}`}
              title="البريد الإلكتروني"
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 flex items-center justify-center transition-colors"
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
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 flex items-center justify-center transition-colors"
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
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 flex items-center justify-center transition-colors"
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
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 flex items-center justify-center transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span className="sr-only">Instagram</span>
            </a>
          )}
        </div>
      </div>

      {/* Short Personal Quote at bottom */}
      {developer.quote && (
        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-100/70 text-right flex items-start gap-2.5">
            <Quote className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 rotate-180" />
            <p className="text-xs sm:text-[13px] text-blue-900/85 font-medium leading-relaxed italic">
              "{developer.quote}"
            </p>
          </div>
        </div>
      )}
    </motion.article>
  );
};
