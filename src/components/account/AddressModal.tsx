import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Address, User } from '../../types';

interface AddressModalProps {
  user: User;
  onClose: () => void;
  onAddAddress: (addr: Omit<Address, 'id'>) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  user,
  onClose,
  onAddAddress,
}) => {
  const { t } = useLanguage();
  const [newFirstName, setNewFirstName] = useState(user?.name.split(' ')[0] || '');
  const [newLastName, setNewLastName] = useState(user?.name.split(' ')[1] || '');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newCountry, setNewCountry] = useState('Egypt');
  const [newPhone, setNewPhone] = useState(user?.phone || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAddress({
      type: 'Home',
      firstName: newFirstName,
      lastName: newLastName,
      street: newStreet,
      city: newCity,
      state: newCity,
      postalCode: newPostal,
      country: newCountry,
      phone: newPhone,
      isDefault: user.addresses.length === 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-surface-container-lowest dark:bg-zinc-950 p-6 sm:p-8 max-w-md w-full border border-surface-container dark:border-zinc-800 shadow-2xl space-y-4 animate-fade-in">
        <h3 className="font-editorial text-2xl text-primary dark:text-white">{t.addNewAddress}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.firstNameLabel}</label>
              <input
                type="text"
                required
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs text-primary dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.lastNameLabel}</label>
              <input
                type="text"
                required
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs text-primary dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.streetLabel}</label>
            <input
              type="text"
              required
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs text-primary dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.cityLabel}</label>
              <input
                type="text"
                required
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs text-primary dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.postalCodeLabel}</label>
              <input
                type="text"
                required
                value={newPostal}
                onChange={(e) => setNewPostal(e.target.value)}
                className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs font-mono text-primary dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.countryLabel}</label>
            <input
              type="text"
              required
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs text-primary dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.phoneLabel}</label>
            <input
              type="text"
              required
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs font-mono text-primary dark:text-white"
            />
          </div>
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-surface-container text-xs font-label-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs uppercase"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
