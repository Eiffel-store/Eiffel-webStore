import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/shared';
import { locationService, GeocodedAddress, POPULAR_EGYPT_AREAS } from '@/services/locationService';
import {
  MapPickerHeader,
  MapPickerTabs,
  MapPickerTabMode,
  MapQuickAreasTab,
  MapSearchTab,
  MapLinkPasteTab,
  MapPreviewFrame,
  MapAddressDetailsForm,
  MapPickerFooter,
} from './map-picker';

export interface GoogleMapsPickerModalProps {
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
  const [activeMode, setActiveMode] = useState<MapPickerTabMode>('quick');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <MapPickerHeader onClose={onClose} />

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
          <MapPickerTabs
            activeMode={activeMode}
            onModeChange={setActiveMode}
          />

          {/* Tab 1: Quick Popular Areas */}
          {activeMode === 'quick' && (
            <MapQuickAreasTab
              onSelectPreset={handleSelectPreset}
              onDetectGps={handleDetectGps}
              isDetectingGps={isDetectingGps}
            />
          )}

          {/* Tab 2: Search Box */}
          {activeMode === 'search' && (
            <MapSearchTab
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearchSubmit={handleSearch}
              isSearching={isSearching}
              searchResults={searchResults}
              onSelectSearchResult={handleSelectSearchResult}
            />
          )}

          {/* Tab 3: Paste Google Maps Link */}
          {activeMode === 'link' && (
            <MapLinkPasteTab
              pastedUrl={pastedUrl}
              onPastedUrlChange={setPastedUrl}
              onParsePastedUrl={handleParsePastedUrl}
            />
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 bg-red-950/40 border border-red-500/40 text-red-300 text-xs rounded-lg flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Interactive Map Container */}
          <MapPreviewFrame
            ref={mapFrameRef}
            lat={lat}
            lng={lng}
          />

          {/* Detected / Editable Address Form */}
          <MapAddressDetailsForm
            customGov={customGov}
            onCustomGovChange={setCustomGov}
            customStreet={customStreet}
            onCustomStreetChange={setCustomStreet}
            isResolvingAddress={isResolvingAddress}
          />
        </div>

        {/* Footer Actions */}
        <MapPickerFooter
          onClose={onClose}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};
