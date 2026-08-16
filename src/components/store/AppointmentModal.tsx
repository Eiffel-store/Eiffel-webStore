import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StoreLocation } from '../../types';

interface AppointmentModalProps {
  store: StoreLocation;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  store,
  onClose,
}) => {
  const { t, isRTL } = useLanguage();
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('14:00');
  const [appointmentName, setAppointmentName] = useState('');
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentBooked(true);
    setTimeout(() => {
      setAppointmentBooked(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative bg-surface-container-lowest dark:bg-zinc-950 p-6 sm:p-8 max-w-lg w-full border border-surface-container dark:border-zinc-800 shadow-2xl space-y-6 animate-fade-in">
        <div className="flex justify-between items-center pb-4 border-b border-surface-container dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-mono text-secondary uppercase">ATELIER RESERVATION</span>
            <h3 className="font-editorial text-2xl text-primary dark:text-white mt-0.5">
              {t.appointmentModalTitle} {store.city.toUpperCase()}
            </h3>
          </div>
          <button onClick={onClose} className="text-primary dark:text-white">
            ✕
          </button>
        </div>

        {appointmentBooked ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-editorial text-2xl text-primary dark:text-white">
              {t.appointmentBookedTitle}
            </h4>
            <p className="text-xs text-secondary font-light">
              {t.appointmentBookedDesc} ({store.name}).
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                {t.firstNameLabel} & {t.lastNameLabel}
              </label>
              <input
                type="text"
                required
                placeholder="Alexandre Laurent"
                value={appointmentName}
                onChange={(e) => setAppointmentName(e.target.value)}
                className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-3 text-xs text-primary dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                  {t.preferredDate}
                </label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-3 text-xs font-mono text-primary dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                  {t.timeSlot}
                </label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-3 text-xs font-mono text-primary dark:text-white uppercase"
                >
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                </select>
              </div>
            </div>

            <p className="text-[11px] text-secondary dark:text-zinc-400 font-light leading-relaxed">
              {isRTL
                ? 'يتم تقديم القهوة والمشروبات الترحيبية الفاخرة وقياسات الأتيليه الخاصة خلال جميع جلسات المقاس.'
                : 'Complimentary champagne, espresso, and bespoke measurements provided during all atelier fittings.'}
            </p>

            <div className="flex gap-3 pt-2">
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
                {t.bookAppointment}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
