import React, { useState, useEffect, useRef } from 'react';
import type { MediaItem } from '../../types';
import { fetchMedia, deleteMedia, uploadImage } from '../../lib/api';
import {
  Upload,
  Trash2,
  Copy,
  Check,
  HardDrive,
  AlertCircle,
  FileImage,
  RefreshCw
} from 'lucide-react';

export const MediaManager: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await fetchMedia();
      setMedia(items);
    } catch (err: any) {
      setError(err.message || 'فشل جلب ملفات الوسائط');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      await uploadImage(file);
      await loadMedia();
    } catch (err: any) {
      setError(err.message || 'فشل رفع الملف');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف نهائيًا من التخزين؟')) return;
    try {
      await deleteMedia(filename);
      setMedia((prev) => prev.filter((m) => m.name !== filename));
    } catch (err: any) {
      setError(err.message || 'فشل حذف الملف');
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Upload action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">مكتبة الوسائط والتخزين</h2>
          <p className="text-xs text-slate-500">
            إدارة جميع الصور المرفوعة للمطورين والشعار في نظام التخزين المحلي السريع.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadMedia}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="تحديث القائمة"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'جارٍ الرفع...' : 'رفع صورة جديدة'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse h-48 flex flex-col justify-between"
            >
              <div className="h-28 bg-slate-200 rounded-xl mb-2" />
              <div className="h-3 bg-slate-200 rounded w-3/4 mb-1" />
              <div className="h-2 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <HardDrive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">لا توجد وسائط مرفوعة حالياً</h3>
          <p className="text-xs text-slate-500 mb-4">
            عند رفع صور المطورين من النوافذ الخاصة بهم، ستظهر في هذه المكتبة تلقائياً.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
          >
            رفع أول ملف صورة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-3 border-t border-slate-100 bg-white">
                <p className="text-xs font-mono font-medium text-slate-800 truncate mb-1" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span>{formatSize(item.size)}</span>
                  <span>{new Date(item.created_at).toLocaleDateString('ar-EG')}</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => handleCopy(item.url)}
                    className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-semibold rounded-lg border border-slate-200 flex items-center justify-center gap-1 transition"
                    title="نسخ الرابط المباشر"
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.name)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition"
                    title="حذف الملف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
