import React, { useState, useEffect, Suspense, lazy } from 'react';
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
import { locationService, GeocodedAddress } from '@/services/locationService';
import { Address, UserProfile } from '@/types';

// Lazy-Loaded Google Maps & Coordinates Picker Modal
const GoogleMapsPickerModal = lazy(() => import('./GoogleMapsPickerModal').then(m => ({ default: m.GoogleMapsPickerModal })));


import { EGYPTIAN_GOVERNORATES } from '../constants';
export { EGYPTIAN_GOVERNORATES };

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
  currentUser?: UserProfile | null;
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
  isLoggedIn?: boolean;
  saveAddressToAccount?: boolean;
  setSaveAddressToAccount?: (val: boolean) => void;
}

export const CheckoutContactForm: React.FC<CheckoutContactFormProps> = ({
  addresses = [],
  currentUser,
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
  onBlurField,
  isLoggedIn = false,
  saveAddressToAccount = true,
  setSaveAddressToAccount
}) => {
  const { t, language } = useLanguage();
  const [showMapModal, setShowMapModal] = useState(false);
  const [isInstantGpsLoading, setIsInstantGpsLoading] = useState(false);
  const [gpsSuccessNotice, setGpsSuccessNotice] = useState<string | null>(null);

  // Address Selection State
  const hasSavedAddresses = Boolean(addresses && addresses.length > 0);
  const defaultAddress = addresses?.find(a => a.isDefault) || addresses?.[0];
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    hasSavedAddresses && defaultAddress ? defaultAddress.id : 'new'
  );

  // Automatically select default address when addresses are loaded
  useEffect(() => {
    if (addresses && addresses.length > 0 && selectedAddressId === 'new') {
      const def = addresses.find(a => a.isDefault) || addresses[0];
      if (def) {
        handleSelectAddress(def);
      }
    }
  }, [addresses]);

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
      t.addressAppliedSuccess.replace('{address}', `${addr.street} - ${addr.city}`)
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
    setGpsSuccessNotice(t.gpsLocationSuccess);
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
            {t.chooseSavedAddressOrNew}
          </p>
        </div>

        {/* GPS / Google Maps Auto-Fill Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickGps}
            disabled={isInstantGpsLoading}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50 cursor-pointer"
            title={t.detectGps}
          >
            {isInstantGpsLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-emerald-100" />
            )}
            <span>{t.detectGps}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            title={t.mapPicker}
          >
            <Map className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.mapPicker}</span>
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
              <span>{t.selectDeliveryAddress}</span>
            </label>
            <span className="text-[11px] font-mono text-secondary dark:text-zinc-400">
              {addresses.length} {t.savedAddressesCount}
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
                              ? t.homeType
                              : addr.type === 'Work'
                              ? t.workType
                              : t.otherType}
                          </span>
                        </div>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-primary text-white dark:bg-white dark:text-black uppercase">
                          {t.defaultBadgeText}
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
                      <span>{t.pinnedOnMap}</span>
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
                {t.useDifferentOrNewAddress}
              </span>
              <span className="text-[10px] text-secondary dark:text-zinc-400">
                {t.enterNewAddressManualOrMap}
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
              {t.gpsCoordinatesLinked}
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

      {/* Contact Information: Verified Recipient Card (Logged-in) or Inputs (Guest) */}
      {isLoggedIn && currentUser ? (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800 rounded-xl space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{language === 'ar' ? 'بيانات المستلم المعتمدة بحسابك' : 'Verified Recipient Profile'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-mono">
                    {language === 'ar' ? 'حساب موثق ✓' : 'Verified ✓'}
                  </span>
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {language === 'ar' ? 'سيتم إصدار الفاتورة وتتبع الشحنة والتواصل مع المندوب بهذه البيانات:' : 'Order updates and courier contact will use these details:'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="flex items-center gap-2.5 bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
              <User className="w-4 h-4 text-amber-400/80 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-zinc-500 block">{language === 'ar' ? 'الاسم' : 'Name'}</span>
                <span className="font-bold text-white truncate block text-xs">{currentUser.name || 'عميل إيفل'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80 font-mono">
              <Phone className="w-4 h-4 text-amber-400/80 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-zinc-500 block font-sans">{language === 'ar' ? 'الموبايل' : 'Phone'}</span>
                <span className="font-bold text-amber-300 truncate block text-xs">
                  {currentUser.phone || phone || (language === 'ar' ? 'يرجى كتابة الرقم بالأسفل' : 'Please provide below')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80 font-mono">
              <Mail className="w-4 h-4 text-amber-400/80 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-zinc-500 block font-sans">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
                <span className="font-medium text-zinc-300 truncate block text-[11px]">{currentUser.email || '—'}</span>
              </div>
            </div>
          </div>

          {/* If user profile has no valid phone yet, prompt for delivery phone */}
          {(!currentUser.phone || currentUser.phone.trim().length < 10) && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-label-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ar' ? 'رقم الموبايل المصري (لتواصل المندوب وتأكيد الشحنة)' : 'Mobile Phone (for delivery)'}</span>
                  <span className="text-red-400 font-bold">* ({t.required})</span>
                </label>
              </div>
              <input
                id="checkout-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => onBlurField('phone')}
                placeholder="010XXXXXXXX"
                className={`w-full bg-zinc-950 border p-3 text-xs font-mono text-white rounded focus:outline-none transition-colors ${
                  touched.phone && errors.phone
                    ? 'border-red-500 bg-red-950/10 focus:border-red-500 ring-1 ring-red-500/30'
                    : 'border-zinc-700 focus:border-amber-400'
                }`}
              />
              {touched.phone && errors.phone && (
                <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Guest Inputs */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t.emailLabel}</span>
                <span className="text-red-500 font-bold">* ({t.required})</span>
              </label>
              {touched.email && !errors.email && email && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" /> {t.valid}
                </span>
              )}
            </div>
            <input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => onBlurField('email')}
              placeholder="name@example.com"
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
                <span className="text-red-500 font-bold">* ({t.required})</span>
              </label>
              {touched.firstName && !errors.firstName && firstName && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" /> {t.valid}
                </span>
              )}
            </div>
            <input
              id="checkout-firstname"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => onBlurField('firstName')}
              placeholder={t.firstNameLabel}
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
                <span className="text-red-500 font-bold">* ({t.required})</span>
              </label>
              {touched.lastName && !errors.lastName && lastName && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" /> {t.valid}
                </span>
              )}
            </div>
            <input
              id="checkout-lastname"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => onBlurField('lastName')}
              placeholder={t.lastNameLabel}
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
                <span className="text-red-500 font-bold">* ({t.required})</span>
              </label>
              {touched.phone && !errors.phone && phone && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" /> {t.valid}
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
                placeholder="01012345678"
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
        </div>
      )}

      {/* Delivery Address Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Governorate / City */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-label-bold text-primary dark:text-zinc-200 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.governorateCity}</span>
              <span className="text-red-500 font-bold">* ({t.required})</span>
            </label>
            {city && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {t.selected}
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
              <span>{t.postalCodeLabel} ({t.optional})</span>
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
              <span>{t.streetDetailedLabel}</span>
              <span className="text-red-500 font-bold">* ({t.required})</span>
            </label>
            {touched.street && !errors.street && street && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {t.complete}
              </span>
            )}
          </div>
          <textarea
            id="checkout-street"
            rows={2}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            onBlur={() => onBlurField('street')}
            placeholder={t.streetDetailedPlaceholder}
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

        {/* Save Address to Profile Checkbox (If logged in & entering new address) */}
        {isLoggedIn && selectedAddressId === 'new' && setSaveAddressToAccount && (
          <div className="sm:col-span-2 pt-1">
            <label className="flex items-start gap-2.5 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveAddressToAccount}
                onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-400 bg-zinc-900 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-primary dark:text-zinc-200 block">
                  {t.saveAddressToProfile}
                </span>
                <span className="text-[11px] text-secondary dark:text-zinc-400 block">
                  {t.saveAddressToProfileDesc}
                </span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Google Maps Interactive Picker Modal */}
      {showMapModal && (
        <Suspense fallback={null}>
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
        </Suspense>
      )}
    </div>
  );
};
