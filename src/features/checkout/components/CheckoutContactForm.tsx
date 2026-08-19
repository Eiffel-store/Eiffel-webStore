import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/shared';
import { GoogleMapsPickerModal } from './GoogleMapsPickerModal';
import { locationService, GeocodedAddress } from '@/services/locationService';

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

  // Apply resolved geocoded location
  const handleApplyLocation = (loc: GeocodedAddress) => {
    setCity(loc.governorate);
    setStreet(loc.street);
    if (loc.postalCode) setPostalCode(loc.postalCode);
    if (setLatitude) setLatitude(loc.latitude);
    if (setLongitude) setLongitude(loc.longitude);
    if (setMapUrl) setMapUrl(loc.mapUrl);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container dark:border-zinc-800">
        <div>
          <h3 className="font-editorial text-2xl text-primary dark:text-white uppercase">
            1. {t.stepContact} & {t.stepDelivery}
          </h3>
          <p className="text-xs text-secondary dark:text-zinc-400 mt-0.5">
            {isRTL
              ? 'يرجى ملء الحقول الإلزامية (*) أو استخدام تحديد الموقع التلقائي بالـ GPS.'
              : 'Please fill required fields (*) or use fast GPS auto-location.'}
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
            <span>{isRTL ? '📍 تحديد موقعي الحالي بالـ GPS' : '📍 Detect GPS'}</span>
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
            id="checkout-firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => onBlurField('firstName')}
            placeholder={isRTL ? 'الاسم الأول (مثال: محمد)' : 'e.g. Mohamed'}
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
            id="checkout-lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => onBlurField('lastName')}
            placeholder={isRTL ? 'اسم العائلة (مثال: علي)' : 'e.g. Ali'}
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
              <span>{t.phoneLabel}</span>
              <span className="text-red-500 font-bold">* ({isRTL ? 'إلزامي لمندوب الشحن' : 'Required for Delivery'})</span>
            </label>
            {touched.phone && !errors.phone && phone && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isRTL ? 'رقم صحيح' : 'Valid Number'}
              </span>
            )}
          </div>
          <input
            id="checkout-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => onBlurField('phone')}
            placeholder={isRTL ? 'مثال: 01012345678 أو +201012345678' : 'e.g. 01012345678 or +201012345678'}
            className={`w-full bg-surface-container-lowest dark:bg-zinc-950 border p-3 text-xs font-mono text-primary dark:text-white focus:outline-none transition-colors ${
              touched.phone && errors.phone
                ? 'border-red-500 bg-red-950/10 focus:border-red-500 ring-1 ring-red-500/30'
                : 'border-surface-container dark:border-zinc-700 focus:border-primary dark:focus:border-white'
            }`}
          />
          {touched.phone && errors.phone && (
            <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* City / Governorate */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.cityLabel}</span>
              <span className="text-red-500 font-bold">* ({isRTL ? 'إلزامي' : 'Required'})</span>
            </label>
          </div>
          <select
            id="checkout-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() => onBlurField('city')}
            className={`w-full bg-surface-container-lowest dark:bg-zinc-950 border p-3 text-xs text-primary dark:text-white focus:outline-none transition-colors cursor-pointer ${
              touched.city && errors.city
                ? 'border-red-500 bg-red-950/10 focus:border-red-500 ring-1 ring-red-500/30'
                : 'border-surface-container dark:border-zinc-700 focus:border-primary dark:focus:border-white'
            }`}
          >
            <option value="">{isRTL ? '-- اختر المحافظة --' : '-- Select Governorate --'}</option>
            {EGYPTIAN_GOVERNORATES.map((gov) => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>
          {touched.city && errors.city && (
            <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.city}</span>
            </p>
          )}
        </div>

        {/* Street Address */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.streetLabel}</span>
              <span className="text-red-500 font-bold">* ({isRTL ? 'إلزامي بالتفصيل' : 'Required in Detail'})</span>
            </label>
            {touched.street && !errors.street && street && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isRTL ? 'مكتمل' : 'Complete'}
              </span>
            )}
          </div>
          <input
            id="checkout-street"
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            onBlur={() => onBlurField('street')}
            placeholder={isRTL ? 'مثال: شارع الجمهورية، عمارة 15، الدور 3، شقة 8' : 'e.g. 18 Gezira St, Zamalek, Building 4, Apt 7'}
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

        {/* Postal Code (Optional) */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-label-bold text-secondary dark:text-zinc-400 uppercase flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t.postalCodeLabel}</span>
              <span className="text-zinc-500 font-normal">({isRTL ? 'اختياري' : 'Optional'})</span>
            </label>
          </div>
          <input
            id="checkout-postalCode"
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder={isRTL ? 'الرمز البريدي (اختياري - مثال: 11511)' : 'Postal Code (Optional - e.g. 11511)'}
            className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs font-mono text-primary dark:text-white focus:outline-none focus:border-primary dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      {/* Google Maps Interactive Modal */}
      <GoogleMapsPickerModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSelectLocation={handleApplyLocation}
        initialLat={latitude || 30.0444}
        initialLng={longitude || 31.2357}
      />
    </div>
  );
};
