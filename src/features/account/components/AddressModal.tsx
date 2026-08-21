import React, { useState } from 'react';
import { MapPin, Crosshair, Map, Loader2, ShieldCheck, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/shared';
import { Address, User } from '@/types';
import { GoogleMapsPickerModal } from '@/features/checkout/components/GoogleMapsPickerModal';
import { locationService, GeocodedAddress } from '@/services/locationService';

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
  const { t, isRTL } = useLanguage();
  const [newFirstName, setNewFirstName] = useState(user?.name.split(' ')[0] || '');
  const [newLastName, setNewLastName] = useState(user?.name.split(' ')[1] || '');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newCountry, setNewCountry] = useState('Egypt');
  const [newPhone, setNewPhone] = useState(user?.phone || '');

  // Map & GPS State
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [mapUrl, setMapUrl] = useState<string | undefined>();
  const [showMapModal, setShowMapModal] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsSuccessNotice, setGpsSuccessNotice] = useState<string | null>(null);

  // Apply resolved geocoded location
  const handleApplyLocation = (loc: GeocodedAddress) => {
    if (loc.governorate) setNewCity(loc.governorate);
    if (loc.street) setNewStreet(loc.street);
    if (loc.postalCode) setNewPostal(loc.postalCode);
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
    setMapUrl(loc.mapUrl);

    setGpsSuccessNotice(
      isRTL
        ? '✓ تم تحديد العنوان الجغرافي من الخرائط وتعبئة البيانات بنجاح'
        : '✓ Location verified and address filled from maps successfully'
    );
    setTimeout(() => setGpsSuccessNotice(null), 5000);
  };

  // Quick 1-click GPS
  const handleQuickGps = async () => {
    setIsGpsLoading(true);
    try {
      const coords = await locationService.getCurrentCoordinates();
      const resolved = await locationService.reverseGeocode(coords.latitude, coords.longitude);
      handleApplyLocation(resolved);
    } catch {
      // If direct GPS fails or denied, open map modal to let user pick
      setShowMapModal(true);
    } finally {
      setIsGpsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAddress({
      type: addressType,
      firstName: newFirstName,
      lastName: newLastName,
      street: newStreet,
      apartment: newApartment || undefined,
      city: newCity,
      state: newCity,
      postalCode: newPostal || '11211',
      country: newCountry,
      phone: newPhone,
      latitude,
      longitude,
      mapUrl,
      formattedAddress: mapUrl ? `${newStreet}, ${newCity}` : undefined,
      isDefault: user.addresses.length === 0,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="relative bg-surface-container-lowest dark:bg-zinc-950 p-6 sm:p-8 max-w-lg w-full border border-surface-container dark:border-zinc-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-surface-container dark:border-zinc-800 pb-3">
            <div>
              <h3 className="font-editorial text-2xl text-primary dark:text-white">{t.addNewAddress}</h3>
              <p className="text-xs text-secondary dark:text-zinc-400 mt-0.5">
                {isRTL
                  ? 'أدخل بيانات العنوان أو حدده مباشرة عبر الخريطة والـ GPS.'
                  : 'Enter address details or pick directly via Map & GPS.'}
              </p>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="text-secondary hover:text-primary dark:hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Quick Map & GPS Detection Bar */}
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-label-bold text-zinc-300 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRTL ? 'تحديد الموقع الذكي من الخرائط' : 'Smart Map Location'}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickGps}
                disabled={isGpsLoading}
                className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGpsLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Crosshair className="w-3.5 h-3.5 text-emerald-200" />
                )}
                <span>{isRTL ? '📍 موقعي الحالي (GPS)' : '📍 My Location (GPS)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="flex-1 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Map className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRTL ? '🗺️ اختيار من الخريطة' : '🗺️ Pick on Map'}</span>
              </button>
            </div>

            {/* GPS Success Notice */}
            {gpsSuccessNotice && (
              <div className="p-2 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs rounded flex items-center gap-2 animate-fade-in">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{gpsSuccessNotice}</span>
              </div>
            )}

            {/* Verified Location Attached Link */}
            {mapUrl && (
              <div className="p-2 bg-zinc-950 border border-amber-500/30 rounded flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-zinc-300 font-mono text-[11px]">
                    {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                  </span>
                </div>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1 text-[11px] font-bold"
                >
                  <span>{isRTL ? 'معاينة على الخريطة' : 'Preview Link'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Address Type */}
            <div>
              <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">
                {isRTL ? 'نوع العنوان' : 'Address Type'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Home', 'Work', 'Other'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAddressType(type)}
                    className={`py-1.5 text-xs font-bold uppercase border transition-all ${
                      addressType === type
                        ? 'bg-primary text-white dark:bg-white dark:text-black border-primary dark:border-white'
                        : 'bg-surface-container-low dark:bg-zinc-900 text-secondary dark:text-zinc-400 border-surface-container dark:border-zinc-800'
                    }`}
                  >
                    {type === 'Home'
                      ? isRTL
                        ? 'المنزل'
                        : 'Home'
                      : type === 'Work'
                      ? isRTL
                        ? 'العمل'
                        : 'Work'
                      : isRTL
                      ? 'أخرى'
                      : 'Other'}
                  </button>
                ))}
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">{t.firstNameLabel}</label>
                <input
                  type="text"
                  required
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 p-2.5 text-xs text-primary dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">{t.lastNameLabel}</label>
                <input
                  type="text"
                  required
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 p-2.5 text-xs text-primary dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Street & Apartment */}
            <div>
              <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">{t.streetLabel}</label>
              <input
                type="text"
                required
                placeholder={isRTL ? 'اسم الشارع، رقم العمارة، علامة مميزة' : 'Street name, building no, landmark'}
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 p-2.5 text-xs text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">
                {isRTL ? 'رقم الشقة / الطابق (اختياري)' : 'Apartment / Floor (Optional)'}
              </label>
              <input
                type="text"
                placeholder={isRTL ? 'مثال: شقة 4 - الدور الثاني' : 'e.g. Apt 4, 2nd Floor'}
                value={newApartment}
                onChange={(e) => setNewApartment(e.target.value)}
                className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 p-2.5 text-xs text-primary dark:text-white focus:outline-none"
              />
            </div>

            {/* City (Governorate) & Postal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">{t.cityLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'المحافظة / المدينة' : 'City / Governorate'}
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 p-2.5 text-xs text-primary dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">{t.postalCodeLabel}</label>
                <input
                  type="text"
                  value={newPostal}
                  placeholder="11211"
                  onChange={(e) => setNewPostal(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 p-2.5 text-xs font-mono text-primary dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Country & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">{t.countryLabel}</label>
                <input
                  type="text"
                  required
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 p-2.5 text-xs text-primary dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase mb-1">{t.phoneLabel}</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 p-2.5 text-xs font-mono text-primary dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Submit / Cancel Buttons */}
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
                {isRTL ? 'حفظ العنوان' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Google Maps Picker Modal */}
      {showMapModal && (
        <GoogleMapsPickerModal
          isOpen={showMapModal}
          onClose={() => setShowMapModal(false)}
          onSelectLocation={(loc) => {
            handleApplyLocation(loc);
            setShowMapModal(false);
          }}
          initialLat={latitude || 30.0444}
          initialLng={longitude || 31.2357}
        />
      )}
    </>
  );
};
