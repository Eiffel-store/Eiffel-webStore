export interface GarmentPresetItem {
  ar: string;
  en: string;
}

export interface DescriptionTemplateItem {
  id: string;
  nameAr: string;
  nameEn: string;
  textAr: string;
  textEn: string;
}

export const FABRIC_COMPOSITION_PRESETS: GarmentPresetItem[] = [
  { ar: '100% قطن مصري فاخر (280 GSM)', en: '100% Luxury Egyptian Cotton (280 GSM)' },
  { ar: 'جبردين مستورد عالي الكثافة', en: 'Heavyweight Imported Gabardine' },
  { ar: 'مزيج كتان وحرير طبيعي فاخر', en: 'Natural Linen & Silk Blend' },
  { ar: 'ميلتون قطني مبطن دافئ (360 GSM)', en: 'Warm Brushed Cotton Fleece (360 GSM)' },
  { ar: 'صوف إيطالي نقي 100%', en: '100% Pure Italian Wool' },
  { ar: 'بيكيه قطني ممتاز عالي الجودة', en: 'Premium Cotton Piqué Knit' },
  { ar: 'دينيم قطني ياباني متين', en: 'Durable Japanese Cotton Denim' },
  { ar: 'قطن وفيسكوز ناعم منسوج', en: 'Soft Weave Cotton & Viscose' },
  { ar: 'جلد طبيعي فاخر 100%', en: '100% Premium Genuine Leather' }
];

export const FIT_SILHOUETTE_PRESETS: GarmentPresetItem[] = [
  { ar: 'قصة واسعة مريحة (Oversized Boxy Fit)', en: 'Oversized Boxy Fit' },
  { ar: 'قصة منسدلة بأكتاف ساقطة (Drop-Shoulder Relaxed)', en: 'Drop-Shoulder Relaxed Fit' },
  { ar: 'قصة كلاسيكية منتظمة (Regular Classic Fit)', en: 'Regular Classic Fit' },
  { ar: 'قصة مجسمة أنيقة (Slim Tailored Fit)', en: 'Slim Tailored Fit' },
  { ar: 'قصة مستقيمة مريحة (Straight Leg Fit)', en: 'Straight Leg Fit' },
  { ar: 'قصة قصيرة عصرية (Modern Cropped Fit)', en: 'Modern Cropped Fit' }
];

export const FEATURE_HIGHLIGHT_PRESETS: GarmentPresetItem[] = [
  { ar: 'صنع يدوي متقن في مصر', en: 'Handcrafted with precision in Egypt' },
  { ar: 'قطن ثقيل عالي الكثافة 280 جرام', en: 'Heavyweight 280 GSM structural cotton' },
  { ar: 'خياطة وتطريز مقوى فائق المتانة', en: 'Reinforced dual-needle precision stitching' },
  { ar: 'أزرار معدنية محفورة بشعار إيفل', en: 'Custom engraved Eiffel metal hardware' },
  { ar: 'معالج ضد الانكماش وبهتان الألوان', en: 'Pre-shrunk & colorfast treated fabric' },
  { ar: 'جيوب جانبية مبطنة ومخفية', en: 'Concealed lined side pockets' },
  { ar: 'ياقة وأساور مضلعة متماسكة مزدوجة', en: 'Double-layered ribbed collar & cuffs' },
  { ar: 'ملمس ناعم جداً ومقاوم للوبر', en: 'Ultra-soft hand feel with anti-pilling finish' },
  { ar: 'قصة هندسية تمنح حرية كاملة في الحركة', en: 'Ergonomic tailoring for effortless movement' }
];

export const CARE_INSTRUCTION_PRESETS: GarmentPresetItem[] = [
  { ar: 'غسيل آلي بماء بارد عند 30° مئوية', en: 'Machine wash cold at 30°C' },
  { ar: 'لا تستخدم المبيضات أو الكلور نهائياً', en: 'Do not use bleach or optical brighteners' },
  { ar: 'الكي على الظهر بدرجة حرارة منخفضة', en: 'Iron inside-out on low to medium heat' },
  { ar: 'تجفيف هوائي على الحبل في الظل', en: 'Line dry in shade; avoid direct sunlight' },
  { ar: 'تجنب استخدام المجفف الآلي الساخن', en: 'Do not tumble dry to preserve fabric density' },
  { ar: 'تنظيف جاف احترافي فقط', en: 'Professional dry clean only' },
  { ar: 'غسيل مع ألوان مماثلة فقط', en: 'Wash with similar colors only' },
  { ar: 'لا تعصر القطعة بقوة للحفاظ على الأنسجة', en: 'Do not wring forcefully' }
];

export const DESCRIPTION_TEMPLATES: DescriptionTemplateItem[] = [
  {
    id: 'casual_luxury',
    nameAr: 'قالب كاجوال عصري فاخر',
    nameEn: 'Luxury Casual Capsule',
    textAr: 'قطعة تجمع بين البساطة الهندسية والراحة المطلقة، منسوجة من أجود خامات القطن المصري الفاخر بتفاصيل متقنة وقصة عصرية تناسب الإطلالات اليومية الراقية واللقاءات غير الرسمية.',
    textEn: 'A signature piece blending geometric simplicity with absolute comfort, tailored from premium Egyptian cotton with refined details and a modern silhouette for elevated everyday wear.'
  },
  {
    id: 'formal_tailored',
    nameAr: 'قالب كلاسيك رسمي أنيق',
    nameEn: 'Formal Tailored Elegance',
    textAr: 'تصميم كلاسيكي راقٍ مستوحى من الخطوط المعمارية الفاخرة، يمنحك هيبة وحضوراً استثنائياً في المناسبات واللقاءات الرسمية بحرفة خياطة متناهية الدقة وجودة خامات لا تضاهى.',
    textEn: 'An elevated classic design inspired by architectural lines, delivering remarkable presence for formal occasions with impeccable sartorial craftsmanship and superior material quality.'
  },
  {
    id: 'winter_outerwear',
    nameAr: 'قالب شتوي / ميلتون ثقيل',
    nameEn: 'Winter Heavyweight Essential',
    textAr: 'قطعة شتوية فاخرة تمنحك الدفء والمظهر الجذاب، مصممة من نسيج ثقيل مبطن عالي الكثافة مع تفاصيل هندسية توفر الراحة والحماية من البرودة مع الحفاظ على قوام القطعة الرائع.',
    textEn: 'A luxury winter essential offering warmth and striking aesthetic, crafted from heavyweight lined fabric with structural details for ultimate comfort, protection, and long-lasting form.'
  }
];
