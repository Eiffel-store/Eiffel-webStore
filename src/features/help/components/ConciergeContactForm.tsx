import React, { useState } from 'react';
import { Send, Check, MessageSquare } from 'lucide-react';
import { useLanguage, FacebookIcon, WhatsAppIcon } from '@/shared';

interface ConciergeContactFormProps {
  onOpenLiveChat: () => void;
}

export const ConciergeContactForm: React.FC<ConciergeContactFormProps> = ({
  onOpenLiveChat,
}) => {
  const { t, isRTL } = useLanguage();
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Social links
  const facebookUrl = 'https://www.facebook.com/profile.php?id=100093268017929';
  const whatsappUrl = 'https://wa.me/'; // User can replace with actual WhatsApp number e.g. https://wa.me/201000000000

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactMessage('');
      setContactEmail('');
    }, 3000);
  };

  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="p-6 sm:p-8 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-6">
        <div>
          <span className="text-[10px] font-mono text-secondary uppercase">24/7 PRIVATE CLIENT SERVICE</span>
          <h3 className="font-editorial text-2xl sm:text-3xl text-primary dark:text-white mt-0.5">
            {t.contactConciergeTitle}
          </h3>
          <p className="text-xs text-secondary dark:text-zinc-400 font-light mt-1">
            {t.contactConciergeDesc}
          </p>
        </div>

        {/* Quick Social Contact Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] text-white font-label-bold text-xs uppercase tracking-wider hover:bg-[#20ba5a] transition-colors shadow-sm"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
            <span>{isRTL ? 'واتساب' : 'WhatsApp'}</span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1877F2] text-white font-label-bold text-xs uppercase tracking-wider hover:bg-[#166fe5] transition-colors shadow-sm"
          >
            <FacebookIcon className="w-4 h-4 fill-current" />
            <span>{isRTL ? 'فيسبوك' : 'Facebook'}</span>
          </a>
        </div>

        {contactSubmitted ? (
          <div className="p-6 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container text-center space-y-2 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-xl text-primary dark:text-white">{t.inquiryReceived}</h4>
            <p className="text-xs text-secondary font-light">
              {t.inquiryReceivedDesc}
            </p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                {t.emailLabel}
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="client@eiffel-store.com"
                className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                {t.messageLabel}
              </label>
              <textarea
                rows={4}
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder={isRTL ? "يرجى كتابة استفسارك أو المقاسات المطلوبة أو طلب فرع زفتى/نهطاي..." : "Please enter your question, sizing inquiry, or Zefta/Nahtay branch request..."}
                className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <Send className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t.transmitInquiry}</span>
            </button>
          </form>
        )}

        {/* Live Chat Trigger */}
        <div className="pt-4 border-t border-surface-container dark:border-zinc-800">
          <button
            onClick={onOpenLiveChat}
            className="w-full py-3.5 border border-primary dark:border-white font-label-bold text-xs tracking-widest uppercase text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isRTL ? 'محادثة الموقع الفورية' : 'START LIVE CHAT'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
