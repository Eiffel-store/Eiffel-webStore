import React, { useState, Suspense, lazy } from 'react';
import { MapPin, Crosshair, Sparkles, Loader2, Check } from 'lucide-react';
import { StoreLocation } from '@/types';
import { useLanguage, ImageUploadInput } from '@/shared';
import { locationService, GeocodedAddress } from '@/services/locationService';

// Lazy-Loaded Google Maps Modal
const GoogleMapsPickerModal = lazy(() => import('@/features/checkout/components/GoogleMapsPickerModal').then(m => ({ default: m.GoogleMapsPickerModal })));


interface AdminBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formStore: Omit<StoreLocation, 'id'>;
  setFormStore: React.Dispatch<React.SetStateAction<Omit<StoreLocation, 'id'>>>;
  onSave: (e: React.FormEvent) => void;
}

export const AdminBranchModal: React.FC<AdminBranchModalProps> = ({
  isOpen,
  onClose,
  isEditing,
  formStore,
  setFormStore,
  onSave
}) => {
  const { t, isRTL } = useLanguage();

  const [showMapPicker, setShowMapPicker] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [locationSuccessNotice, setLocationSuccessNotice] = useState<string | null>(null);

  // Convert lat/lng to percentage coordinates on store map
  const calculateCoordinates = (lat: number, lng: number): { x: number; y: number } => {
    const x = Math.max(10, Math.min(90, Math.round(((lng - 28.5) / (34.0 - 28.5)) * 100)));
    const y = Math.max(10, Math.min(90, Math.round(((32.0 - lat) / (32.0 - 27.5)) * 100)));
    return { x: isNaN(x) ? 50 : x, y: isNaN(y) ? 50 : y };
  };

  // Apply resolved location from GPS or Map Picker
  const handleApplyLocation = (loc: GeocodedAddress) => {
    const coords = calculateCoordinates(loc.latitude, loc.longitude);

    setFormStore(prev => ({
      ...prev,
      city: loc.city || loc.governorate || prev.city,
      address: loc.street || loc.formattedAddress || prev.address,
      mapLink: loc.mapUrl || `https://maps.google.com/?q=${loc.latitude},${loc.longitude}`,
      latitude: loc.latitude,
      longitude: loc.longitude,
      coordinates: coords
    }));

    setLocationSuccessNotice(t.adminBranchAddressAutofilledNotice);
    setTimeout(() => setLocationSuccessNotice(null), 4000);
  };

  // Quick 1-click GPS detection
  const handleQuickGps = async () => {
    setIsGpsLoading(true);
    try {
      const coords = await locationService.getCurrentCoordinates();
      const resolved = await locationService.reverseGeocode(coords.latitude, coords.longitude);
      handleApplyLocation(resolved);
    } catch {
      // If direct GPS fails or denied, open map modal to pick location
      setShowMapPicker(true);
    } finally {
      setIsGpsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-zinc-950 border border-zinc-800 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto rounded-lg">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="font-bold text-sm text-white font-editorial flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{isEditing ? t.adminEditBranch : t.adminAddBranch}</span>
            </h3>
          </div>

          {/* Quick Location & Address Auto-Fill Toolbar */}
          <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.adminBranchAutodetect}</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {t.adminOneClickAutofill}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleQuickGps}
                disabled={isGpsLoading}
                className="flex-1 min-w-[140px] px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
                <span>{t.adminDetectGps}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMapPicker(true)}
                className="flex-1 min-w-[140px] px-3 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{t.adminPickOnMap}</span>
              </button>
            </div>

            {locationSuccessNotice && (
              <div className="p-2 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs rounded flex items-center gap-1.5 animate-fade-in font-mono">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{locationSuccessNotice}</span>
              </div>
            )}
          </div>

          <form onSubmit={onSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-1">
                  {t.adminBranchNameAr} *
                </label>
                <input
                  type="text"
                  required
                  value={formStore.name}
                  onChange={(e) => setFormStore({ ...formStore, name: e.target.value })}
                  placeholder="مثال: فرع إيفل الرئيسي - زفتى"
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none focus:border-amber-400 text-right"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-1">
                  {t.adminBranchNameEn} *
                </label>
                <input
                  type="text"
                  required
                  value={formStore.nameEn || ''}
                  onChange={(e) => setFormStore({ ...formStore, nameEn: e.target.value })}
                  placeholder="e.g. EIFFEL Flagship - Zefta"
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-1">
                  {t.adminCityGovernorate} *
                </label>
                <input
                  type="text"
                  required
                  value={formStore.city}
                  onChange={(e) => setFormStore({ ...formStore, city: e.target.value })}
                  placeholder="الغربية / زفتى"
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-1">
                  {t.adminBranchType}
                </label>
                <select
                  value={formStore.type}
                  onChange={(e) => setFormStore({ ...formStore, type: e.target.value as any })}
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none focus:border-amber-400"
                >
                  <option value="Flagship">{isRTL ? 'فرع رئيسي (Flagship)' : 'Flagship (Main Store)'}</option>
                  <option value="Boutique">{isRTL ? 'فرع متجر / محل بيع (Boutique)' : 'Boutique (Retail Branch)'}</option>
                  <option value="Outlet">{isRTL ? 'فرع أوتلت / تخفيضات (Outlet)' : 'Outlet (Discount Store)'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-300 font-bold mb-1">
                {t.adminDetailedAddress} *
              </label>
              <input
                type="text"
                required
                value={formStore.address}
                onChange={(e) => setFormStore({ ...formStore, address: e.target.value })}
                placeholder="مثال: شارع الجيش، برج إيفل، أمام قاعة هوليوود"
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 font-bold mb-1">
                {t.adminWorkingHours} *
              </label>
              <input
                type="text"
                required
                value={formStore.hours}
                onChange={(e) => setFormStore({ ...formStore, hours: e.target.value })}
                placeholder="يومياً: 10:00 ص – 11:00 م"
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-1">
                  {t.phone}
                </label>
                <input
                  type="text"
                  value={formStore.phone}
                  onChange={(e) => setFormStore({ ...formStore, phone: e.target.value })}
                  placeholder="+20 10 2345 6789"
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white font-mono rounded focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-1">
                  {t.emailAddress}
                </label>
                <input
                  type="email"
                  value={formStore.email}
                  onChange={(e) => setFormStore({ ...formStore, email: e.target.value })}
                  placeholder="contact@eiffel.eg"
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Active Status Switch */}
            <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800 rounded">
              <div>
                <span className="block text-xs font-bold text-white">
                  {t.adminBranchActiveStatus}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {t.adminBranchActiveStatusDesc}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formStore.active !== false}
                  onChange={(e) => setFormStore({ ...formStore, active: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Branch Storefront Image Upload (Device Upload + Direct URL) */}
            <ImageUploadInput
              label={t.adminStorefrontImage}
              value={formStore.image || ''}
              onChange={(url) => setFormStore({ ...formStore, image: url })}
              aspectRatio="16/9"
              helpText={t.adminStorefrontImageHelp}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 rounded transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded transition-colors cursor-pointer"
              >
                {isEditing ? t.saveChanges : t.adminAddBranch}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Interactive Google Maps & Egyptian Areas Picker Modal */}
      {showMapPicker && (
        <Suspense fallback={null}>
          <GoogleMapsPickerModal
            isOpen={showMapPicker}
            onClose={() => setShowMapPicker(false)}
            onSelectLocation={handleApplyLocation}
            initialLat={formStore.latitude || 30.7126}
            initialLng={formStore.longitude || 31.2464}
          />
        </Suspense>
      )}
    </>
  );
};
