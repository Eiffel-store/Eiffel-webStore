import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, Send, Check } from 'lucide-react';
import { FAQ_CATEGORIES } from '../data/faq';
import { useLanguage } from '../context/LanguageContext';

export const HelpCenterPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(FAQ_CATEGORIES[0].id);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ '0-0': true });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: isRTL
        ? 'مرحباً بكم في كونسيرج إيفل الرقمي. كيف يمكنني مساعدتكم اليوم في استفسارات الأزياء أو المقاسات أو متابعة الطلبات؟'
        : 'Bonjour. Welcome to the Eiffel Concierge. How may I assist you with your garment selection or order today?',
      time: '14:00'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactMessage('');
      setContactEmail('');
    }, 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'Now' }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: isRTL
            ? `شكراً لاستفساركم بشأن "${userMsg}". يقوم فريق التنسيق في مشغل باريس بمراجعة التفاصيل وسنوافيكم بالرد فوراً.`
            : `Thank you for your inquiry regarding "${userMsg}". Our atelier styling team is verifying garment specifications for you.`,
          time: 'Now'
        }
      ]);
    }, 1000);
  };

  const currentCategoryData = FAQ_CATEGORIES.find(c => c.id === activeCategory) || FAQ_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header with Search */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono text-secondary dark:text-zinc-400 uppercase tracking-widest">
            {t.helpCenterSubtitle}
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white uppercase">
            {t.helpCenterTitle}
          </h1>
          <p className="text-xs sm:text-sm text-secondary dark:text-zinc-400 font-light">
            {isRTL
              ? 'إجابات فورية حول الشحن الدولي المجاني، وتعديل المقاسات، والإرجاع خلال 30 يوماً، ومواصفات الأقمشة القطنية والصوفية.'
              : 'Find immediate answers regarding complimentary global shipping, bespoke tailoring, 30-day returns, and fabric specifications.'}
          </p>

          <div className="pt-4 relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-secondary absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchFaqPlaceholder}
              className="w-full bg-surface-container-lowest dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 pl-12 pr-4 rtl:pl-4 rtl:pr-12 py-3.5 text-xs text-primary dark:text-white font-mono uppercase focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Main Categories Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-6 border text-left rtl:text-right transition-all ${
                activeCategory === cat.id
                  ? 'border-primary dark:border-white bg-surface-container-low dark:bg-zinc-900 shadow-md'
                  : 'border-surface-container dark:border-zinc-800 bg-surface-container-lowest dark:bg-zinc-950 hover:border-secondary'
              }`}
            >
              <h3 className="font-editorial text-xl text-primary dark:text-white">
                {isRTL && cat.id === 'orders' ? 'الطلبات والتوصيل الدولي' : isRTL && cat.id === 'returns' ? 'الإرجاع والاستبدال' : isRTL && cat.id === 'sizing' ? 'المقاسات ودليل الجسم' : isRTL ? 'الخياطة والأقمشة النادرة' : cat.title}
              </h3>
              <p className="text-[11px] font-mono text-secondary dark:text-zinc-400 mt-1">
                {cat.questions.length} {t.topicsAnswered}
              </p>
            </button>
          ))}
        </div>

        {/* FAQ Accordions & Concierge Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Questions Accordion List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-editorial text-2xl text-primary dark:text-white tracking-wider pb-3 border-b border-surface-container dark:border-zinc-800">
              {isRTL && currentCategoryData.id === 'orders' ? 'الطلبات والتوصيل الدولي' : isRTL && currentCategoryData.id === 'returns' ? 'الإرجاع والاستبدال' : isRTL && currentCategoryData.id === 'sizing' ? 'المقاسات ودليل الجسم' : isRTL ? 'الخياطة والأقمشة النادرة' : currentCategoryData.title}
            </h2>

            <div className="divide-y divide-surface-container dark:divide-zinc-800 border-b border-surface-container dark:border-zinc-800">
              {currentCategoryData.questions.map((item, idx) => {
                const key = `${activeCategory}-${idx}`;
                const isOpen = !!openAccordions[key];
                return (
                  <div key={idx} className="py-4">
                    <button
                      onClick={() => toggleAccordion(key)}
                      className="w-full flex justify-between items-center text-left rtl:text-right gap-4 group"
                    >
                      <span className="font-editorial text-xl text-primary dark:text-white group-hover:underline">
                        {item.q}
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-primary dark:text-white" /> : <ChevronDown className="w-4 h-4 shrink-0 text-secondary" />}
                    </button>
                    {isOpen && (
                      <p className="text-xs text-secondary dark:text-zinc-300 font-light leading-relaxed pt-3 animate-fade-in">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Contact Concierge Form (5 cols) */}
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
                      placeholder="alexandre@eiffel-client.com"
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
                      placeholder={isRTL ? "يرجى ذكر رقم القطعة أو الاستفسار عن المقاسات أو الشحن..." : "Please specify piece reference ID, sizing question, or tracking number..."}
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
                  onClick={() => setShowLiveChat(true)}
                  className="w-full py-3.5 border border-primary dark:border-white font-label-bold text-xs tracking-widest uppercase text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.startLiveChat}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Live Chat Modal */}
      {showLiveChat && (
        <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 w-full max-w-sm bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 shadow-2xl animate-fade-in flex flex-col h-[480px]">
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <div>
              <h4 className="font-editorial text-xl">{t.liveChatTitle}</h4>
              <span className="text-[10px] font-mono text-zinc-300">{t.liveChatStatus}</span>
            </div>
            <button onClick={() => setShowLiveChat(false)} className="text-white hover:opacity-70">
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end rtl:items-start' : 'items-start rtl:items-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white dark:bg-white dark:text-black'
                      : 'bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-primary dark:text-white'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] font-mono text-zinc-400 mt-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-surface-container dark:border-zinc-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t.typeMessagePlaceholder}
              className="flex-1 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 px-3 py-2 text-xs font-mono text-primary dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs uppercase"
            >
              {t.send}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
