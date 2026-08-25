import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { CategoryItem } from '@/types';
import { useLanguage } from '@/shared';

interface AdminCategoryCardProps {
  category: CategoryItem;
  productCount: number;
  onEdit: (cat: CategoryItem) => void;
  onDelete: (id: string) => void;
}

export const AdminCategoryCard: React.FC<AdminCategoryCardProps> = ({
  category,
  productCount,
  onEdit,
  onDelete
}) => {
  const { language, t } = useLanguage();
  const isProtected = ['men', 'kids', 'accessories', 'offers'].includes(category.id);
  const displayName = language === 'ar' ? (category.name || category.nameEn) : (category.nameEn || category.name);

  return (
    <div className="bg-zinc-950 border border-zinc-800 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-zinc-700 transition-colors">
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase font-bold text-white bg-black/60 px-2 py-0.5">
            {category.nameEn}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-black/70 px-2 py-0.5 font-bold">
            {productCount} {t.items}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-editorial text-lg font-bold text-white tracking-wide">
            {displayName}
          </h3>
          {category.subtitle && (
            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
              {category.subtitle}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <Link
            to={`/collections/${category.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 font-mono"
          >
            <span>{t.adminStorePreview}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(category)}
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs transition-colors cursor-pointer"
              title={t.adminEditCategory}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {!isProtected && (
              <button
                onClick={() => onDelete(category.id)}
                className="p-1.5 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-700 text-xs transition-colors cursor-pointer"
                title={t.delete}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
