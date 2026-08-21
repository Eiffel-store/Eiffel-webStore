import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Check,
  Mail,
  User,
  MapPin,
  Phone,
  Hash,
  Crosshair,
  Map,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Home,
  Briefcase,
  Tag,
  Plus
} from 'lucide-react';
import { useLanguage } from '@/shared';
import { GoogleMapsPickerModal } from './GoogleMapsPickerModal';
import { locationService, GeocodedAddress } from '@/services/locationService';
import { Address } from '@/types';

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

export interface CheckoutFormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  street?: string;
  phone?: string;
}

interface CheckoutContactFormProps {
  addresses?: Address[];
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
  latitude?: number;
  setLatitude?: (val: number | undefined) => void;
  longitude?: number;
  setLongitude?: (val: number | undefined) => void;
  mapUrl?: string;
  setMapUrl?: (val: string | undefined) => void;
  errors: CheckoutFormErrors;
  touched: Record<string, boolean>;
  onBlurField: (field: string) => void;
}

export const CheckoutContactForm: React.FC<CheckoutContactFormProps> = ({
  addresses = [],
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
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  mapUrl,
  setMapUrl,
  errors,
  touched,
  onBlurField
}) => {
  const { t, isRTL } = useLanguage();
  const [showMapModal, setShowMapModal] = useState(false);
  const [isInstantGpsLoading, setIsInstantGpsLoading] = useState(false);
  const [gpsSuccessNotice, setGpsSuccessNotice] = useState<string | null>(null);

  // Address Selection State
  const hasSavedAddresses = Boolean(addresses && addresses.length > 0);
  const defaultAddress = addresses?.find(a => a.isDefault) || addresses?.[0];
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    hasSavedAddresses && defaultAddress ? defaultAddress.id : 'new'
  );

  // Handle choosing a saved address
  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    if (addr.firstName) setFirstName(addr.firstName);
    if (addr.lastName) setLastName(addr.lastName);
    if (addr.phone) setPhone(addr.phone);
    if (addr.street) {
      const fullStreet = addr.apartment ? `${addr.street} - ${addr.apartment}` : addr.street;
      setStreet(fullStreet);
    }
    if (addr.city) setCity(addr.city);
    if (addr.postalCode) setPostalCode(addr.postalCode);
    if (setLatitude) setLatitude(addr.latitude);
    if (setLongitude) setLongitude(addr.longitude);
    if (setMapUrl) setMapUrl(addr.mapUrl);

    setGpsSuccessNotice(
      isRTL
        ? `✓ تم تطبيق العنوان (${addr.street} - ${addr.city}) بنجاح`
        : `✓ Selected address (${addr.street} - ${addr.city}) applied`
    );
    setTimeout(() => setGpsSuccessNotice(null), 4000);
  };

  // Handle switching to enter a new/custom address
  const handleSelectNewAddress = () => {
    setSelectedAddressId('new');
    setStreet('');
    if (setLatitude) setLatitude(undefined);
    if (setLongitude) setLongitude(undefined);
    if (setMapUrl) setMapUrl(undefined);
  };

  // Apply resolved geocoded location
  const handleApplyLocation = (loc: GeocodedAddress) => {
    setCity(loc.governorate);
    setStreet(loc.street);
    if (loc.postalCode) setPostalCode(loc.postalCode);
    if (setLatitude) setLatitude(loc.latitude);
    if (setLongitude) setLongitude(loc.longitude);
    if (setMapUrl) setMapUrl(loc.mapUrl);

    setSelectedAddressId('new'); // marks as custom/geocoded
    setGpsSuccessNotice(isRTL ? '✓ تم تحديد موقعك الجغرافي وتعبئة العنوان بنجاح' : '✓ Location verified and address filled via GPS');
    setTimeout(() => setGpsSuccessNotice(null), 4500);
  };

  // Quick 1-click GPS
  const handleQuickGps = async () => {
    setIsInstantGpsLoading(true);
    try {
      const coords = await locationService.getCurrentCoordinates();
      const resolved = await locationService.reverseGeocode(coords.latitude, coords.longitude);
      handleApplyLocation(resolved);
    } catch {
      // If direct GPS fails or denied, open map modal to let user pick
      setShowMapModal(true);
    } finally {
      setIsInstantGpsLoading(false);
    }
  };

  const getAddressIcon = (type?: string) => {
    switch (type) {
      case 'Work':
        return <Briefcase className="w-3.5 h-3.5 text-zinc-400" />;
      case 'Other':
        return <Tag className="w-3.5 h-3.5 text-zinc-400" />;
      case 'Home':
      default:
        return <Home className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container dark:border-zinc-800">
        <div>
          <h3 className="font-editorial text-2xl text-primary dark:text-white uppercase">
            1. {t.stepContact} & {t.stepDelivery}
          </h3>
          <p className="text-xs text-secondary dark:text-zinc-400 mt-0.5">
            {isRTL
              ? 'اختر من عناوينك المسجلة أو أدخل عنواناً جديداً عبر الخريطة والـ GPS.'
              : 'Choose from saved addresses or enter a new address via Map & GPS.'}
          </p>
        </div>

        {/* GPS / Google Maps Auto-Fill Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickGps}
            disabled={isInstantGpsLoading}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50 cursor-pointer"
            title={isRTL ? 'تحديد موقعي الحالي تلقائياً بالـ GPS' : 'Auto-detect current location via GPS'}
          >
            {isInstantGpsLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-emerald-100" />
            )}
            <span>{isRTL ? '📍 تحديد بالـ GPS' : '📍 Detect GPS'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isRTL ? 'فتح الخريطة واختيار الموقع بدقة' : 'Open map & pick location'}
          >
            <Map className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRTL ? 'الخريطة' : 'Map Picker'}</span>
          </button>
        </div>
      </div>

      {/* GPS Success Banner */}
      {gpsSuccessNotice && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs rounded-lg flex items-center gap-2 animate-fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{gpsSuccessNotice}</span>
        </div>
      )}

      {/* Saved Addresses Picker Section */}
      {hasSavedAddresses && (
        <div className="space-y-3 p-4 bg-surface-container-low dark:bg-zinc-900/80 border border-surface-container dark:border-zinc-800 rounded-lg">
          <div className="flex items-center justify-between">
            <label className="text-xs font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>{isRTL ? 'اختيار عنوان التوصيل من حسابك:' : 'Select Delivery Address:'}</span>
            </label>
            <span className="text-[11px] font-mono text-secondary dark:text-zinc-400">
              {addresses.length} {isRTL ? 'عناوين مسجلة' : 'Saved Addresses'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => handleSelectAddress(addr)}
                  className={`p-3.5 border transition-all cursor-pointer relative flex flex-col justify-between rounded ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/10 shadow-sm ring-1 ring-amber-500/50'
                      : 'border-surface-container dark:border-zinc-800 bg-surface-container-lowest dark:bg-zinc-950 hover:border-zinc-500'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-500 bg-amber-500' : 'border-zinc-500'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-black" />}
                        </span>
                        <div className="flex items-center gap-1">
                          {getAddressIcon(addr.type)}
                          <span className="text-xs font-bold text-primary dark:text-white">
                            {addr.type === 'Home'
                              ? isRTL ? 'المنزل' : 'Home'
                              : addr.type === 'Work'
                              ? isRTL ? 'العمل' : 'Work'
                              : isRTL ? 'أخرى' : 'Other'}
                          </span>
                        </div>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-primary text-white dark:bg-white dark:text-black uppercase">
                          {isRTL ? 'الافتراضي' : 'Default'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-primary dark:text-white line-clamp-1">
                      {addr.firstName} {addr.lastName} • <span className="font-mono text-secondary dark:text-zinc-400">{addr.phone}</span>
                    </p>
                    <p className="text-xs text-secondary dark:text-zinc-300 line-clamp-2">
                      {addr.street} {addr.apartment ? `(${addr.apartment})` : ''} - {addr.city}
                    </p>
                  </div>

                  {addr.mapUrl && (
                    <div className="mt-2 pt-2 border-t border-zinc-800/40 flex items-center gap-1 text-[10px] text-amber-500 font-mono">
                      <MapPin className="w-3 h-3" />
                      <span>{isRTL ? 'موقع GPS مثبت' : 'GPS Verified'}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Option: Choose / Enter Another Address */}
            <div
              onClick={handleSelectNewAddress}
              className={`p-3.5 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 rounded ${
                selectedAddressId === 'new'
                  ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/10 ring-1 ring-amber-500/50'
                  : 'border-zinc-700 hover:border-zinc-500 bg-surface-container-lowest dark:bg-zinc-950'
              }`}
            >
              <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                selectedAddressId === 'new' ? 'border-amber-500 bg-amber-500 text-black' : 'border-zinc-500 text-zinc-400'
              }`}>
                <Plus className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold text-primary dark:text-white">
                {isRTL ? 'استخدام عنوان آخر / جديد' : 'Use a Different / New Address'}
              </span>
              <span className="text-[10px] text-secondary dark:text-zinc-400">
                {isRTL ? 'إدخال تفاصيل عنوان يدوي أو استخدام الخريطة' : 'Enter new address details or use map'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Verified Map URL Attached Badge */}
      {mapUrl && (
        <div className="p-3 bg-zinc-900/90 border border-amber-500/30 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">
              {isRTL ? 'تم ربط إحداثيات موقعك الدقيقة بخرائط Google للطلب' : 'Exact GPS Google Maps coordinates linked to order'}
            </span>
          </div>
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="text-amber-400 hover:text-amber-300 underline font-mono text-[11px] flex items-center gap-1"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Contact & Address Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.emailLabel}</span>
              <span className="text-red-500 font-bold">* ({isRTL ? 'إلزامي' : 'Required'})</span>
            </label>
            {touched.email && !errors.email && email && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isRTL ? 'صحيح' : 'Valid'}
              </span>
            )}
          </div>
          <input
            id="checkout-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => onBlurField('email')}
            placeholder={isRTL ? 'مثال: name@example.com' : 'e.g. name@example.com'}
            className={`w-full bg-surface-container-lowest dark:bg-zinc-950 border p-3 text-xs text-primary dark:text-white font-mono focus:outline-none transition-colors ${
              touched.email && errors.email
                ? 'border-red-500 bg-red-950/10 focus:border-red-500 ring-1 ring-red-500/30'
                : 'border-surface-container dark:border-zinc-700 focus:border-primary dark:focus:border-white'
            }`}
          />
          {touched.email && errors.email && (
            <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* First Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.firstNameLabel}</span>
              <span className="text-red-500 font-bold">* ({isRTL ? 'إلزامي' : 'Required'})</span>
            </label>
            {touched.firstName && !errors.firstName && firstName && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isRTL ? 'صحيح' : 'Valid'}
              </span>
            )}
          </div>
          <input
            id="checkout-firstname"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => onBlurField('firstName')}
            placeholder={isRTL ? 'الاسم الأول' : 'First Name'}
            className={`w-full bg-surface-container-lowest dark:bg-zinc-950 border p-3 text-xs text-primary dark:text-white focus:outline-none transition-colors ${
              touched.firstName && errors.firstName
                ? 'border-red-500 bg-red-950/10 focus:border-red-500 ring-1 ring-red-500/30'
                : 'border-surface-container dark:border-zinc-700 focus:border-primary dark:focus:border-white'
            }`}
          />
          {touched.firstName && errors.firstName && (
            <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.firstName}</span>
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.lastNameLabel}</span>
              <span className="text-red-500 font-bold">* ({isRTL ? 'إلزامي' : 'Required'})</span>
            </label>
            {touched.lastName && !errors.lastName && lastName && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isRTL ? 'صحيح' : 'Valid'}
              </span>
            )}
          </div>
          <input
            id="checkout-lastname"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => onBlurField('lastName')}
            placeholder={isRTL ? 'اسم العائلة' : 'Last Name'}
            className={`w-full bg-surface-container-lowest dark:bg-zinc-950 border p-3 text-xs text-primary dark:text-white focus:outline-none transition-colors ${
              touched.lastName && errors.lastName
                ? 'border-red-500 bg-red-950/10 focus:border-red-500 ring-1 ring-red-500/30'
                : 'border-surface-container dark:border-zinc-700 focus:border-primary dark:focus:border-white'
            }`}
          />
          {touched.lastName && errors.lastName && (
            <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.lastName}</span>
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.phoneLabel} ({isRTL ? 'رقم الهاتف للتوصيل' : 'Delivery Phone'})</span>
              <span className="text-red-500 font-bold">* ({isRTL ? 'إلزامي' : 'Required'})</span>
            </label>
            {touched.phone && !errors.phone && phone && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isRTL ? 'صحيح' : 'Valid'}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              id="checkout-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => onBlurField('phone')}
              placeholder={isRTL ? '01012345678' : '+20 10 1234 5678'}
              className={`w-full bg-surface-container-lowest dark:bg-zinc-950 border p-3 text-xs font-mono text-primary dark:text-white focus:outline-none transition-colors ${
                touched.phone && errors.phone
                  ? 'border-red-500 bg-red-950/10 focus:border-red-500 ring-1 ring-red-500/30'
                  : 'border-surface-container dark:border-zinc-700 focus:border-primary dark:focus:border-white'
              }`}
            />
          </div>
          {touched.phone && errors.phone && (
            <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* Governorate / City */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isRTL ? 'المحافظة / المدينة' : 'Governorate / City'}</span>
              <span className="text-red-500 font-bold">* ({isRTL ? 'إلزامي' : 'Required'})</span>
            </label>
            {city && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isRTL ? 'محدد' : 'Selected'}
              </span>
            )}
          </div>
          <select
            id="checkout-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() => onBlurField('city')}
            className={`w-full bg-surface-container-lowest dark:bg-zinc-950 border p-3 text-xs text-primary dark:text-white focus:outline-none transition-colors ${
              touched.city && errors.city
                ? 'border-red-500 bg-red-950/10 focus:border-red-500'
                : 'border-surface-container dark:border-zinc-700 focus:border-primary dark:focus:border-white'
            }`}
          >
            {EGYPTIAN_GOVERNORATES.map((gov) => (
              <option key={gov} value={gov} className="bg-zinc-900 text-white">
                {gov}
              </option>
            ))}
          </select>
          {touched.city && errors.city && (
            <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.city}</span>
            </p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.postalCodeLabel} ({isRTL ? 'اختياري' : 'Optional'})</span>
            </label>
          </div>
          <input
            id="checkout-postal"
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="11211"
            className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs font-mono text-primary dark:text-white focus:outline-none focus:border-primary dark:focus:border-white"
          />
        </div>

        {/* Street Address */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.streetLabel} ({isRTL ? 'الشارع ورقم العمارة والشقة وعلامة مميزة' : 'Street, building, apt, landmark'})</span>
              <span className="text-red-500 font-bold">* ({isRTL ? 'إلزامي' : 'Required'})</span>
            </label>
            {touched.street && !errors.street && street && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isRTL ? 'مكتمل' : 'Complete'}
              </span>
            )}
          </div>
          <textarea
            id="checkout-street"
            rows={2}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            onBlur={() => onBlurField('street')}
            placeholder={
              isRTL
                ? 'مثال: شارع التسعين الشمالي، عمارة 14، الدور الثالث، شقة 6 - بجوار بنك مصر'
                : 'e.g. 14 El-Teseen St, 3rd Floor, Apt 6 - near Banque Misr'
            }
            className={`w-full bg-surface-container-lowest dark:bg-zinc-950 border p-3 text-xs text-primary dark:text-white focus:outline-none transition-colors ${
              touched.street && errors.street
                ? 'border-red-500 bg-red-950/10 focus:border-red-500 ring-1 ring-red-500/30'
                : 'border-surface-container dark:border-zinc-700 focus:border-primary dark:focus:border-white'
            }`}
          />
          {touched.street && errors.street && (
            <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.street}</span>
            </p>
          )}
        </div>
      </div>

      {/* Google Maps Interactive Picker Modal */}
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
    </div>
  );
};
