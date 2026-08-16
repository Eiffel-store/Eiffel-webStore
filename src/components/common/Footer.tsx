import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
    setEmail('');
  };

  return (
    <footer className="bg-primary text-white dark:bg-black border-t border-zinc-800 transition-colors">
      {/* Brand Trust Value Props Strip */}
      <div className="border-b border-zinc-800/80 py-10 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <Truck className="w-5 h-5 shrink-0 text-zinc-400 mt-1" />
            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-white">{t.footerTrustShippingTitle}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-light">
                {t.footerTrustShippingDesc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <RotateCcw className="w-5 h-5 shrink-0 text-zinc-400 mt-1" />
            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-white">{t.footerTrustReturnsTitle}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-light">
                {t.footerTrustReturnsDesc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Sparkles className="w-5 h-5 shrink-0 text-zinc-400 mt-1" />
            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-white">{t.footerTrustCraftTitle}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-light">
                {t.footerTrustCraftDesc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 shrink-0 text-zinc-400 mt-1" />
            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-white">{t.footerTrustSecurityTitle}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-light">
                {t.footerTrustSecurityDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="py-16 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Manifesto & Newsletter */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="font-editorial text-4xl tracking-tighter text-white block">
              EIFFEL
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md font-light">
              {t.footerManifesto}
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-label-bold tracking-widest uppercase text-zinc-300 block mb-2">
                {t.footerJoinRegistry}
              </span>
              <p className="text-[11px] text-zinc-400 mb-3 font-light">
                {t.footerJoinDesc}
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footerEmailPlaceholder}
                  required
                  className="flex-1 bg-zinc-900 border border-zinc-700 px-4 py-3 text-xs font-mono text-white placeholder:text-zinc-500 uppercase focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-black font-label-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-colors shrink-0 flex items-center gap-1"
                >
                  {subscribed ? <Check className="w-4 h-4 text-green-600" /> : <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />}
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-green-400 font-mono mt-2 animate-fade-in">
                  {t.footerRegisteredSuccess}
                </p>
              )}
            </div>
          </div>

          {/* Directory Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-zinc-200 mb-4 pb-2 border-b border-zinc-800">
                {t.footerCollections}
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400 font-light">
                <li><Link to="/collections/men" className="hover:text-white transition-colors">{t.navMen}</Link></li>
                <li><Link to="/collections/new-arrivals" className="hover:text-white transition-colors">{t.navCollection04}</Link></li>
                <li><Link to="/collections/kids" className="hover:text-white transition-colors">{t.navKids}</Link></li>
                <li><Link to="/collections/accessories" className="hover:text-white transition-colors">{t.navAccessories}</Link></li>
                <li><Link to="/journal" className="hover:text-white transition-colors">{t.navJournal}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-zinc-200 mb-4 pb-2 border-b border-zinc-800">
                {t.footerClientServices}
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400 font-light">
                <li><Link to="/account" className="hover:text-white transition-colors">{t.clientDashboard}</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">{t.helpCenterTitle}</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">{t.returnsNotice}</Link></li>
                <li><Link to="/stores" className="hover:text-white transition-colors">{t.bookAppointment}</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-zinc-200 mb-4 pb-2 border-b border-zinc-800">
                {t.footerMaisons}
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400 font-light">
                <li><Link to="/stores" className="hover:text-white transition-colors">Paris Saint-Honoré</Link></li>
                <li><Link to="/stores" className="hover:text-white transition-colors">New York SoHo</Link></li>
                <li><Link to="/stores" className="hover:text-white transition-colors">Dubai DIFC</Link></li>
                <li><Link to="/stores" className="hover:text-white transition-colors">Tokyo Aoyama</Link></li>
                <li><Link to="/stores" className="hover:text-white transition-colors">Milano Montenapoleone</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright Strip */}
        <div className="max-w-[1440px] mx-auto pt-12 mt-12 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            © {new Date().getFullYear()} EIFFEL STUDIO S.A. {t.footerCopyright}
          </div>
          <div className="flex gap-6">
            <Link to="/help" className="hover:text-zinc-300">{t.privacyPolicy}</Link>
            <Link to="/help" className="hover:text-zinc-300">{t.termsOfSale}</Link>
            <Link to="/help" className="hover:text-zinc-300">{t.accessibility}</Link>
            <Link to="/help" className="hover:text-zinc-300">{t.sustainability}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
