import React from 'react';
import { useLanguage } from '@/shared';

export const EGYPTIAN_GOVERNORATES = [
  'Cairo (القاهرة)',
  'Giza (الجيزة)',
  'Alexandria (الإسكندرية)',
  'Qalyubia (القليوبية)',
  'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)',
  'Dakahlia / Mansoura (الدقهلية والمنصورة)',
  'Sharqia / Zagazig (الشرقية والزقازيق)',
  'Monufia (المنوفية)',
  'Beheira (البحيرة)',
  'Kafr El Sheikh (كفر الشيخ)',
  'Damietta (دمياط)',
  'Port Said (بورسعيد)',
  'Ismailia (الإسماعيلية)',
  'Suez (السويس)',
  'South Sinai / Sharm El Sheikh (جنوب سيناء وشرم الشيخ)',
  'Red Sea / Hurghada & Gouna (البحر الأحمر والغردقة والجونة)',
  'North Sinai (شمال سيناء)',
  'Matrouh & North Coast (مطروح والساحل الشمالي)',
  'Faiyum (الفيوم)',
  'Beni Suef (بني سويف)',
  'Minya (المنيا)',
  'Asyut (أسيوط)',
  'Sohag (سوهاج)',
  'Qena (قنا)',
  'Luxor (الأقصر)',
  'Aswan (أسوان)',
  'New Valley (الوادي الجديد)'
];

interface CheckoutContactFormProps {
  email: string;
  setEmail: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  street: string;
  setStreet: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  postalCode: string;
  setPostalCode: (val: string) => void;
}

export const CheckoutContactForm: React.FC<CheckoutContactFormProps> = ({
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  city,
  setCity,
  street,
  setStreet,
  phone,
  setPhone,
  postalCode,
  setPostalCode,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-surface-container dark:border-zinc-800">
        <h3 className="font-editorial text-2xl text-primary dark:text-white uppercase">
          1. {t.stepContact} & {t.stepDelivery}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
            {t.emailLabel}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white font-mono focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
            {t.firstNameLabel}
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
            {t.lastNameLabel}
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
            {t.cityLabel}
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white focus:outline-none"
          >
            {EGYPTIAN_GOVERNORATES.map((gov) => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
            {t.streetLabel}
          </label>
          <input
            type="text"
            required
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="e.g. 18 Gezira St, Zamalek, Building 4, Apt 7"
            className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
            {t.phoneLabel}
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+20 100 123 4567"
            className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs font-mono text-primary dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
            {t.postalCodeLabel}
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs font-mono text-primary dark:text-white focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
