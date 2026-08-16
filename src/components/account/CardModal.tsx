import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PaymentMethod, User } from '../../types';

interface CardModalProps {
  user: User;
  onClose: () => void;
  onAddCard: (card: Omit<PaymentMethod, 'id'>) => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  user,
  onClose,
  onAddCard,
}) => {
  const { t, isRTL } = useLanguage();
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCard({
      type: 'visa',
      cardNumber: newCardNumber || '•••• •••• •••• 8842',
      expiry: newCardExp || '12/28',
      cardholderName: newCardHolder || user.name,
      isDefault: user.paymentMethods.length === 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative bg-surface-container-lowest dark:bg-zinc-950 p-6 sm:p-8 max-w-md w-full border border-surface-container dark:border-zinc-800 shadow-2xl space-y-4 animate-fade-in">
        <h3 className="font-editorial text-2xl text-primary dark:text-white">{t.addNewCard}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">{t.cardNumberLabel}</label>
            <input
              type="text"
              required
              placeholder="4532 8821 9021 8842"
              value={newCardNumber}
              onChange={(e) => setNewCardNumber(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 p-2.5 text-xs font-mono text-primary dark:text-white focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">{t.cardExpiryLabel}</label>
              <input
                type="text"
                required
                placeholder="12/28"
                value={newCardExp}
                onChange={(e) => setNewCardExp(e.target.value)}
                className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 p-2.5 text-xs font-mono text-primary dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">{t.cardNameLabel}</label>
              <input
                type="text"
                required
                placeholder="ALEXANDRE LAURENT"
                value={newCardHolder}
                onChange={(e) => setNewCardHolder(e.target.value)}
                className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 p-2.5 text-xs uppercase text-primary dark:text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-surface-container dark:border-zinc-800 text-xs font-label-bold uppercase text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs uppercase shadow-md"
            >
              {isRTL ? 'حفظ البطاقة' : 'Save Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
