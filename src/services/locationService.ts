/**
 * Enhanced Location & Geocoding Service for Eiffel WebStore
 * Supports browser GPS, Google Maps link parsing, Egyptian Places Directory, and Reverse Geocoding.
 */

export interface GeocodedAddress {
  latitude: number;
  longitude: number;
  mapUrl: string;
  governorate: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  formattedAddress: string;
}

// Egyptian governorates matching dictionary
const GOVERNORATE_MATCHERS: Record<string, string> = {
  cairo: 'Cairo (القاهرة)',
  القاهرة: 'Cairo (القاهرة)',
  giza: 'Giza (الجيزة)',
  الجيزة: 'Giza (الجيزة)',
  alexandria: 'Alexandria (الإسكندرية)',
  الإسكندرية: 'Alexandria (الإسكندرية)',
  qalyubia: 'Qalyubia (القليوبية)',
  القليوبية: 'Qalyubia (القليوبية)',
  gharbia: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)',
  الغربية: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)',
  zifta: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)',
  زفتى: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)',
  tanta: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)',
  طنطا: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)',
  nahtay: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)',
  نهطاي: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)',
  mahalla: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)',
  المحلة: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)',
  dakahlia: 'Dakahlia / Mansoura (الدقهلية والمنصورة)',
  الدقهلية: 'Dakahlia / Mansoura (الدقهلية والمنصورة)',
  mansoura: 'Dakahlia / Mansoura (الدقهلية والمنصورة)',
  المنصورة: 'Dakahlia / Mansoura (الدقهلية والمنصورة)',
  sharqia: 'Sharqia / Zagazig (الشرقية والزقازيق)',
  الشرقية: 'Sharqia / Zagazig (الشرقية والزقازيق)',
  zagazig: 'Sharqia / Zagazig (الشرقية والزقازيق)',
  الزقازيق: 'Sharqia / Zagazig (الشرقية والزقازيق)',
  monufia: 'Monufia (المنوفية)',
  المنوفية: 'Monufia (المنوفية)',
  shibin: 'Monufia (المنوفية)',
  'شبين الكوم': 'Monufia (المنوفية)',
  beheira: 'Beheira (البحيرة)',
  البحيرة: 'Beheira (البحيرة)',
  damanhour: 'Beheira (البحيرة)',
  دمنهور: 'Beheira (البحيرة)',
  'kafr el sheikh': 'Kafr El Sheikh (كفر الشيخ)',
  'كفر الشيخ': 'Kafr El Sheikh (كفر الشيخ)',
  damietta: 'Damietta (دمياط)',
  دمياط: 'Damietta (دمياط)',
  'port said': 'Port Said (بورسعيد)',
  بورسعيد: 'Port Said (بورسعيد)',
  ismailia: 'Ismailia (الإسماعيلية)',
  الإسماعيلية: 'Ismailia (الإسماعيلية)',
  suez: 'Suez (السويس)',
  السويس: 'Suez (السويس)',
  'red sea': 'Red Sea / Hurghada & Gouna (البحر الأحمر والغردقة والجونة)',
  'البحر الأحمر': 'Red Sea / Hurghada & Gouna (البحر الأحمر والغردقة والجونة)',
  hurghada: 'Red Sea / Hurghada & Gouna (البحر الأحمر والغردقة والجونة)',
  الغردقة: 'Red Sea / Hurghada & Gouna (البحر الأحمر والغردقة والجونة)',
  gouna: 'Red Sea / Hurghada & Gouna (البحر الأحمر والغردقة والجونة)',
  الجونة: 'Red Sea / Hurghada & Gouna (البحر الأحمر والغردقة والجونة)',
  'south sinai': 'South Sinai / Sharm El Sheikh (جنوب سيناء وشرم الشيخ)',
  'جنوب سيناء': 'South Sinai / Sharm El Sheikh (جنوب سيناء وشرم الشيخ)',
  'sharm el sheikh': 'South Sinai / Sharm El Sheikh (جنوب سيناء وشرم الشيخ)',
  'شرم الشيخ': 'South Sinai / Sharm El Sheikh (جنوب سيناء وشرم الشيخ)',
  dahab: 'South Sinai / Sharm El Sheikh (جنوب سيناء وشرم الشيخ)',
  دهب: 'South Sinai / Sharm El Sheikh (جنوب سيناء وشرم الشيخ)',
  matrouh: 'Matrouh & North Coast (مطروح والساحل الشمالي)',
  مطروح: 'Matrouh & North Coast (مطروح والساحل الشمالي)',
  sahel: 'Matrouh & North Coast (مطروح والساحل الشمالي)',
  'الساحل الشمالي': 'Matrouh & North Coast (مطروح والساحل الشمالي)',
  faiyum: 'Faiyum (الفيوم)',
  الفيوم: 'Faiyum (الفيوم)',
  'beni suef': 'Beni Suef (بني سويف)',
  'بني سويف': 'Beni Suef (بني سويف)',
  minya: 'Minya (المنيا)',
  المنيا: 'Minya (المنيا)',
  asyut: 'Asyut (أسيوط)',
  أسيوط: 'Asyut (أسيوط)',
  sohag: 'Sohag (سوهاج)',
  سوهاج: 'Sohag (سوهاج)',
  qena: 'Qena (قنا)',
  قنا: 'Qena (قنا)',
  luxor: 'Luxor (الأقصر)',
  الأقصر: 'Luxor (الأقصر)',
  aswan: 'Aswan (أسوان)',
  أسوان: 'Aswan (أسوان)',
  'new valley': 'New Valley (الوادي الجديد)',
  'الوادي الجديد': 'New Valley (الوادي الجديد)'
};

export const POPULAR_EGYPT_AREAS = [
  // Gharbia
  { nameAr: 'الغربية - زفتى', nameEn: 'Gharbia - Zifta', gov: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)', lat: 30.7126, lng: 31.2464 },
  { nameAr: 'الغربية - نهطاي (زفتى)', nameEn: 'Gharbia - Nahtay', gov: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)', lat: 30.7410, lng: 31.2310 },
  { nameAr: 'الغربية - طنطا (شارع البحر / النحاس)', nameEn: 'Gharbia - Tanta', gov: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)', lat: 30.7865, lng: 31.0004 },
  { nameAr: 'الغربية - المحلة الكبرى', nameEn: 'Gharbia - El Mahalla', gov: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)', lat: 30.9706, lng: 31.1669 },
  { nameAr: 'الغربية - كفر الزيات', nameEn: 'Gharbia - Kafr El Zayat', gov: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)', lat: 30.8267, lng: 30.8173 },
  { nameAr: 'الغربية - السنطة', nameEn: 'Gharbia - El Santa', gov: 'Gharbia / Tanta & Zifta (الغربية وطنطا وزفتى)', lat: 30.7516, lng: 31.1397 },

  // Cairo
  { nameAr: 'القاهرة - التجمع الخامس والقاهرة الجديدة', nameEn: 'Cairo - New Cairo & 5th Settlement', gov: 'Cairo (القاهرة)', lat: 30.0074, lng: 31.4913 },
  { nameAr: 'القاهرة - مدينة نصر', nameEn: 'Cairo - Nasr City', gov: 'Cairo (القاهرة)', lat: 30.0566, lng: 31.3301 },
  { nameAr: 'القاهرة - المعادي ودجلة', nameEn: 'Cairo - Maadi & Degla', gov: 'Cairo (القاهرة)', lat: 29.9602, lng: 31.2569 },
  { nameAr: 'القاهرة - مصر الجديدة (الكوربة / روكسي)', nameEn: 'Cairo - Heliopolis & Korba', gov: 'Cairo (القاهرة)', lat: 30.0889, lng: 31.3285 },
  { nameAr: 'القاهرة - الزمالك', nameEn: 'Cairo - Zamalek', gov: 'Cairo (القاهرة)', lat: 30.0617, lng: 31.2198 },
  { nameAr: 'القاهرة - وسط البلد والتحرير', nameEn: 'Cairo - Downtown', gov: 'Cairo (القاهرة)', lat: 30.0444, lng: 31.2357 },
  { nameAr: 'القاهرة - الرحاب ومدينتي', nameEn: 'Cairo - Rehab & Madinaty', gov: 'Cairo (القاهرة)', lat: 30.0583, lng: 31.4986 },
  { nameAr: 'القاهرة - الشروق وبدر والعاصمة الإدارية', nameEn: 'Cairo - Shorouk & New Capital', gov: 'Cairo (القاهرة)', lat: 30.1342, lng: 31.6215 },
  { nameAr: 'القاهرة - شبرا ومصر القديمة', nameEn: 'Cairo - Shoubra', gov: 'Cairo (القاهرة)', lat: 30.0818, lng: 31.2464 },

  // Giza
  { nameAr: 'الجيزة - الشيخ زايد', nameEn: 'Giza - Sheikh Zayed', gov: 'Giza (الجيزة)', lat: 30.0538, lng: 30.9859 },
  { nameAr: 'الجيزة - 6 أكتوبر', nameEn: 'Giza - 6th of October City', gov: 'Giza (الجيزة)', lat: 29.9722, lng: 30.9419 },
  { nameAr: 'الجيزة - المهندسين والدقي', nameEn: 'Giza - Mohandessin & Dokki', gov: 'Giza (الجيزة)', lat: 30.0504, lng: 31.2001 },
  { nameAr: 'الجيزة - الهرم وفيصل', nameEn: 'Giza - Haram & Faisal', gov: 'Giza (الجيزة)', lat: 29.9972, lng: 31.1558 },
  { nameAr: 'الجيزة - حدائق الأهرام وأكتوبر الجديدة', nameEn: 'Giza - Pyramids Gardens', gov: 'Giza (الجيزة)', lat: 29.9678, lng: 31.1122 },

  // Alexandria
  { nameAr: 'الإسكندرية - سموحة وسيدي جابر', nameEn: 'Alexandria - Smouha & Sidi Gaber', gov: 'Alexandria (الإسكندرية)', lat: 31.2156, lng: 29.9553 },
  { nameAr: 'الإسكندرية - ميامي ولوران وجليم', nameEn: 'Alexandria - Miami & Gleem', gov: 'Alexandria (الإسكندرية)', lat: 31.2586, lng: 29.9886 },
  { nameAr: 'الإسكندرية - محطة الرمل والمنشية', nameEn: 'Alexandria - Raml Station', gov: 'Alexandria (الإسكندرية)', lat: 31.2001, lng: 29.9001 },

  // Mansoura / Dakahlia
  { nameAr: 'الدقهلية - المنصورة (المشاية / الجمهورية)', nameEn: 'Dakahlia - Mansoura', gov: 'Dakahlia / Mansoura (الدقهلية والمنصورة)', lat: 31.0409, lng: 31.3785 },
  { nameAr: 'الدقهلية - ميت غمر', nameEn: 'Dakahlia - Mit Ghamr', gov: 'Dakahlia / Mansoura (الدقهلية والمنصورة)', lat: 30.7194, lng: 31.2572 },

  // Qalyubia
  { nameAr: 'القليوبية - بنها', nameEn: 'Qalyubia - Banha', gov: 'Qalyubia (القليوبية)', lat: 30.4660, lng: 31.1853 },
  { nameAr: 'القليوبية - شبرا الخيمة والعبور', nameEn: 'Qalyubia - Obour & Shoubra El Kheima', gov: 'Qalyubia (القليوبية)', lat: 30.2223, lng: 31.4673 },

  // Sharqia
  { nameAr: 'الشرقية - الزقازيق', nameEn: 'Sharqia - Zagazig', gov: 'Sharqia / Zagazig (الشرقية والزقازيق)', lat: 30.5877, lng: 31.5020 },
  { nameAr: 'الشرقية - العاشر من رمضان', nameEn: 'Sharqia - 10th of Ramadan City', gov: 'Sharqia / Zagazig (الشرقية والزقازيق)', lat: 30.3015, lng: 31.7431 },

  // Monufia
  { nameAr: 'المنوفية - شبين الكوم وقويسنا', nameEn: 'Monufia - Shibin El Kom & Quesna', gov: 'Monufia (المنوفية)', lat: 30.5522, lng: 31.0097 }
];

function matchGovernorate(text: string): string {
  if (!text) return 'Cairo (القاهرة)';
  const lower = text.toLowerCase().trim();

  for (const [key, gov] of Object.entries(GOVERNORATE_MATCHERS)) {
    if (lower.includes(key)) {
      return gov;
    }
  }
  return 'Cairo (القاهرة)';
}

export const locationService = {
  /**
   * Request user GPS position from browser navigator
   */
  getCurrentCoordinates(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('الـ GPS غير مدعوم في متصفحك.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          let msg = 'تعذر الوصول للموقع بدقة GPS.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'تم رفض إذن الوصول للموقع. يرجى تفعيل إذن الموقع (Location) في المتصفح أو اختيار منطقتك من القائمة.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'إشارة الموقع غير متوفرة حالياً.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'انتهت مهلة طلب الموقع.';
          }
          reject(new Error(msg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  },

  /**
   * Parse coordinates from Google Maps share URL or raw text
   * Examples:
   * - https://maps.google.com/?q=30.7126,31.2464
   * - https://maps.app.goo.gl/...
   * - 30.7126, 31.2464
   */
  parseGoogleMapsInput(input: string): { latitude: number; longitude: number } | null {
    if (!input || !input.trim()) return null;
    const clean = input.trim();

    // 1. Raw Coordinates: "30.7126, 31.2464" or "30.7126 31.2464"
    const coordMatch = clean.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
    if (coordMatch && coordMatch[1] && coordMatch[2]) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (lat >= 20 && lat <= 35 && lng >= 24 && lng <= 38) { // Egypt bounding box
        return { latitude: lat, longitude: lng };
      }
    }

    // 2. Google Maps URL query: ?q=lat,lng or @lat,lng
    const queryMatch = clean.match(/(?:q=|@)(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (queryMatch && queryMatch[1] && queryMatch[2]) {
      return {
        latitude: parseFloat(queryMatch[1]),
        longitude: parseFloat(queryMatch[2])
      };
    }

    return null;
  },

  /**
   * Reverse Geocode coordinates to physical address
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodedAddress> {
    const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

    // Check if matching any known popular Egypt area first for extreme precision
    const matchedPreset = POPULAR_EGYPT_AREAS.find(p => {
      const dLat = Math.abs(p.lat - latitude);
      const dLng = Math.abs(p.lng - longitude);
      return dLat < 0.03 && dLng < 0.03; // Within ~3km
    });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=ar,en`,
        {
          headers: {
            'User-Agent': 'EiffelStore-Client/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding service unavailable');
      }

      const data = await response.json();
      const addr = data.address || {};

      const state = addr.state || addr.province || addr.governorate || '';
      const city = addr.city || addr.town || addr.municipality || addr.village || addr.county || '';
      const district = addr.suburb || addr.neighbourhood || addr.city_district || addr.quarter || addr.hamlet || '';
      const road = addr.road || addr.street || addr.footway || addr.path || '';
      const houseNumber = addr.house_number || '';
      const postalCode = addr.postcode || '';

      const matchedGov = matchedPreset ? matchedPreset.gov : matchGovernorate(`${state} ${city} ${district}`);

      // Compose detailed street line
      const streetParts = [];
      if (road) streetParts.push(`شارع ${road}`);
      if (houseNumber) streetParts.push(`عمارة / رقم ${houseNumber}`);
      if (district) streetParts.push(`منطقة / حي ${district}`);
      if (city && city !== state && !streetParts.some(p => p.includes(city))) streetParts.push(city);

      let streetFormatted = streetParts.length > 0
        ? streetParts.join('، ')
        : (matchedPreset ? matchedPreset.nameAr : (data.display_name ? data.display_name.split('،').slice(0, 3).join('، ') : ''));

      if (!streetFormatted) {
        streetFormatted = `موقع محدد (إحداثيات: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
      }

      return {
        latitude,
        longitude,
        mapUrl,
        governorate: matchedGov,
        city: city || district || (matchedPreset ? matchedPreset.nameAr : 'القاهرة'),
        district,
        street: streetFormatted,
        postalCode,
        formattedAddress: data.display_name || streetFormatted
      };
    } catch (err) {
      console.warn('Geocoding fallback:', err);
      // Clean fallback
      return {
        latitude,
        longitude,
        mapUrl,
        governorate: matchedPreset ? matchedPreset.gov : 'Cairo (القاهرة)',
        city: matchedPreset ? matchedPreset.nameAr : 'Cairo',
        district: '',
        street: matchedPreset ? matchedPreset.nameAr : `موقع محدد عبر الخريطة (GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
        postalCode: '',
        formattedAddress: `GPS Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
      };
    }
  },

  /**
   * Search for locations in Egypt by text
   */
  async searchEgyptLocations(query: string): Promise<Array<{
    displayName: string;
    latitude: number;
    longitude: number;
    governorate?: string;
  }>> {
    if (!query.trim()) return [];
    const cleanQuery = query.trim().toLowerCase();

    // 1. Search local high-speed preset database first
    const localMatches = POPULAR_EGYPT_AREAS.filter(
      p => p.nameAr.toLowerCase().includes(cleanQuery) || p.nameEn.toLowerCase().includes(cleanQuery)
    ).map(p => ({
      displayName: `📍 ${p.nameAr} (${p.nameEn})`,
      latitude: p.lat,
      longitude: p.lng,
      governorate: p.gov
    }));

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ' Egypt'
        )}&countrycodes=eg&limit=6&accept-language=ar,en`,
        {
          headers: {
            'User-Agent': 'EiffelStore-Client/1.0'
          }
        }
      );

      if (!response.ok) return localMatches;
      const results = await response.json();

      const apiMatches = results.map((item: { display_name: string; lat: string; lon: string }) => ({
        displayName: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }));

      // Combine local exact matches + API results without duplicates
      return [...localMatches, ...apiMatches].slice(0, 8);
    } catch {
      return localMatches;
    }
  }
};
