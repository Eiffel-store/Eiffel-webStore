import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/shared';

interface AdminProductDeleteModalProps {
  productId: string | null;
  onConfirm: (id: string) => void;
  onCancel: () => void;
}

export const AdminProductDeleteModal: React.FC<AdminProductDeleteModalProps> = ({
  productId,
  onConfirm,
  onCancel
}) => {
  const { isRTL } = useLanguage();

  if (!productId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <h3 className="font-bold text-sm text-white">
            {isRTL ? 'تأكيد حذف المنتج؟' : 'Delete Product?'}
          </h3>
        </div>
        <p className="text-xs text-zinc-400">
          {isRTL
            ? 'هل أنت متأكد من حذف هذه القطعة من الكتالوج؟ لن تظهر مجدداً في المتجر.'
            : 'Are you sure you want to remove this piece from the catalog? This action is permanent.'}
        </p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={() => onConfirm(productId)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
          >
            {isRTL ? 'نعم، احذف' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
