import React, { useState } from 'react';
import { MapPin, Phone, Clock, Check, ExternalLink } from 'lucide-react';
import { STORES } from '../data/stores';
import { StoreLocation } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const StoreLocatorPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(STORES[0]);
  const [appointmentModalStore, setAppointmentModalStore] = useState<StoreLocation | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('14:00');
  const [appointmentName, setAppointmentName] = useState('');
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentBooked(true);
    setTimeout(() => {
      setAppointmentBooked(false);
      setAppointmentModalStore(null);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-surface-container dark:border-zinc-800 gap-4">
          <div>
            <span className="text-xs font-mono text-secondary dark:text-zinc-400 uppercase tracking-widest">
              {t.globalFlagships}
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white mt-1 uppercase">
              {t.storeLocatorTitle}
            </h1>
          </div>
          <p className="text-xs text-secondary dark:text-zinc-400 max-w-md font-light">
            {t.storeLocatorDesc}
          </p>
        </div>

        {/* Main Grid: Stores List & Simulated Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Store Cards List (5 cols) */}
          <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-2 rtl:pr-0 rtl:pl-2">
            {STORES.map((store) => (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`p-6 border cursor-pointer transition-all ${
                  selectedStore.id === store.id
                    ? 'border-primary dark:border-white bg-surface-container-low dark:bg-zinc-900 shadow-md'
                    : 'border-surface-container dark:border-zinc-800 bg-surface-container-lowest dark:bg-zinc-950 hover:border-secondary'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-editorial text-2xl text-primary dark:text-white">
                    {store.city.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-label-bold uppercase px-2 py-0.5 bg-surface-container dark:bg-zinc-800 text-secondary dark:text-zinc-300">
                    {store.type}
                  </span>
                </div>

                <h4 className="font-editorial text-lg text-primary dark:text-white">
                  {store.name}
                </h4>

                <div className="mt-3 space-y-1.5 text-xs text-secondary dark:text-zinc-400 font-light">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary dark:text-white" />
                    <span>{store.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-primary dark:text-white" />
                    <span>{store.hours}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-primary dark:text-white" />
                    <span>{store.phone}</span>
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-container/60 dark:border-zinc-800 flex items-center justify-between gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAppointmentModalStore(store);
                    }}
                    className="py-2 px-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-[11px] tracking-wider uppercase hover:bg-neutral-800 transition-colors"
                  >
                    {t.bookAppointment}
                  </button>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-label-bold text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white flex items-center gap-1 uppercase"
                  >
                    <span>{t.getDirections}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Simulated Interactive Map Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full bg-zinc-950 border border-surface-container dark:border-zinc-800 overflow-hidden shadow-2xl">
              {/* World Grid Texture */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

              {/* Architectural Map Background Image */}
              <img
                src={selectedStore.image}
                alt={selectedStore.name}
                className="w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              {/* Map Interactive Pins for all stores */}
              {STORES.map((st) => {
                const isSelected = selectedStore.id === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStore(st)}
                    style={{ top: `${st.coordinates.y}%`, left: `${st.coordinates.x}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  >
                    <div className="relative">
                      {isSelected && (
                        <span className="absolute -inset-2 rounded-full bg-white/30 animate-ping" />
                      )}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xl transition-all ${
                          isSelected
                            ? 'bg-white text-black scale-125 ring-4 ring-white/40'
                            : 'bg-zinc-800 text-white border border-zinc-600 hover:scale-110'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* City Marker Label */}
                    <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/90 text-white font-mono text-[10px] tracking-wider uppercase whitespace-nowrap border border-zinc-800">
                      {st.city}
                    </span>
                  </button>
                );
              })}

              {/* Selected Store Active Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/85 backdrop-blur-md border border-zinc-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                    {t.activeSelection} {selectedStore.type}
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-white">
                    {selectedStore.name}
                  </h3>
                  <p className="text-xs text-zinc-300 font-light mt-0.5">
                    {selectedStore.address}
                  </p>
                </div>

                <button
                  onClick={() => setAppointmentModalStore(selectedStore)}
                  className="py-3 px-6 bg-white text-black font-label-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-colors whitespace-nowrap"
                >
                  {t.scheduleFitting}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Private Fitting Appointment Modal */}
      {appointmentModalStore && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative bg-surface-container-lowest dark:bg-zinc-950 p-6 sm:p-8 max-w-lg w-full border border-surface-container dark:border-zinc-800 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-surface-container dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-mono text-secondary uppercase">ATELIER RESERVATION</span>
                <h3 className="font-editorial text-2xl text-primary dark:text-white mt-0.5">
                  {t.appointmentModalTitle} {appointmentModalStore.city.toUpperCase()}
                </h3>
              </div>
              <button onClick={() => setAppointmentModalStore(null)} className="text-primary dark:text-white">
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
                  {t.appointmentBookedDesc} ({appointmentModalStore.name}).
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
                    onClick={() => setAppointmentModalStore(null)}
                    className="flex-1 py-3 border border-surface-container text-xs font-label-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:bg-neutral-800"
                  >
                    {t.confirmBooking}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
