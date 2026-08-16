import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { JOURNAL_ARTICLES } from '../data/journal';
import { useLanguage } from '../context/LanguageContext';

export const JournalPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const featuredArticle = JOURNAL_ARTICLES[0];
  const gridArticles = JOURNAL_ARTICLES.slice(1);

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono text-secondary dark:text-zinc-400 uppercase tracking-widest">
            {isRTL ? 'مقالات نقدية • أقمشة نادرة • انضباط معماري' : 'ESSAYS • TEXTILES • ARCHITECTURAL DISCIPLINE'}
          </span>
          <h1 className="font-editorial text-5xl sm:text-6xl text-primary dark:text-white mt-1 uppercase">
            {t.navJournal}
          </h1>
          <p className="text-xs sm:text-sm text-secondary dark:text-zinc-400 mt-2 font-light">
            {isRTL
              ? 'تأملات معمارية حول هندسة الملابس، وحياكة القطن الياباني الكثيف، والتقليلية البنائية.'
              : 'Critical reflections on garment architecture, Japanese loopwheel knitting, and monolithic minimalism.'}
          </p>
        </div>

        {/* Featured Hero Article */}
        {featuredArticle && (
          <Link
            to={`/journal/${featuredArticle.id}`}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 p-6 md:p-8 mb-16 hover:border-primary transition-all"
          >
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-zinc-950">
              <img
                src={featuredArticle.coverImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between py-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono text-secondary dark:text-zinc-400 uppercase">
                  <span>{featuredArticle.category}</span>
                  <span>•</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl text-primary dark:text-white group-hover:underline leading-[0.95]">
                  {isRTL ? 'بيان التصميم المعماري: الهيكل قبل التزيين' : featuredArticle.title}
                </h2>
                <p className="text-xs sm:text-sm text-secondary dark:text-zinc-300 leading-relaxed font-light">
                  {isRTL
                    ? 'دراسة في أصول الأناقة البنائية وتاريخ الصوف المزدوج والقطن الكثيف في تشكيلات إيفل المعاصرة.'
                    : featuredArticle.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-surface-container dark:border-zinc-800 flex items-center justify-between text-xs font-label-bold uppercase text-primary dark:text-white">
                <span>{isRTL ? `بقلم ${featuredArticle.author}` : `BY ${featuredArticle.author}`}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{isRTL ? 'قراءة المقال كاملاً' : 'READ FULL ESSAY'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gridArticles.map((article) => (
            <Link
              key={article.id}
              to={`/journal/${article.id}`}
              className="group flex flex-col bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 p-6 hover:border-primary transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden bg-zinc-950 mb-6">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-secondary dark:text-zinc-400 uppercase mb-2">
                <span>{article.category}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>

              <h3 className="font-editorial text-2xl text-primary dark:text-white group-hover:underline line-clamp-2">
                {article.title}
              </h3>

              <p className="text-xs text-secondary dark:text-zinc-400 mt-2 line-clamp-3 font-light leading-relaxed">
                {article.excerpt}
              </p>

              <div className="mt-6 pt-4 border-t border-surface-container dark:border-zinc-800 flex items-center justify-between text-xs font-label-bold uppercase text-primary dark:text-white">
                <span>{article.date}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{isRTL ? 'قراءة المقال' : 'READ ESSAY'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
