import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  Check,
  X,
  Loader2,
  ExternalLink,
  Navigation,
  ShieldCheck,
  AlertCircle,
  Link2,
  HelpCircle,
  Building
} from 'lucide-react';
import { useLanguage } from '@/shared';
import { locationService, GeocodedAddress, POPULAR_EGYPT_AREAS } from '@/services/locationService';

interface GoogleMapsPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: GeocodedAddress) => void;
  initialLat?: number;
  initialLng?: number;
}

export const GoogleMapsPickerModal: React.FC<GoogleMapsPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  initialLat = 30.0444, // Default Cairo Center
  initialLng = 31.2357
}) => {
  const { t, isRTL } = useLanguage();

  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);

  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [geocodedData, setGeocodedData] = useState<GeocodedAddress | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editable fields in modal
  const [customStreet, setCustomStreet] = useState('');
  const [customGov, setCustomGov] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ displayName: string; latitude: number; longitude: number; governorate?: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Google Maps Link Paste State
  const [pastedUrl, setPastedUrl] = useState('');

  // Active Tab
  const [activeMode, setActiveMode] = useState<'quick' | 'search' | 'link'>('quick');

  const mapFrameRef = useRef<HTMLIFrameElement | null>(null);

  // Resolve address when coordinates change
  const fetchAddress = async (latitude: number, longitude: number) => {
    setIsResolvingAddress(true);
    setErrorMsg(null);
    try {
      const data = await locationService.reverseGeocode(latitude, longitude);
      setGeocodedData(data);
      setCustomStreet(data.street);
      setCustomGov(data.governorate);
    } catch {
      setErrorMsg(isRTL ? 'تعذر قراءة العنوان تلقائياً، يمكنك كتابة تفاصيل الشارع أدناه.' : 'Failed to auto-resolve address details.');
    } finally {
      setIsResolvingAddress(false);
    }
  };

  // On open or initial coords change
  useEffect(() => {
    if (isOpen) {
      setLat(initialLat);
      setLng(initialLng);
      fetchAddress(initialLat, initialLng);
    }
  }, [isOpen, initialLat, initialLng]);

  // Handle GPS detection
  const handleDetectGps = async () => {
    setIsDetectingGps(true);
    setErrorMsg(null);
    try {
      const coords = await locationService.getCurrentCoordinates();
      setLat(coords.latitude);
      setLng(coords.longitude);
      await fetchAddress(coords.latitude, coords.longitude);
    } catch (err: any) {
      setErrorMsg(err?.message || (isRTL ? 'تعذر الوصول إلى الـ GPS. يمكنك اختيار منطقتك من القائمة السريعة أدناه.' : 'GPS location unavailable. Please select your region below.'));
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Search places
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setErrorMsg(null);
    try {
      const results = await locationService.searchEgyptLocations(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setErrorMsg(isRTL ? 'لم يتم العثور على نتائج، جرب كتابة اسم المحافظة أو الحي.' : 'No locations found. Try searching for city or street.');
      }
    } catch {
      setErrorMsg(isRTL ? 'حدث خطأ أثناء البحث.' : 'Error searching locations.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPreset = (preset: typeof POPULAR_EGYPT_AREAS[0]) => {
    setLat(preset.lat);
    setLng(preset.lng);
    setSearchResults([]);
    setSearchQuery('');
    fetchAddress(preset.lat, preset.lng);
  };

  const handleSelectSearchResult = (result: { latitude: number; longitude: number; governorate?: string }) => {
    setLat(result.latitude);
    setLng(result.longitude);
    setSearchResults([]);
    setSearchQuery('');
    fetchAddress(result.latitude, result.longitude);
  };

  // Parse pasted Google Maps link
  const handleParsePastedUrl = () => {
    if (!pastedUrl.trim()) return;
    const parsed = locationService.parseGoogleMapsInput(pastedUrl);
    if (parsed) {
      setLat(parsed.latitude);
      setLng(parsed.longitude);
      fetchAddress(parsed.latitude, parsed.longitude);
      setPastedUrl('');
      setErrorMsg(null);
    } else {
      setErrorMsg(
        isRTL
          ? 'تعذر قراءة الإحداثيات من هذا الرابط. يرجى التأكد من نسخ رابط خرائط Google الذي يحتوي على إحداثيات (مثال: ?q=30.7126,31.2464 أو كتابة الإحداثيات مباشرة).'
          : 'Could not parse coordinates from this link. Try copying full Google Maps link or coordinates.'
      );
    }
  };

  // Confirm selection and pass to checkout
  const handleConfirm = () => {
    if (geocodedData) {
      onSelectLocation({
        ...geocodedData,
        latitude: lat,
        longitude: lng,
        mapUrl: `https://maps.google.com/?q=${lat},${lng}`,
        street: customStreet || geocodedData.street,
        governorate: customGov || geocodedData.governorate
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  // Map view URL
  const bboxPadding = 0.008;
  const bbox = `${lng - bboxPadding},${lat - bboxPadding},${lng + bboxPadding},${lat + bboxPadding}`;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-base sm:text-lg font-bold text-white tracking-wide">
                {t.mapPickerModalTitle}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {t.mapPickerModalDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* PC / WiFi Note */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <p className="leading-relaxed">
              {t.mapPickerPcNote}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveMode('quick')}
              className={`flex-1 py-1.5 px-2.5 rounded font-bold transition-colors ${
                activeMode === 'quick' ? 'bg-white text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.mapQuickRegions}
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('search')}
              className={`flex-1 py-1.5 px-2.5 rounded font-bold transition-colors ${
                activeMode === 'search' ? 'bg-white text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.mapSearchStreet}
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('link')}
              className={`flex-1 py-1.5 px-2.5 rounded font-bold transition-colors ${
                activeMode === 'link' ? 'bg-white text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.mapGoogleMapsLink}
            </button>
          </div>

          {/* Tab 1: Quick Popular Areas */}
          {activeMode === 'quick' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-bold">
                  {t.mapQuickRegions}:
                </span>
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={isDetectingGps}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  {isDetectingGps ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3" />}
                  <span>{t.detectGps}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                {POPULAR_EGYPT_AREAS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-400/50 rounded text-left text-xs transition-colors flex items-center gap-1.5 cursor-pointer group"
                  >
                    <MapPin className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="text-zinc-200 truncate text-[11px] font-medium">{preset.nameAr}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Search Box */}
          {activeMode === 'search' && (
            <div className="space-y-2">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.mapSearchPlaceholder}
                    className="w-full bg-zinc-900 border border-zinc-700 pl-8 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-3" />
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs rounded font-bold transition-colors disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t.search}
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-700 rounded-lg divide-y divide-zinc-800 max-h-36 overflow-y-auto">
                  {searchResults.map((r, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSearchResult(r)}
                      className="w-full text-left p-2 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{r.displayName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Paste Google Maps Link */}
          {activeMode === 'link' && (
            <div className="space-y-2">
              <label className="block text-[11px] text-zinc-400 font-bold">
                {t.mapPasteLinkPrompt}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pastedUrl}
                  onChange={(e) => setPastedUrl(e.target.value)}
                  placeholder="e.g. https://maps.google.com/?q=30.7126,31.2464"
                  className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-mono"
                />
                <button
                  type="button"
                  onClick={handleParsePastedUrl}
                  disabled={!pastedUrl.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{t.apply}</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 bg-red-950/40 border border-red-500/40 text-red-300 text-xs rounded-lg flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Interactive Map Container */}
          <div className="relative w-full h-52 sm:h-56 rounded-lg overflow-hidden border border-zinc-700 shadow-inner bg-zinc-900">
            <iframe
              ref={mapFrameRef}
              src={mapEmbedUrl}
              title="Delivery Location Map"
              className="w-full h-full border-0 pointer-events-auto"
            />

            {/* Direct Google Maps Link badge */}
            <div className="absolute top-2 right-2 z-10">
              <a
                href={`https://maps.google.com/?q=${lat},${lng}`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-black/80 hover:bg-black text-amber-400 border border-amber-400/40 rounded text-[10px] font-mono flex items-center gap-1.5 backdrop-blur-sm shadow transition-colors"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Live GPS Coordinates Tag */}
            <div className="absolute bottom-2 left-2 z-10 px-2.5 py-1 bg-black/80 text-zinc-300 rounded text-[10px] font-mono border border-zinc-800 backdrop-blur-sm">
              GPS: {lat.toFixed(5)}, {lng.toFixed(5)}
            </div>
          </div>

          {/* Detected / Editable Address Form */}
          <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.mapConfirmedDetails}</span>
              </span>
              {isResolvingAddress && (
                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                  <Loader2 className="w-3 h-3 animate-spin" /> {t.loading}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="block text-[10px] text-zinc-400 font-bold mb-1">
                  {t.mapSelectedGovernorate}
                </label>
                <input
                  type="text"
                  value={customGov}
                  onChange={(e) => setCustomGov(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 px-2.5 py-1.5 text-xs text-white rounded focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 font-bold mb-1">
                  {t.mapStreetDetailsLabel}
                </label>
                <input
                  type="text"
                  value={customStreet}
                  onChange={(e) => setCustomStreet(e.target.value)}
                  placeholder={t.streetDetailedPlaceholder}
                  className="w-full bg-zinc-950 border border-zinc-700 px-2.5 py-1.5 text-xs text-white rounded focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/70 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded transition-colors"
          >
            {t.cancel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 font-label-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t.mapConfirmLocation}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
