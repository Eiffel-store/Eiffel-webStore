import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/shared';
import { Logo } from './Logo';
import { FacebookIcon, WhatsAppIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Facebook and WhatsApp links
  const facebookUrl = 'https://www.facebook.com/profile.php?id=100093268017929';
  const whatsappUrl = 'https://wa.me/'; // User can replace with actual WhatsApp number e.g. https://wa.me/201000000000

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
      <div className="border-b border-zinc-800/80 py-8 sm:py-10 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <Truck className="w-5 h-5 shrink-0 text-zinc-400 mt-0.5" />
            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-white">{t.footerTrustShippingTitle}</h4>
              <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1 leading-relaxed font-light">
                {t.footerTrustShippingDesc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 sm:gap-4">
            <RotateCcw className="w-5 h-5 shrink-0 text-zinc-400 mt-0.5" />
            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-white">{t.footerTrustReturnsTitle}</h4>
              <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1 leading-relaxed font-light">
                {t.footerTrustReturnsDesc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 sm:gap-4">
            <Sparkles className="w-5 h-5 shrink-0 text-zinc-400 mt-0.5" />
            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-white">{t.footerTrustCraftTitle}</h4>
              <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1 leading-relaxed font-light">
                {t.footerTrustCraftDesc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 sm:gap-4">
            <ShieldCheck className="w-5 h-5 shrink-0 text-zinc-400 mt-0.5" />
            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-white">{t.footerTrustSecurityTitle}</h4>
              <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1 leading-relaxed font-light">
                {t.footerTrustSecurityDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="py-12 sm:py-16 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12">
          {/* Brand Manifesto, Socials & Newsletter */}
          <div className="md:col-span-5 space-y-4 sm:space-y-6">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo size="lg" className="text-white" />
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md font-light">
              {t.footerManifesto}
            </p>

            {/* Direct Social Media Links */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#166fe5] transition-colors shadow-md"
              >
                <FacebookIcon className="w-4 h-4 fill-current" />
                <span>{isRTL ? 'صفحتنا على فيسبوك' : 'FACEBOOK'}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#20ba5a] transition-colors shadow-md"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
                <span>{isRTL ? 'واتساب' : 'WHATSAPP'}</span>
              </a>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-label-bold tracking-widest uppercase text-zinc-300 block mb-1.5">
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
                  className="flex-1 bg-zinc-900 border border-zinc-700 px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-mono text-white placeholder:text-zinc-500 uppercase focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-black font-label-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-colors shrink-0 flex items-center gap-1 shadow-md"
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
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-zinc-200 mb-3 sm:mb-4 pb-2 border-b border-zinc-800">
                {t.footerCollections}
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-light">
                <li><Link to="/collections/men" className="hover:text-white transition-colors">{t.navMen}</Link></li>
                <li><Link to="/collections/offers" className="hover:text-white transition-colors font-bold text-white">{t.navCollection04}</Link></li>
                <li><Link to="/collections/kids" className="hover:text-white transition-colors">{t.navKids}</Link></li>
                <li><Link to="/collections/accessories" className="hover:text-white transition-colors">{t.navAccessories}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-zinc-200 mb-3 sm:mb-4 pb-2 border-b border-zinc-800">
                {t.footerClientServices}
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-light">
                <li><Link to="/account" className="hover:text-white transition-colors">{t.clientDashboard}</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">{t.helpCenterTitle}</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">{t.returnsNotice}</Link></li>
                <li><Link to="/stores" className="hover:text-white transition-colors">{t.navStores}</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-zinc-200 mb-3 sm:mb-4 pb-2 border-b border-zinc-800">
                {t.footerMaisons}
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-light">
                <li><Link to="/stores" className="hover:text-white transition-colors">زفتى (الفرع الرئيسي)</Link></li>
                <li><Link to="/stores" className="hover:text-white transition-colors">نهطاي (على الطريق)</Link></li>
                <li><span className="text-zinc-500 text-[11px]">محافظة الغربية، مصر</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright Strip */}
        <div className="max-w-[1440px] mx-auto pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs text-zinc-500 font-mono text-center sm:text-left rtl:sm:text-right">
          <div>
            © {new Date().getFullYear()} EIFFEL. {t.footerCopyright}
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link to="/help" className="hover:text-zinc-300">{t.privacyPolicy}</Link>
            <Link to="/help" className="hover:text-zinc-300">{t.termsOfSale}</Link>
            <Link to="/admin" className="text-zinc-400 hover:text-white font-bold flex items-center gap-1">
              <span>⚡ Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
