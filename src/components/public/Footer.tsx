import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { SiteSettings } from '../../types';
import { Mail, Phone, Lock, Sparkles } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin, isAdminLoggedIn }) => {
  const shouldReduceMotion = useReducedMotion();
  const smoothEasing = [0.22, 1, 0.36, 1];

  return (
    <motion.footer
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease: smoothEasing }}
      className="mt-20 border-t border-slate-200/80 bg-slate-50/60 py-14 text-center relative z-10 overflow-hidden"
    >
      {/* Ambient background decoration */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-36 pointer-events-none -z-10"
        aria-hidden="true"
      >
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[480px] h-[160px] bg-blue-100/40 rounded-full blur-3xl animate-subtle-glow" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Hassty Logo in Footer with scale-in */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: smoothEasing }}
          className="flex justify-center mb-4"
        >
          <div className="w-11 h-11 rounded-2xl bg-white p-1.5 ring-1 ring-blue-100 shadow-2xs flex items-center justify-center">
            <img
              src={settings.logo_url || '/hassty-logo.svg'}
              alt={settings.site_name || 'منصة حِصّتي'}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Passion Statement */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: smoothEasing }}
          className="text-sm sm:text-base font-bold text-slate-800 mb-2 flex items-center justify-center gap-1.5"
        >
          <span>{settings.footer_text || 'صُنعت بشغف لتطوير تجربة التعليم'}</span>
          <Sparkles className="w-4 h-4 text-blue-500 inline" />
        </motion.p>

        {/* Copyright Notice */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: smoothEasing }}
          className="text-xs text-slate-500 mb-4"
        >
          {settings.copyright_text || 'جميع الحقوق محفوظة © منصة حِصّتي'}
        </motion.p>

        {/* Contact Links if provided */}
        {(settings.contact_email || settings.contact_phone) && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.38, ease: smoothEasing }}
            className="flex items-center justify-center flex-wrap gap-4 text-xs text-slate-600 mb-6"
          >
            {settings.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors px-2.5 py-1 rounded-lg hover:bg-white"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>{settings.contact_email}</span>
              </a>
            )}
            {settings.contact_phone && (
              <a
                href={`tel:${settings.contact_phone}`}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors px-2.5 py-1 rounded-lg hover:bg-white"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span dir="ltr">{settings.contact_phone}</span>
              </a>
            )}
          </motion.div>
        )}

        {/* Subtle Admin Access link for the website owner */}
        <div className="pt-3 border-t border-slate-200/50 inline-block">
          <button
            onClick={onOpenAdmin}
            id="footer-admin-btn"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition-colors px-3 py-1 rounded-lg hover:bg-white/80"
            title="الدخول إلى لوحة إدارة المحتوى"
          >
            <Lock className="w-3 h-3" />
            <span>{isAdminLoggedIn ? 'لوحة التحكم (نشطة)' : 'إدارة المحتوى'}</span>
          </button>
        </div>
      </div>
    </motion.footer>
  );
};
