import React, { useState } from 'react';
import type { Developer } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Globe,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface DevelopersManagerProps {
  developers: Developer[];
  onAdd: () => void;
  onEdit: (dev: Developer) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleVisibility: (dev: Developer) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
}

export const DevelopersManager: React.FC<DevelopersManagerProps> = ({
  developers,
  onAdd,
  onEdit,
  onDelete,
  onToggleVisibility,
  onReorder
}) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= developers.length) return;

    const newOrder = [...developers];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    const orderedIds = newOrder.map((d) => d.id);
    await onReorder(orderedIds);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteTargetId);
      setDeleteTargetId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">إدارة فريق المطورين</h2>
          <p className="text-xs text-slate-500">
            أضف المطورين، عدّل بياناتهم وروابطهم، وتحكم في ظهورهم وترتيبهم على الصفحة.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مطور جديد</span>
        </button>
      </div>

      {/* Developers List */}
      {developers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-sm text-slate-500 mb-4">لم يتم تسجيل أي مطورين بعد.</p>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
          >
            إضافة أول مطور الآن
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {developers.map((dev, index) => (
            <div
              key={dev.id}
              className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                dev.is_visible
                  ? 'border-slate-200 hover:border-blue-200'
                  : 'border-amber-200/80 bg-amber-50/20'
              }`}
            >
              {/* Order buttons + Avatar + Basic Details */}
              <div className="flex items-center gap-4 flex-1">
                {/* Reorder Up/Down */}
                <div className="flex flex-col gap-1 items-center">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 transition"
                    title="تحريك لأعلى"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {index + 1}
                  </span>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === developers.length - 1}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 transition"
                    title="تحريك لأسفل"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Avatar with Glow */}
                <div className="relative shrink-0">
                  <img
                    src={dev.image_url || '/uploads/default-avatar.svg'}
                    alt={dev.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 bg-white shadow-2xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/uploads/default-avatar.svg';
                    }}
                  />
                  {!dev.is_visible && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center" title="مخفي" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {dev.name}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        dev.is_visible
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {dev.is_visible ? 'معروض للزوار' : 'مخفي'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-blue-600 mb-1">{dev.role}</p>
                  {dev.bio && (
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">{dev.bio}</p>
                  )}

                  {/* Micro Social icons summary */}
                  <div className="flex items-center gap-2 mt-2 text-slate-400">
                    {dev.github_url && <Github className="w-3.5 h-3.5" />}
                    {dev.linkedin_url && <Linkedin className="w-3.5 h-3.5" />}
                    {dev.email && <Mail className="w-3.5 h-3.5" />}
                    {dev.website_url && <Globe className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                {/* Toggle Visibility */}
                <button
                  onClick={() => onToggleVisibility(dev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    dev.is_visible
                      ? 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border-slate-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                  title={dev.is_visible ? 'إخفاء المطور من الصفحة' : 'إظهار المطور في الصفحة'}
                >
                  {dev.is_visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{dev.is_visible ? 'إخفاء' : 'إظهار'}</span>
                </button>

                {/* Edit */}
                <button
                  onClick={() => onEdit(dev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition"
                  title="تعديل بيانات المطور"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => setDeleteTargetId(dev.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition"
                  title="حذف المطور"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center mb-2">
              تأكيد حذف المطور
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذا المطور من الفريق؟ لا يمكن التراجع عن هذا الإجراء، وسيتم حذف صورته المرتبطة.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                {isDeleting ? 'جارٍ الحذف...' : 'نعم، احذف المطور'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
