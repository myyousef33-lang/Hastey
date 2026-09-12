import React, { useState, useRef } from 'react';
import type { SiteSettings } from '../../types';
import { uploadImage } from '../../lib/api';
import {
  Save,
  RotateCcw,
  Upload,
  Globe,
  FileText,
  Search,
  Check,
  AlertCircle,
  Shield,
  Layers
} from 'lucide-react';

interface SiteSettingsManagerProps {
  settings: SiteSettings;
  onSave: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

export const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({
  settings,
  onSave
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    setError(null);
    try {
      const res = await uploadImage(file);
      handleChange('logo_url', res.url);
    } catch (err: any) {
      setError(err.message || 'فشل رفع الشعار');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFavicon(true);
    setError(null);
    try {
      const res = await uploadImage(file);
      handleChange('favicon_url', res.url);
    } catch (err: any) {
      setError(err.message || 'فشل رفع الأيقونة');
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  const resetToOfficialLogo = () => {
    handleChange('logo_url', '/hassty-logo.svg');
    handleChange('favicon_url', '/hassty-logo.svg');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await onSave(formData);
      setSuccessMessage('تم حفظ وتحديث إعدادات وهوية الموقع بنجاح!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'فشل حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">إعدادات وهوية الموقع</h2>
          <p className="text-xs text-slate-500">
            تعديل جميع نصوص الـ Hero، الشعار، الفوتر، وبيانات الـ SEO والاتصال.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          {isSaving ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>حفظ جميع التعديلات</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2.5 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Brand & Logo Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">شعار المنصة والأيقونة</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Official Logo */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                شعار حِصّتي الرسمي (SVG)
              </span>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-2xl bg-white ring-1 ring-blue-200 p-1 flex items-center justify-center shadow-xs">
                  <img
                    src={formData.logo_url || '/hassty-logo.svg'}
                    alt="شعار حِصّتي"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs text-slate-500">
                  <p className="font-mono text-[11px] text-slate-600 mb-1">
                    {formData.logo_url}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    الشعار الأصلي للمنصة المعتمد من الموقع الرسمي
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/svg+xml,image/png,image/webp,image/jpeg"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploadingLogo}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition"
              >
                {isUploadingLogo ? 'جارٍ الرفع...' : 'استبدال الشعار'}
              </button>
              <button
                type="button"
                onClick={resetToOfficialLogo}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition inline-flex items-center gap-1"
                title="استعادة شعار حِصّتي الأصلي"
              >
                <RotateCcw className="w-3 h-3" />
                <span>استعادة الشعار الرسمي</span>
              </button>
            </div>
          </div>

          {/* Favicon */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                أيقونة التبويب (Favicon)
              </span>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white ring-1 ring-slate-200 p-1 flex items-center justify-center shadow-xs">
                  <img
                    src={formData.favicon_url || '/hassty-logo.svg'}
                    alt="Favicon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs text-slate-500">
                  <p className="font-mono text-[11px] text-slate-600 mb-1">
                    {formData.favicon_url}
                  </p>
                  <p className="text-[11px] text-slate-400">تظهر في لسان المتصفح والإشارات المرجعية</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
              <input
                type="file"
                ref={faviconInputRef}
                onChange={handleFaviconUpload}
                accept="image/svg+xml,image/png,image/x-icon"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => faviconInputRef.current?.click()}
                disabled={isUploadingFavicon}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition"
              >
                {isUploadingFavicon ? 'جارٍ الرفع...' : 'استبدال الأيقونة'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Texts */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Layers className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">نصوص قسم الـ Hero الرئيسي</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              اسم الموقع العام
            </label>
            <input
              type="text"
              value={formData.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              شارة الـ Hero (Badge)
            </label>
            <input
              type="text"
              value={formData.hero_badge}
              onChange={(e) => handleChange('hero_badge', e.target.value)}
              placeholder="فريق العمل والابتكار التقني"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            العنوان الرئيسي الكبير للصفحة (H1)
          </label>
          <input
            type="text"
            value={formData.page_title}
            onChange={(e) => handleChange('page_title', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            الوصف التعريفي للـ Hero
          </label>
          <textarea
            value={formData.page_subtitle}
            onChange={(e) => handleChange('page_subtitle', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white leading-relaxed"
          />
        </div>
      </div>

      {/* Footer & Contact Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileText className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">نصوص الفوتر وبيانات التواصل</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              عبارة الفوتر الرئيسية
            </label>
            <input
              type="text"
              value={formData.footer_text}
              onChange={(e) => handleChange('footer_text', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              نص حقوق الملكية
            </label>
            <input
              type="text"
              value={formData.copyright_text}
              onChange={(e) => handleChange('copyright_text', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              بريد الدعم والتواصل
            </label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              رقم هاتف الدعم (واتساب)
            </label>
            <input
              type="text"
              dir="ltr"
              value={formData.contact_phone}
              onChange={(e) => handleChange('contact_phone', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* SEO & Meta Tags */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Search className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">إعدادات محركات البحث والـ SEO</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            وصف الـ SEO (Meta Description)
          </label>
          <textarea
            value={formData.meta_description}
            onChange={(e) => handleChange('meta_description', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              الكلمات المفتاحية (Meta Keywords)
            </label>
            <input
              type="text"
              value={formData.meta_keywords}
              onChange={(e) => handleChange('meta_keywords', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              الرابط الأساسي المعتمد (Canonical URL)
            </label>
            <input
              type="url"
              dir="ltr"
              value={formData.canonical_url}
              onChange={(e) => handleChange('canonical_url', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
