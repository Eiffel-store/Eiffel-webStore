export type PresetCategory = 'clothing' | 'shoes' | 'bags' | 'accessories';

export interface CategoryPresetBundle {
  id: PresetCategory;
  nameAr: string;
  nameEn: string;
  icon: string;
  fabrics: string[];
  fits: string[];
  features: string[];
  care: string[];
  templates: DescriptionTemplateItem[];
}

export interface DescriptionTemplateItem {
  id: string;
  name: string;
  text: string;
}

export const CATEGORY_PRESET_BUNDLES: Record<PresetCategory, CategoryPresetBundle> = {
  clothing: {
    id: 'clothing',
    nameAr: 'الملابس',
    nameEn: 'Clothing & Apparel',
    icon: 'Shirt',
    fabrics: [
      '100% قطن طبيعي مريح (100% Pure Cotton)',
      'قطن سنغل جيرسي ناعم (Single Jersey Cotton)',
      'قطن مع ليكرا مرن (Cotton Lycra Blend)',
      'أكسفورد وبوبلين فاخر للقمصان (Oxford & Poplin Cotton)',
      'كتان صيفي خفيف وبارد (Summer Linen Blend)',
      'ميلتون قطني مبطن دافئ (Fleece-Lined Heavyweight)',
      'ميلتون سنغل خفيف (Lightweight Cotton Fleece)',
      'جينز عالي الجودة مع ليكرا (Stretch Denim)',
      'جبردين قطني متين وعملي (Cotton Gabardine)',
      'بيكيه قطني للبولو (Cotton Piqué)',
      'قماش وتربروف مقاوم للماء والرياح (Waterproof & Windproof)',
      'بوليستر رياضي معالج سريع الجفاف (Quick-Dry Performance)'
    ],
    fits: [
      'أوفر سايز واسع وعصري (Oversized Fit)',
      'ريجولار مريح ومناسب للجميع (Regular Classic Fit)',
      'سليم فيت مجسم أنيق (Slim Tailored Fit)',
      'قميص أوفر شيرت مريح (Overshirt Relaxed Fit)',
      'دروب شولدر بأكتاف ساقطة (Drop Shoulder Relaxed)',
      'كارغو بقصة عصرية وجيوب (Cargo Fit)',
      'قصة مستقيمة مريحة (Straight Leg Fit)',
      'شروال مريح بأساور مطاطية (Jogger / Cuffed Fit)'
    ],
    features: [
      'خامة قطنية ناعمة ومريحة للاستخدام اليومي',
      'قماش مرن يمنحك راحة وسهولة في الحركة',
      'ثبات عالي للألوان ومقاوم للبهتان بعد الغسيل',
      'معالج ضد الانكماش للحفاظ على المقاس الأصلي',
      'أزرار متينة مع تقفيل ياقة وأساور فائق الجودة',
      'سهل الكي ومقاوم للتجاعيد (Easy Care)',
      'طباعة / تطريز عالي الجودة ومقاوم للتلف',
      'تقفيل وخياطة مزدوجة متينة لتحمل الاستخدام',
      'بطانة داخلية ناعمة تمنحك الدفء',
      'خفيف وبارد ومثالي لأجواء الصيف',
      'جيوب جانبية عملية وواسعة'
    ],
    care: [
      'غسيل في الغسالة بماء بارد 30° مئوية',
      'قلب القطعة على الظهر قبل الغسيل',
      'الكي على ظهر القطعة وبحرارة متوسطة',
      'عدم الكي المباشر على الطباعة أو التطريز',
      'تجنب استخدام المبيضات أو الكلور',
      'غسيل مع ألوان مماثلة فقط',
      'تجنب العصر الشديد للحفاظ على القماش',
      'يفضل التجفيف الطبيعي في الظل'
    ],
    templates: [
      {
        id: 'tshirt_casual',
        name: 'تيشرت / بولو كاجوال',
        text: 'تيشرت كاجوال عصري مصنوع من خامة قطنية عالية الجودة، يتميز بملمس ناعم ومريح طوال اليوم مع قصة مريحة مناسبة لجميع إطلالاتك اليومية.\n\nA comfortable everyday casual t-shirt crafted from premium soft cotton, featuring a modern fit and versatile style for your daily outfits.'
      },
      {
        id: 'shirt_casual',
        name: 'قميص كاجوال / أوفر شيرت',
        text: 'قميص كاجوال أنيق مصنوع من خامة قطنية مريحة وخفيفة، يتميز بقصة متناسقة وتقفيل متقن يمنحك إطلالة شيك تناسب العمل والخروجات اليومية والتنسيق المفتوح فوق التيشرت.\n\nA stylish casual button-down shirt crafted from breathable soft cotton, offering a versatile tailored look ideal for daily wear, work, or open-front layering.'
      },
      {
        id: 'shirt_linen',
        name: 'قميص كتان صيفي',
        text: 'قميص كتان صيفي خفيف وبارد، يتميز بملمس طبيعي ناعم وقصة مريحة تمنحك إطلالة صيفية شيك وجذابة في الأجواء الحارة.\n\nA lightweight breathable summer linen shirt with a relaxed silhouette and natural texture, perfect for staying cool and elegant in warm weather.'
      },
      {
        id: 'hoodie_winter',
        name: 'هودي / سويت شيرت شتوي',
        text: 'هودي شتوي مريح مبطن بخامة ميلتون دافئة وناعمة، يوفر التدفئة المثالية مع قصة عصرية أنيقة وجيوب عملية لمظهر كاجوال شيك.\n\nA warm and comfortable winter hoodie with a soft fleece lining, designed for optimal warmth, modern style, and everyday comfort.'
      },
      {
        id: 'pants_trousers',
        name: 'بنطلون (جينز / جبردين / شروال)',
        text: 'بنطلون كاجوال عملي مصمم بخامة متينة مع نسبة ليكرا لراحة وسهولة الحركة، بقصة متناسقة تناسب مشاويرك اليومية والعملية.\n\nPractical everyday pants tailored with durable, flexible fabric for ease of movement and a versatile modern look.'
      },
      {
        id: 'jacket_outerwear',
        name: 'جاكيت / وندبريكر',
        text: 'جاكيت أنيق وعملي مصنوع من خامة عالية الجودة مقاومة للهواء والبرودة، بتصميم عصري وتقفيل متقن يناسب مختلف الأجواء.\n\nA stylish, versatile outerwear jacket crafted from weather-resistant durable fabric, offering comfort and modern streetwear aesthetic.'
      }
    ]
  },
  shoes: {
    id: 'shoes',
    nameAr: 'الأحذية والكوتشيات',
    nameEn: 'Shoes & Sneakers',
    icon: 'Footprints',
    fabrics: [
      'جلد طبيعي 100% فاخر (Genuine Leather)',
      'جلد صناعي عالي الجودة متين (Premium PU Leather)',
      'قماش شبكي يسمح بالتنفس (Breathable Mesh)',
      'شامواه / سويد ناعم (Suede Leather)',
      'نعل رابر مطاطي مانع للانزلاق (Anti-Slip Rubber Sole)',
      'فرش داخلي ميموري فوم طبي (Memory Foam Insole)',
      'نعل إيفا فائق الخفة وممتص للصدمات (Ultra-Light EVA Sole)',
      'مزيج قماش وجلد رياضي (Fabric & Leather Combo)'
    ],
    fits: [
      'سنيكرز كاجوال رياضي (Sport Casual Sneakers)',
      'كوتشي لو-توب كاجوال منخفض (Low-Top Sneakers)',
      'كوتشي هاي-توب عالي (High-Top Sneakers)',
      'حذاء جلد كلاسيك لوفر (Classic Loafers)',
      'سليبر / سلايدز مريح (Comfort Slides & Mules)',
      'هاف بوت شتوي عصري (Ankle Casual Boots)',
      'حذاء جري ومشي خفيف (Lightweight Running Shoes)'
    ],
    features: [
      'نعل مرن وممتص للصدمات لراحة المشي طوال اليوم',
      'خفيف الوزن يمنحك راحة تامة أثناء الحركة المستمرة',
      'فرش داخلي طبي مبطن لدعم بطن القدم ومنع الإجهاد',
      'خامات مسامية تسمح بمرور الهواء وتمنع التعرق',
      'رباط متين عالي التحمل مع فتحات معدنية مقواة',
      'نعل خارجي مضلع مانع للانزلاق على مختلف الأرضيات',
      'تقفيل وخياطة مقواة لتحمل الاستخدام الشاق',
      'تصميم عصري وجذاب يناسب مختلف الإطلالات اليومية'
    ],
    care: [
      'تنظيف بقطعة قماش مبللة أو فرشاة أحذية ناعمة',
      'تجنب الغسيل في الغسالة الأوتوماتيك لحماية النعل واللاصق',
      'تجفيف هوائي طبيعي بعيداً عن حرارة الشمس المباشرة',
      'استخدام سبراي واقي من الأوساخ والماء للأحذية',
      'تخزين في مكان جاف مع وضع حشو داخلي للحفاظ على القالب'
    ],
    templates: [
      {
        id: 'sneaker_casual',
        name: 'كوتشي / سنيكرز كاجوال',
        text: 'كوتشي كاجوال عصري وخفيف الوزن، مصمم بنعل مرن ممتص للصدمات وفرش داخلي مريح يمنحك دعماً ممتازاً أثناء المشي والحركة طوال اليوم.\n\nA modern lightweight casual sneaker featuring a shock-absorbing flexible sole and cushioned insole for all-day comfort and effortless styling.'
      },
      {
        id: 'classic_shoes',
        name: 'حذاء كلاسيك / لوفر',
        text: 'حذاء كلاسيكي أنيق ومريح مصمم بخامات عالية الجودة، يجمع بين الفخامة والعملية ومناسب للعمل والمناسبات الرسمية والخروجات الأنيقة.\n\nAn elegant and comfortable classic shoe crafted with premium materials, combining sophistication and comfort for formal and casual occasions.'
      },
      {
        id: 'slides_summer',
        name: 'سليبر / سلايدز صيفي',
        text: 'سلايدز كاجوال مريح وخفيف الوزن، مصمم بقالب تشريحي مريح للقدم ونعل مانع للانزلاق مثالي للمشاوير الصيفية والراحة اليومية.\n\nA comfortable lightweight casual slide with an ergonomic footbed and anti-slip sole, ideal for daily summer relaxation.'
      }
    ]
  },
  bags: {
    id: 'bags',
    nameAr: 'الشنط والحقائب',
    nameEn: 'Bags & Backpacks',
    icon: 'Briefcase',
    fabrics: [
      'جلد طبيعي 100% متين (100% Genuine Leather)',
      'جلد صناعي فاخر مقاوم للخدش (Scratch-Resistant PU Leather)',
      'قماش أكسفورد متين وعالي التحمل (Heavy-Duty Oxford)',
      'قماش كانفاس قوي (Durable Heavy Canvas)',
      'قماش وتربروف مقاوم للماء والأمطار (Water-Repellent Fabric)',
      'بوليستر مبطن عالي الكثافة (Padded High-Density Polyester)'
    ],
    fits: [
      'شنطة كروس بدي عملية (Crossbody / Shoulder Bag)',
      'شنطة ظهر / باك باك للجامعة والعمل (Laptop Backpack)',
      'شنطة سفر ودفل باج رياضية (Duffle / Gym Bag)',
      'شنطة خصر وويست باج (Waist / Chest Bag)',
      'محفظة يد وكلاتش (Handbag / Pouch)'
    ],
    features: [
      'جيوب داخلية وخارجية متعددة وسوست متينة لتنظيم الأغراض',
      'سوستة (سحاب) معدني متين عالي التحمل وسلس الفتح',
      'حزام كتف عريض قابل للتعديل ومبطن لراحة الكتف',
      'قسم داخلي مبطن ومخصص لحماية اللابتوب والأجهزة الذكية',
      'خامة مقاومة لرذاذ الماء والخدوش وسهلة التنظيف',
      'سعة تخزين واسعة مع وزن خفيف لسهولة الحمل',
      'خياطة مقواة عند نقاط الحمل لتحمل الأوزان الثقيلة'
    ],
    care: [
      'مسح سطحي بقطعة قماش ناعمة ومبللة عند الحاجة',
      'تجنب الغمر الكامل في الماء أو المنظفات الكيميائية القوية',
      'تخزين الشنطة في مكان جاف وبارد بعيداً عن الرطوبة',
      'عدم تحميل الشنطة بأوزان تفوق طاقتها للحفاظ على السوست والأحزمة'
    ],
    templates: [
      {
        id: 'crossbody_bag',
        name: 'شنطة كروس / خصر',
        text: 'شنطة كروس أنيقة وعملية مصنوعة من خامات متينة ومقاومة للماء، مصممة بجيوب متعددة لسهولة تنظيم وحمل الهاتف والمحفظة والمتعلقات اليومية.\n\nA stylish, practical crossbody bag crafted from durable water-resistant material, designed with multiple compartments for your daily essentials.'
      },
      {
        id: 'laptop_backpack',
        name: 'شنطة ظهر / لابتوب',
        text: 'شنطة ظهر واسعة وعصرية مثالية للجامعة والعمل والسفر، مزودة بقسم مبطن لحماية اللابتوب وأحزمة كتف مريحة لتوزيع الوزن بسهولة.\n\nA spacious modern backpack ideal for university, work, and travel, featuring a padded laptop compartment and ergonomic straps.'
      },
      {
        id: 'duffle_gym_bag',
        name: 'شنطة جيم / سفر دفل',
        text: 'شنطة دفل عملية ومتينة مثالية للجيم والسفر القصير، بسعة تخزين كبيرة ومقصورة منفصلة للأحذية وحزام كتف قابل للفصل.\n\nA durable duffle bag ideal for the gym and weekend travel, featuring large storage capacity, shoe compartment, and adjustable shoulder strap.'
      }
    ]
  },
  accessories: {
    id: 'accessories',
    nameAr: 'الإكسسوارات والجلديات',
    nameEn: 'Accessories & Leather',
    icon: 'Watch',
    fabrics: [
      'جلد طبيعي 100% عالي الجودة (100% Genuine Leather)',
      'معدن ستانلس ستيل مقاوم للصدأ (Stainless Steel)',
      'أسيتات مع عدسات UV400 (Acetate & UV400 Lenses)',
      'قطن وبوليستر عالي الكثافة للكابات (Durable Twill Cotton)',
      'أكريليك وصوف شتوي دافئ (Warm Winter Knit)',
      'قطن ليكرا ناعم ومطاطي للشرابات (Cotton Lycra Knit)'
    ],
    fits: [
      'كاب بيسبول عصري قابل للتعديل (Adjustable Baseball Cap)',
      'حزام جلد طبيعي كلاسيكي/كاجوال (Leather Belt)',
      'محفظة كروت ونقود مدمجة (Compact Cardholder / Wallet)',
      'نظارة شمسية بإطار عصري (Modern Sunglasses)',
      'آيس كاب شتوي دافئ (Winter Beanie)',
      'طقم شرابات قطنية مريحة (Cotton Socks Pack)'
    ],
    features: [
      'تصميم أنيق وعصري يكمل شياكة طقمك وإطلالتك',
      'إبزيم معدني متين مقاوم للصدأ والخدش',
      'حجم مدمج وعملي لسهولة الحمل في الجيب',
      'عدسات توفر حماية 100% من أشعة الشمس فوق البنفسجية UV400',
      'مقاس قابل للتعديل بسهولة ليناسب الجميع',
      'خامات ممتازة مختارة بعناية لتحمل الاستخدام اليومي'
    ],
    care: [
      'تنظيف بقطعة قماش ناعمة (مايكروفايبر) خاصة',
      'حفظ النظارات والجلديات داخل الجراب المخصص لحمايتها من الخدوش',
      'غسيل يدوي بماء فاتر للكابات والآيس كاب والشرابات',
      'تجنب تعريض الإكسسوارات المعدنية والجلدية للمواد الكيميائية أو العطور مباشرة'
    ],
    templates: [
      {
        id: 'cap_accessory',
        name: 'كاب / قبعة كاجوال',
        text: 'كاب عصري وأنيق مصنوع من خامة قطنية عالية الجودة مع شريط خلفي قابل للتعديل، يمنحك مظهراً كاجوال مميزاً وحماية من الشمس.\n\nA stylish casual cap crafted from high quality cotton with an adjustable back strap, providing a modern look and sun protection.'
      },
      {
        id: 'leather_wallet_belt',
        name: 'محفظة / حزام جلد',
        text: 'قطعة جلدية فاخرة مصنوعة من خامات متينة ومظهر أنيق يجمع بين الفخامة والعملية، وتتميز بعمر افتراضي طويل وجودة تقفيل ممتازة.\n\nA premium leather accessory combining durability, functionality, and timeless style.'
      },
      {
        id: 'sunglasses_accessory',
        name: 'نظارة شمسية',
        text: 'نظارة شمسية عصرية بعدسات حماية كاملة UV400 وإطار خفيف ومريح، تمنحك إطلالة جذابة وحماية مثالية للعينين.\n\nModern sunglasses with full UV400 protection and lightweight comfortable frames, adding a bold touch to your daily look.'
      }
    ]
  }
};

// Default flat exports for backwards compatibility
export const FABRIC_COMPOSITION_PRESETS = CATEGORY_PRESET_BUNDLES.clothing.fabrics;
export const FIT_SILHOUETTE_PRESETS = CATEGORY_PRESET_BUNDLES.clothing.fits;
export const FEATURE_HIGHLIGHT_PRESETS = CATEGORY_PRESET_BUNDLES.clothing.features;
export const CARE_INSTRUCTION_PRESETS = CATEGORY_PRESET_BUNDLES.clothing.care;
export const DESCRIPTION_TEMPLATES = CATEGORY_PRESET_BUNDLES.clothing.templates;

