export interface GarmentPresetItem {
  label: string;
}

export interface DescriptionTemplateItem {
  id: string;
  name: string;
  text: string;
}

export const FABRIC_COMPOSITION_PRESETS: string[] = [
  '100% قطن مصري فاخر (100% Egyptian Cotton)',
  'جبردين مستورد عالي الكثافة (Imported Gabardine)',
  'مزيج كتان وحرير طبيعي (Linen & Silk Blend)',
  'ميلتون قطني مبطن دافئ (Brushed Cotton Fleece)',
  'صوف إيطالي نقي 100% (100% Pure Italian Wool)',
  'بيكيه قطني فاخر للبولو (Cotton Piqué Knit)',
  'دينيم قطني ياباني متين (Japanese Cotton Denim)',
  'قطن وفيسكوز منسوج ناعم (Cotton & Viscose)',
  'جلد طبيعي فاخر 100% (100% Genuine Leather)'
];

export const FIT_SILHOUETTE_PRESETS: string[] = [
  'قصة واسعة مريحة (Oversized Boxy Fit)',
  'قصة منسدلة بأكتاف ساقطة (Drop-Shoulder Relaxed)',
  'قصة كلاسيكية منتظمة (Regular Classic Fit)',
  'قصة مجسمة أنيقة (Slim Tailored Fit)',
  'قصة مستقيمة مريحة (Straight Leg Fit)',
  'قصة قصيرة عصرية (Modern Cropped Fit)'
];

export const FEATURE_HIGHLIGHT_PRESETS: string[] = [
  'صنع يدوي متقن في مصر (Handcrafted in Egypt)',
  'قطن مصري ثقيل 280 جرام (Heavyweight 280 GSM Cotton)',
  'خياطة وتطريز مقوى فائق الدقة (Precision Reinforced Stitching)',
  'أزرار معدنية محفورة بشعار إيفل (Engraved Eiffel Hardware)',
  'معالج ضد الانكماش وبهتان الألوان (Pre-shrunk & Colorfast)',
  'جيوب جانبية مبطنة ومخفية (Concealed Lined Pockets)',
  'ياقة وأساور مضلعة متماسكة (Double-ribbed Collar & Cuffs)',
  'ملمس ناعم جداً ومقاوم للوبر (Ultra-soft Anti-pilling Finish)',
  'قصة هندسية تمنح حرية الحركة (Ergonomic Tailoring)'
];

export const CARE_INSTRUCTION_PRESETS: string[] = [
  'غسيل آلي بماء بارد 30° مئوية (Machine Wash Cold 30°C)',
  'لا تستخدم المبيضات أو الكلور (Do Not Bleach)',
  'الكي على الظهر بحرارة منخفضة (Iron Inside-Out Low Heat)',
  'تجفيف هوائي في الظل (Line Dry in Shade)',
  'تجنب استخدام المجفف الآلي (Do Not Tumble Dry)',
  'تنظيف جاف احترافي فقط (Dry Clean Only)',
  'غسيل مع ألوان مماثلة فقط (Wash With Similar Colors)',
  'لا تعصر القطعة بقوة (Do Not Wring Forcefully)'
];

export const DESCRIPTION_TEMPLATES: DescriptionTemplateItem[] = [
  {
    id: 'casual_luxury',
    name: 'قالب كاجوال عصري فاخر (Luxury Casual Capsule)',
    text: 'قطعة تجمع بين البساطة الهندسية والراحة المطلقة، منسوجة من أجود خامات القطن المصري الفاخر بتفاصيل متقنة وقصة عصرية تناسب الإطلالات اليومية الراقية واللقاءات غير الرسمية.\n\nA signature piece blending geometric simplicity with absolute comfort, tailored from premium Egyptian cotton with refined details and a modern silhouette for elevated everyday wear.'
  },
  {
    id: 'formal_tailored',
    name: 'قالب كلاسيك رسمي أنيق (Formal Tailored Elegance)',
    text: 'تصميم كلاسيكي راقٍ مستوحى من الخطوط المعمارية الفاخرة، يمنحك هيبة وحضوراً استثنائياً في المناسبات واللقاءات الرسمية بحرفة خياطة متناهية الدقة وجودة خامات لا تضاهى.\n\nAn elevated classic design inspired by architectural lines, delivering remarkable presence for formal occasions with impeccable sartorial craftsmanship and superior material quality.'
  },
  {
    id: 'winter_outerwear',
    name: 'قالب شتوي / ميلتون ثقيل (Winter Heavyweight Essential)',
    text: 'قطعة شتوية فاخرة تمنحك الدفء والمظهر الجذاب، مصممة من نسيج ثقيل مبطن عالي الكثافة مع تفاصيل هندسية توفر الراحة والحماية من البرودة مع الحفاظ على قوام القطعة الرائع.\n\nA luxury winter essential offering warmth and striking aesthetic, crafted from heavyweight lined fabric with structural details for ultimate comfort, protection, and long-lasting form.'
  }
];
