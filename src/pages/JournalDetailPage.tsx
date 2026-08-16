import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { JOURNAL_ARTICLES } from '../data/journal';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export const JournalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, isRTL } = useLanguage();
  const article = JOURNAL_ARTICLES.find((a) => a.id === id) || JOURNAL_ARTICLES[0];

  const relatedProducts = PRODUCTS.slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 text-xs font-label-bold text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white uppercase mb-8"
        >
          <ArrowLeft className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{isRTL ? 'العودة إلى المجلة' : 'BACK TO THE JOURNAL'}</span>
        </Link>

        {/* Header Metadata */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3 text-xs font-mono text-secondary dark:text-zinc-400 uppercase">
            <span>{article.category}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-primary dark:text-white uppercase leading-[0.95]">
            {isRTL && article.id === 'structural-manifesto' ? 'بيان التصميم المعماري: الهيكل قبل التزيين' : article.title}
          </h1>

          <p className="text-base text-secondary dark:text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed">
            {isRTL && article.id === 'structural-manifesto'
              ? 'دراسة في أصول الأناقة البنائية وتاريخ الصوف المزدوج والقطن الكثيف في تشكيلات إيفل المعاصرة.'
              : article.subtitle}
          </p>

          <div className="text-xs font-mono text-primary dark:text-white pt-2">
            {isRTL ? `الكاتب: ${article.author}` : `AUTHOR: ${article.author}`}
          </div>
        </div>

        {/* Full-bleed Cover */}
        <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-950 my-10 border border-surface-container dark:border-zinc-800">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Editorial Body */}
        <div className="prose dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-secondary dark:text-zinc-300 font-light">
          {article.content.map((block, idx) => {
            if (block.type === 'paragraph') {
              return <p key={idx}>{block.value}</p>;
            } else if (block.type === 'heading') {
              return (
                <h3 key={idx} className="font-editorial text-2xl sm:text-3xl text-primary dark:text-white uppercase pt-6">
                  {block.value}
                </h3>
              );
            } else if (block.type === 'quote') {
              return (
                <blockquote
                  key={idx}
                  className="p-6 bg-surface-container-low dark:bg-zinc-900 border-l-4 rtl:border-l-0 rtl:border-r-4 border-primary dark:border-white font-editorial text-2xl text-primary dark:text-white italic my-8"
                >
                  {block.value}
                </blockquote>
              );
            } else if (block.type === 'image' && block.src) {
              return (
                <div key={idx} className="my-8">
                  <div className="aspect-[16/10] overflow-hidden bg-zinc-950 border border-surface-container dark:border-zinc-800">
                    <img src={block.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  {block.caption && (
                    <p className="text-xs font-mono text-zinc-500 mt-2 text-center">{block.caption}</p>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Shop The Story Recommendations */}
        <div className="mt-16 pt-12 border-t border-surface-container dark:border-zinc-800">
          <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest block mb-1">
            {isRTL ? 'قطع مختارة من هذا المقال' : 'CURATED SELECTIONS'}
          </span>
          <h3 className="font-editorial text-3xl text-primary dark:text-white mb-6 uppercase">
            {isRTL ? 'تسوق القطع المميزة' : 'SHOP PIECES FROM THIS ESSAY'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
