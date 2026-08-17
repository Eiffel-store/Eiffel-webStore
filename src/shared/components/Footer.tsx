import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/shared';
import { Logo } from './Logo';
import { FacebookIcon, WhatsAppIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const facebookUrl = 'https://www.facebook.com/profile.php?id=100093268017929';
  const whatsappUrl = 'https://wa.me/201009326801';

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
                <span>FACEBOOK</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#20ba5a] transition-colors shadow-md"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
                <span>WHATSAPP</span>
              </a>
            </div>
          </div>

          {/* Nav Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h4 className="font-label-bold text-xs tracking-widest uppercase text-zinc-200 mb-3 sm:mb-4 pb-2 border-b border-zinc-800">
                {t.footerCollections}
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-light">
                <li><Link to="/collections/men" className="hover:text-white transition-colors">{t.navMen}</Link></li>
                <li><Link to="/collections/kids" className="hover:text-white transition-colors">{t.navKids}</Link></li>
                <li><Link to="/collections/accessories" className="hover:text-white transition-colors">{t.navAccessories}</Link></li>
                <li><Link to="/collections/offers" className="hover:text-white transition-colors">{t.navCollection04}</Link></li>
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
                <li>
                  <Link to="/stores" className="hover:text-white transition-colors">
                    {isRTL ? 'زفتى (الفرع الرئيسي)' : 'Zifta (Flagship Atelier)'}
                  </Link>
                </li>
                <li>
                  <Link to="/stores" className="hover:text-white transition-colors">
                    {isRTL ? 'نهطاي (على الطريق)' : 'Nahtay (Roadside Boutique)'}
                  </Link>
                </li>
                <li>
                  <span className="text-zinc-500 text-[11px]">
                    {isRTL ? 'محافظة الغربية، مصر' : 'Gharbia Governorate, Egypt'}
                  </span>
                </li>
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
