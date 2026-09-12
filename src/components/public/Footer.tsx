import React from 'react';
import type { SiteSettings } from '../../types';
import { Mail, Phone, Lock, Heart } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin, isAdminLoggedIn }) => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-slate-50/50 py-12 text-center relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hassty Logo in Footer */}
        <div className="flex justify-center mb-4">
          <img
            src={settings.logo_url || '/hassty-logo.svg'}
            alt={settings.site_name || 'منصة حِصّتي'}
            className="w-10 h-10 rounded-xl object-contain ring-1 ring-slate-200/60 bg-white p-1"
            loading="lazy"
          />
        </div>

        {/* Passion Statement */}
        <p className="text-sm md:text-base font-semibold text-slate-800 mb-2 flex items-center justify-center gap-1.5">
          <span>{settings.footer_text || 'صُنعت بشغف لتطوير تجربة التعليم'}</span>
          <Heart className="w-3.5 h-3.5 text-blue-500 fill-blue-500 inline" />
        </p>

        {/* Copyright Notice */}
        <p className="text-xs text-slate-500 mb-4">
          {settings.copyright_text || 'جميع الحقوق محفوظة © منصة حِصّتي'}
        </p>

        {/* Contact Links if provided */}
        {(settings.contact_email || settings.contact_phone) && (
          <div className="flex items-center justify-center flex-wrap gap-4 text-xs text-slate-600 mb-6">
            {settings.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{settings.contact_email}</span>
              </a>
            )}
            {settings.contact_phone && (
              <a
                href={`tel:${settings.contact_phone}`}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span dir="ltr">{settings.contact_phone}</span>
              </a>
            )}
          </div>
        )}

        {/* Subtle Admin Access link for the website owner */}
        <div className="pt-4 border-t border-slate-200/40 inline-block">
          <button
            onClick={onOpenAdmin}
            id="footer-admin-btn"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition-colors px-2.5 py-1 rounded-md hover:bg-slate-100/60"
            title="الدخول إلى لوحة إدارة المحتوى"
          >
            <Lock className="w-3 h-3" />
            <span>{isAdminLoggedIn ? 'لوحة التحكم (نشطة)' : 'إدارة المحتوى'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
