import React, { useState, useRef } from 'react';
import type { Developer } from '../../types';
import { uploadImage } from '../../lib/api';
import {
  X,
  Upload,
  User,
  Briefcase,
  Quote,
  FileText,
  Mail,
  Globe,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';

interface DeveloperModalProps {
  developer?: Developer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Developer>) => Promise<void>;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({
  developer,
  isOpen,
  onClose,
  onSave
}) => {
  const isEditing = Boolean(developer);

  const [name, setName] = useState(developer?.name || '');
  const [role, setRole] = useState(developer?.role || '');
  const [bio, setBio] = useState(developer?.bio || '');
  const [quote, setQuote] = useState(developer?.quote || '');
  const [imageUrl, setImageUrl] = useState(developer?.image_url || '/uploads/default-avatar.svg');
  const [githubUrl, setGithubUrl] = useState(developer?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(developer?.linkedin_url || '');
  const [facebookUrl, setFacebookUrl] = useState(developer?.facebook_url || '');
  const [instagramUrl, setInstagramUrl] = useState(developer?.instagram_url || '');
  const [email, setEmail] = useState(developer?.email || '');
  const [websiteUrl, setWebsiteUrl] = useState(developer?.website_url || '');
  const [sortOrder, setSortOrder] = useState(developer?.sort_order || 1);
  const [isVisible, setIsVisible] = useState(developer?.is_visible !== false);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP, SVG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب ألا يتجاوز 5 ميغابايت');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const res = await uploadImage(file);
      setImageUrl(res.url);
    } catch (err: any) {
      setError(err.message || 'فشل رفع الصورة إلى الخادم');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setError('الاسم والمسمى الوظيفي حقلان إلزاميان');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave({
        name: name.trim(),
        role: role.trim(),
        bio: bio.trim(),
        quote: quote.trim(),
        image_url: imageUrl,
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        facebook_url: facebookUrl.trim(),
        instagram_url: instagramUrl.trim(),
        email: email.trim(),
        website_url: websiteUrl.trim(),
        sort_order: Number(sortOrder) || 1,
        is_visible: isVisible
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ بيانات المطور');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? 'تعديل بيانات المطور' : 'إضافة مطور جديد'}
            </h3>
            <p className="text-xs text-slate-500">
              أدخل المعلومات التي ستظهر في بطاقة المطور على الصفحة الرئيسية
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Photo Upload Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              صورة المطور (يتم حفظها في نظام التخزين)
            </label>
            <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <div className="relative w-20 h-20 rounded-full ring-2 ring-blue-200 overflow-hidden bg-white shrink-0">
                <img
                  src={imageUrl}
                  alt="معاينة"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/uploads/default-avatar.svg';
                  }}
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'جارٍ رفع الصورة...' : 'رفع صورة من جهازك'}</span>
                </button>
                <p className="text-[11px] text-slate-500">
                  ندعم WebP, JPG, PNG بحجم أقصى 5 ميغابايت
                </p>
              </div>
            </div>
          </div>

          {/* Basic Info: Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                الاسم بالكامل *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: يوسف عماد الدين"
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                المسمى الوظيفي *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="مثال: مطور ومؤسس منصة حِصّتي"
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              نبذة مختصرة عن المطور
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="نبذة تصف خبرته ودوره الأساسي في بناء وتطوير منصة حِصّتي..."
                className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition leading-relaxed"
              />
            </div>
          </div>

          {/* Quote */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              الجملة الشخصية (تظهر أسفل البطاقة)
            </label>
            <div className="relative">
              <Quote className="w-4 h-4 text-slate-400 absolute right-3 top-3 rotate-180" />
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={2}
                placeholder="مثال: أؤمن أن البرمجة ليست مجرد كتابة كود، بل بناء تجارب تصنع فرقًا."
                className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition leading-relaxed"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800 mb-3">روابط التواصل والحسابات</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  رابط GitHub
                </label>
                <div className="relative">
                  <Github className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  رابط LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dev@hassty.com"
                    className="w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  الموقع الشخصي
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yousef.dev"
                    className="w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Facebook URL
                </label>
                <div className="relative">
                  <Facebook className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/username"
                    className="w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Instagram URL
                </label>
                <div className="relative">
                  <Instagram className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings: Order & Visibility */}
          <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ترتيب الظهور (الرقم الأصغر يظهر أولاً)
              </label>
              <input
                type="number"
                min={1}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                حالة الظهور في الموقع
              </label>
              <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className={`w-full py-2 px-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition ${
                  isVisible
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{isVisible ? 'معروض في الصفحة للزوار' : 'مخفي حالياً'}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white shadow-2xs">
                  تبديل
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || isUploading}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            {isSaving ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{isEditing ? 'حفظ التعديلات' : 'إضافة المطور'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
