import { Product } from '@/types';

const getAsset = (filename: string): string => {
  return `${import.meta.env.BASE_URL}images/products/${filename}`;
};

export const PRODUCTS: Product[] = [
  // ==========================================
  // MEN'S WEAR (رجالي)
  // ==========================================
  {
    id: 'eiffel-cardigan-trio',
    name: 'Eiffel Longline Open Cardigan',
    subtitle: 'Available in Mocha, Obsidian Noir & Sand Beige / كارديجان إيفل طويل',
    price: 650,
    originalPrice: 790,
    category: 'men',
    subCategory: 'Outerwear',
    images: [
      getAsset('eiffel-cardigan-trio.jpg')
    ],
    colors: [
      { name: 'Mocha Brown', hex: '#6d4c41' },
      { name: 'Pitch Noir', hex: '#111111' },
      { name: 'Sand Beige', hex: '#d7ccc8' }
    ],
    sizes: ['M', 'L', 'XL', '2XL', '3XL'],
    description: 'كارديجان إيفل طويل بتصميم انسيابي عصري مريح، مصنوع من خامات قطنية مخلوطة خفيفة ومثالية للأيام المعتدلة والطبقات الكاجوال الشيك.',
    details: [
      'خامة قطنية مخلوطة ناعمة ومقاومة للانكماش',
      'قصة طويلة انسيابية (Longline Silhouette)',
      'شعار إيفل Eiffel المطرز بجودة عالية',
      'أكمام مريحة وجيوب جانبية أنيقة'
    ],
    composition: '80% Premium Cotton, 20% Polyester',
    fit: 'Relaxed Regular Fit — قصة مريحة تناسب مختلف الأوزان والأطوال.',
    care: ['غسيل آلي على دورة هادئة (30 درجة مئوية)', 'لا تستخدم المبيضات', 'كوي على درجة حرارة خفيفة'],
    isNew: true,
    isBestSeller: true,
    tag: 'BESTSELLER',
    rating: 4.9,
    reviewCount: 88,
    inStock: true
  },
  {
    id: 'eiffel-outfit-flatlay',
    name: 'Eiffel Smart Casual Ensemble Set',
    subtitle: 'Oxford Shirt + Tailored Chino + Footwear Combo / طقم إيفل سمارت كاجوال',
    price: 1250,
    originalPrice: 1550,
    category: 'men',
    subCategory: 'Tailoring & Sets',
    images: [
      getAsset('eiffel-outfit-flatlay.jpg')
    ],
    colors: [
      { name: 'Slate Gray & Dark Navy', hex: '#4a5568' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'طقم كاجوال متكامل ومختار بعناية من إيفل، يجمع بين قميص رمادي فاتح مريح، بنطلون داكن بتفصيل مريح، وحذاء رياضي أبيض كلاسيكي.',
    details: [
      'طقم متناسق جاهز للمناسبات والخروجات اليومية',
      'قميص قطن معالج ضد الكرمشة',
      'بنطلون مريح بقصة مستقيمة ومطاطية خفيفة',
      'إكسسوارات متناسقة'
    ],
    composition: '100% Cotton Shirt, Cotton-Stretch Pants',
    fit: 'Modern Tailored Fit',
    care: ['غسيل منفصل للألوان', 'تنظيف جاف موصى به للبنطلون'],
    isNew: true,
    isBestSeller: true,
    tag: 'COMPLETE LOOK',
    rating: 5.0,
    reviewCount: 42,
    inStock: true
  },
  {
    id: 'mens-polo-striped-outfit',
    name: 'Eiffel Retro Ribbed Striped Polo',
    subtitle: 'Fine Textured Knit Polo with Vertical Stripes / بولو إيفل تريكو مقلم',
    price: 420,
    originalPrice: 500,
    category: 'men',
    subCategory: 'T-Shirts & Tops',
    images: [
      getAsset('polo-striped-outfit.jpg')
    ],
    colors: [
      { name: 'Beige & Olive Stripe', hex: '#bcaaa4' },
      { name: 'Onyx Black', hex: '#111111' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'تيشيرت بولو رجالي بنمط تريكو مضلع ومقلم كلاسيكي راقي، يمنحك إطلالة فرنسية أنيقة مع الياقة المفتوحة والألوان الترابية المتناسقة.',
    details: [
      'تريكو قطني صيفي ناعم خفيف وبارد على الجسم',
      'ياقة مفتوحة بدون أزرار (Open Johnny Collar)',
      'تقليمات طولية تمنح مظهراً ممشوقاً ورياضياً'
    ],
    composition: '100% Combed Cotton Knit',
    fit: 'Regular Fit',
    care: ['غسيل يدوي أو دورة أقمشة ناعمة', 'تجفيف مسطح'],
    isNew: true,
    tag: 'SUMMER TREND',
    rating: 4.8,
    reviewCount: 35,
    inStock: true
  },
  {
    id: 'mens-olive-tee-beige-pants',
    name: 'Eiffel Olive Textured Tee & Drawstring Pant Set',
    subtitle: 'Waffle-Weave Tee with Wide Leg Linen-Blend Pants / طقم تيشيرت زيتي وبنطلون بيج',
    price: 690,
    originalPrice: 820,
    category: 'men',
    subCategory: 'T-Shirts & Tops',
    images: [
      getAsset('mens-olive-tee-beige-pants.jpg')
    ],
    colors: [
      { name: 'Olive Drab & Oat Beige', hex: '#556b2f' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'طقم متناغم فائق الراحة مكون من تيشيرت زيتي بملمس بارز وبنطلون بيج فضفاض بحزام رباط عريض، مثالي للإجازات والصيف.',
    details: [
      'تيشيرت قطن بارز الملمس (Textured Heavy Cotton)',
      'بنطلون بوسط مطاطي برباط قماشي عريض لراحة فائقة',
      'قصة ريلاكسد مريحة وأنيقة'
    ],
    composition: '95% Cotton, 5% Spandex',
    fit: 'Relaxed Wide Silhouette',
    care: ['غسيل بماء بارد', 'كوي على درجة متوسطة'],
    isNew: true,
    rating: 4.9,
    reviewCount: 29,
    inStock: true
  },
  {
    id: 'mens-brown-wash-tee-jeans',
    name: 'Eiffel Heavyweight Acid-Wash Tee',
    subtitle: 'Mineral Washed Cocoa Drop-Shoulder Tee / تيشيرت إيفل بني مغسول أوفرسايز',
    price: 380,
    category: 'men',
    subCategory: 'T-Shirts & Tops',
    images: [
      getAsset('mens-brown-wash-tee-jeans.jpg')
    ],
    colors: [
      { name: 'Washed Cocoa Brown', hex: '#5c4033' },
      { name: 'Charcoal Wash', hex: '#333333' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'تيشيرت أوفرسايز قطن ثقيل بغسيل أسيدي عتيق بلون الكاكاو البني الفاخر، يعطي مظهراً كاجوال متميز ومريح.',
    details: [
      'قطن مصري 100% ثقيل ومقاوم للوبر',
      'غسيل معدني فريد لكل قطعة (Acid Mineral Wash)',
      'أكتاف ساقطة (Drop Shoulder) وياقة سميكة محكمة'
    ],
    composition: '100% Egyptian Cotton Heavyweight',
    fit: 'Boxy Oversized Fit',
    care: ['غسيل مقلوباً على ظهره بماء بارد'],
    isNew: true,
    rating: 4.7,
    reviewCount: 46,
    inStock: true
  },
  {
    id: 'mens-eiffel-badge-tees',
    name: 'Eiffel Signature Minimalist Badge Tee',
    subtitle: 'Classic Crewneck with Eiffel Chest Patch / تيشيرت إيفل قطن ببادج الصدر',
    price: 350,
    category: 'men',
    subCategory: 'T-Shirts & Tops',
    images: [
      getAsset('mens-white-eiffel-tee.jpg'),
      getAsset('mens-green-eiffel-tee.jpg'),
      getAsset('mens-burgundy-eiffel-tee.jpg')
    ],
    colors: [
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Forest Green', hex: '#1b4d3e' },
      { name: 'Burgundy Wine', hex: '#800020' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'التيشيرت الأساسي اليومي من إيفل، مصنوع من أنعم خامات القطن المصري الممشط، ومزين ببادج شعار إيفل البسيط على الصدر.',
    details: [
      'قطن مصري ممشط 100% لنعومة فائقة وبرودة طوال اليوم',
      'بادج مطاطي بارز محفور بشعار إيفل',
      'متوفر بثلاثة ألوان أساسية (أبيض، أخضر، نبيتي)'
    ],
    composition: '100% Combed Egyptian Cotton',
    fit: 'Regular Tailored Fit',
    care: ['غسيل آلي على 30 درجة'],
    isNew: true,
    isBestSeller: true,
    tag: 'MUST HAVE',
    rating: 4.9,
    reviewCount: 112,
    inStock: true
  },
  {
    id: 'mens-red-pocket-tee',
    name: 'Eiffel Crimson Contrast-Pocket Tee',
    subtitle: 'High-Density Crimson Cotton with Functional Chest Pocket / تيشيرت إيفل أحمر بجيب',
    price: 350,
    category: 'men',
    subCategory: 'T-Shirts & Tops',
    images: [
      getAsset('mens-red-pocket-tee-denim.jpg')
    ],
    colors: [
      { name: 'Crimson Red', hex: '#b30000' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'تيشيرت أحمر قرمزي جذاب وعالي الكثافة مع جيب صدر عملي مدمج وتفاصيل أنيقة، يتناسب تماماً مع البناطيل الجينز والجبردين.',
    details: [
      'قطن مصري عالي الجودة مع ثبات للألوان',
      'جيب صدر مزود ببادج إيفل الصغير',
      'خياطة مزدوجة متينة للأكمام والحاشية'
    ],
    composition: '100% Ring-Spun Cotton',
    fit: 'Standard Comfort Fit',
    care: ['غسيل بماء بارد لمنع بهتان اللون'],
    isNew: false,
    rating: 4.6,
    reviewCount: 31,
    inStock: true
  },
  {
    id: 'mens-oxford-shirts-collection',
    name: 'Eiffel Classic Oxford Button-Down Shirt',
    subtitle: 'Full Spectrum Premium Cotton Oxford Shirts / قميص إيفل أكسفورد كلاسيك كولكشن كامل',
    price: 480,
    originalPrice: 580,
    category: 'men',
    subCategory: 'Shirts',
    images: [
      getAsset('mens-oxford-shirts-collection.jpg'),
      getAsset('mens-white-oxford-folded.jpg')
    ],
    colors: [
      { name: 'Crisp White', hex: '#ffffff' },
      { name: 'Sky Blue', hex: '#87ceeb' },
      { name: 'Oat Beige', hex: '#d7ccc8' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Espresso Brown', hex: '#3e2723' },
      { name: 'Midnight Black', hex: '#111111' }
    ],
    sizes: ['M', 'L', 'XL', '2XL', '3XL'],
    description: 'القميص الأكسفورد الأساسي الذي لا غنى عنه في خزانة أي رجل، منسوج من خيوط قطنية سميكة فاخرة بياقة محكمة وأزرار لؤلؤية متينة.',
    details: [
      'نسيج أكسفورد قطني كلاسيكي معالج ضد التجعد',
      'ياقة بأزرار تثبيت (Button-Down Collar)',
      'تشكيلة واسعة بـ 6 ألوان تناسب العمل والمناسبات الرسمية والكاجوال'
    ],
    composition: '100% Royal Oxford Cotton',
    fit: 'Slim / Regular Tailored Cut',
    care: ['غسيل آلي هادئ', 'كوي بالبخار'],
    isNew: true,
    isBestSeller: true,
    tag: 'WARDROBE ESSENTIAL',
    rating: 5.0,
    reviewCount: 154,
    inStock: true
  },
  {
    id: 'mens-zip-polo-collection',
    name: 'Eiffel Modern Zip-Collar Polo Shirt',
    subtitle: 'Breathable Piqué Cotton with Metal Zipper / بولو إيفل سوستة مودرن',
    price: 450,
    category: 'men',
    subCategory: 'T-Shirts & Tops',
    images: [
      getAsset('mens-zip-polo-collection.jpg')
    ],
    colors: [
      { name: 'Clean White', hex: '#ffffff' },
      { name: 'Heather Grey', hex: '#9e9e9e' },
      { name: 'Pitch Black', hex: '#111111' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'بولو صيفي عصري يجمع بين أناقة قماش البيكيه وسحاب معدني مخفي عند الياقة بدلاً من الأزرار التقليدية لمظهر شبابي جذاب.',
    details: [
      'قماش بيكيه قطني مسامي يسمح بمرور الهواء',
      'سحاب معدني أسود ناعم وعالي التحمل',
      'ياقة مضلعة محكمة لا تفقد شكلها مع الغسيل'
    ],
    composition: '95% Cotton Piqué, 5% Elastane',
    fit: 'Athletic Fitted Cut',
    care: ['غسيل آلي بماء فاتر'],
    isNew: true,
    rating: 4.8,
    reviewCount: 52,
    inStock: true
  },
  {
    id: 'mens-waffle-tee-trio',
    name: 'Eiffel Textured Waffle-Knit Crewneck',
    subtitle: 'Thermal Waffle Jersey in Core Monochrome Tones / تيشيرت وافل إيفل تريكو خفيف',
    price: 390,
    category: 'men',
    subCategory: 'T-Shirts & Tops',
    images: [
      getAsset('mens-waffle-tee-trio.jpg')
    ],
    colors: [
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Heather Grey', hex: '#9e9e9e' },
      { name: 'Chalk White', hex: '#ffffff' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'تيشيرت بنسيج الوافل الهندسي البارز المريح، يمنح عمقاً بصرياً وملمساً فاخراً، رائع للارتداء منفرداً أو أسفل الجواكت.',
    details: [
      'نسيج وافل حراري خفيف ناعم الملمس',
      'ياقة مستديرة معززة ومحكمة',
      'ثلاثة ألوان مونوكروم أساسية تتوافق مع كل البناطيل'
    ],
    composition: '100% Micro-Waffle Cotton',
    fit: 'Regular Fit',
    care: ['غسيل هادئ', 'تجفيف مفرود'],
    isNew: false,
    rating: 4.7,
    reviewCount: 39,
    inStock: true
  },
  {
    id: 'mens-essential-tee-rack',
    name: 'Eiffel Spectrum Pure Cotton Basic Tee',
    subtitle: 'Everyday High-Density Jersey T-Shirts in Pastel & Earth Tones / تيشيرت إيفل قطن بيسك',
    price: 290,
    originalPrice: 350,
    category: 'men',
    subCategory: 'T-Shirts & Tops',
    images: [
      getAsset('mens-essential-tee-rack.jpg')
    ],
    colors: [
      { name: 'Sky Blue', hex: '#90caf9' },
      { name: 'Sand Khaki', hex: '#d7ccc8' },
      { name: 'Forest Green', hex: '#2e7d32' },
      { name: 'Charcoal Black', hex: '#212121' },
      { name: 'Off White', hex: '#f5f5f5' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'التيشيرت القطني اليومي المفضل لدى عملاء إيفل، ناعم وخفيف، متوفر بأكثر من 8 درجات لونية صيفية وترابية مختارة بعناية.',
    details: [
      'قطن طبيعي خفيف ومريح للاستخدام اليومي المستمر',
      'ثبات عالي للألوان بعد الغسيل المتكرر',
      'سعر اقتصادي ومثالي للشراء المتعدد'
    ],
    composition: '100% Pure Egyptian Cotton',
    fit: 'Standard Fit',
    care: ['غسيل آلي على 30-40 درجة مئوية'],
    isNew: true,
    isBestSeller: true,
    tag: 'HOT DEAL',
    rating: 4.9,
    reviewCount: 210,
    inStock: true
  },
  {
    id: 'mens-pants-collection-colors',
    name: 'Eiffel Stretch Gabardine & Chino Pants',
    subtitle: 'Classic Tailored Cut Trousers in 5 Core Shades / بنطلون جبردين إيفل كلاسيك 5 ألوان',
    price: 520,
    originalPrice: 620,
    category: 'men',
    subCategory: 'Trousers',
    images: [
      getAsset('mens-pants-collection-colors.jpg')
    ],
    colors: [
      { name: 'Olive Green', hex: '#556b2f' },
      { name: 'Oatmeal Beige', hex: '#d7ccc8' },
      { name: 'Cream Off-White', hex: '#fafafa' },
      { name: 'Light Khaki', hex: '#c5b358' },
      { name: 'Pitch Black', hex: '#111111' }
    ],
    sizes: ['30', '32', '34', '36', '38', '40'],
    description: 'بنطلون جبردين إيفل الشهير بمطاطية خفيفة تضمن أقصى درجات الراحة أثناء الحركة مع قصة مستقيمة تناسب الشغل والخروجات.',
    details: [
      'جبردين قطني عالي الكثافة مع نسبة ليكرا مريحة (2% Lycra)',
      'سحاب نحاسي وقفل زر متين',
      'جيوب خلفية شق وجيوب أمامية عميقة للموبايل والمحفظة'
    ],
    composition: '98% Heavy Cotton Twill, 2% Elastane',
    fit: 'Slim-Straight Tailored Fit',
    care: ['غسيل مقلوباً بماء بارد لتثبيت اللون'],
    isNew: true,
    isBestSeller: true,
    tag: 'TOP RATED',
    rating: 5.0,
    reviewCount: 95,
    inStock: true
  },
  {
    id: 'hoodie-red-graphic',
    name: 'Eiffel Crimson Graphic Fleece Hoodie',
    subtitle: 'Heavyweight Brushed Fleece Streetwear Hoodie / هودي إيفل أحمر قطن ميلتون',
    price: 590,
    originalPrice: 690,
    category: 'men',
    subCategory: 'Hoodies & Sweaters',
    images: [
      getAsset('hoodie-red-graphic.jpg')
    ],
    colors: [
      { name: 'Fire Red', hex: '#d32f2f' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'هودي إيفل أحمر قطن ميلتون ثقيل ومبطن بوبرة داخلية دافئة، مطبوع برسومات جرافيك كرتونية عصرية وشبابية مع جيب كنغر أمامي.',
    details: [
      'قطن ميلتون 350 GSM مبطن بالفرو الناعم',
      'طباعة حرارية عالية الدقة لا تتشقق مع الغسيل',
      'كابيشو مزدوج الطبقات برباط قطني سميك'
    ],
    composition: '85% Cotton Fleece, 15% Polyester',
    fit: 'Streetwear Relaxed Fit',
    care: ['غسيل بماء بارد وممنوع استخدام المجفف الساخن'],
    isNew: true,
    tag: 'WINTER DROP',
    rating: 4.8,
    reviewCount: 47,
    inStock: true
  },
  {
    id: 'hoodie-navy-staytuned',
    name: 'Eiffel "Stay Tuned" Navy Street Hoodie',
    subtitle: 'Brushed Navy Fleece with Typography Art / هودي إيفل كحلي Stay Tuned',
    price: 590,
    category: 'men',
    subCategory: 'Hoodies & Sweaters',
    images: [
      getAsset('hoodie-navy-staytuned.jpg')
    ],
    colors: [
      { name: 'Deep Navy', hex: '#0d1b2a' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'هودي كحلي شتوي دافئ مزين بطباعة Stay Tuned الخلفية المستوحاة من ثقافة أزياء الشارع في باريس، ناعم ومريح للغاية.',
    details: [
      'ميلتون قطني شتوي عالي العزل والتدفئة',
      'أساور وكمر مضلع مرن يمنع تسرب الهواء البارد',
      'شعار إيفل على الكابيشو'
    ],
    composition: '85% Cotton, 15% Polyester Fleece',
    fit: 'Oversized Street Fit',
    care: ['غسيل آلي على 30 درجة'],
    isNew: true,
    rating: 4.7,
    reviewCount: 38,
    inStock: true
  },
  {
    id: 'hoodie-yellow-outcome',
    name: 'Eiffel "Outcome To" Mustard Yellow Hoodie',
    subtitle: 'Vibrant Yellow Fleece with Slogan Print / هودي إيفل أصفر Outcome To',
    price: 590,
    originalPrice: 700,
    category: 'men',
    subCategory: 'Hoodies & Sweaters',
    images: [
      getAsset('hoodie-yellow-outcome.jpg')
    ],
    colors: [
      { name: 'Mustard Yellow', hex: '#fbc02d' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'هودي أصفر مسطردة مفعم بالحيوية والدفء، مصنوع من خامات الميلتون الممتازة مع طباعة Outcome To على الصدر وجيب كانغرو رحب.',
    details: [
      'وبرة داخلية قطنية دافئة جداً وناعمة على البشرة',
      'لون مميز يمنح إطلالتك إشراقة شتوية لافتة',
      'مرفق مع بنطلون كارجو متناسق كطقم اختياري'
    ],
    composition: '80% Cotton, 20% Poly-Fleece',
    fit: 'Relaxed Fit',
    care: ['غسيل مقلوب بماء بارد'],
    isNew: true,
    tag: 'POPULAR',
    rating: 4.9,
    reviewCount: 63,
    inStock: true
  },

  // ==========================================
  // KIDS' WEAR (أطفال)
  // ==========================================
  {
    id: 'kids-burgundy-cardigan',
    name: 'Eiffel Kids Varsity Knit Cardigan',
    subtitle: 'Classic Burgundy Button-Up Knit with 03 Embroidery / كارديجان أطفال نبيتي كلاسيك مطرز',
    price: 390,
    originalPrice: 480,
    category: 'kids',
    subCategory: 'Outerwear',
    images: [
      getAsset('kids-burgundy-cardigan.jpg')
    ],
    colors: [
      { name: 'Burgundy & White Trim', hex: '#800020' }
    ],
    sizes: ['4-5 Y', '6-7 Y', '8-9 Y', '10-11 Y', '12-14 Y'],
    description: 'كارديجان أطفال شيك وفاخر مستوحى من ستايل الجامعات الأوروبية، محاك من خيوط قطنية ناعمة لا تسبب أي حساسية لبشرة الطفل مع أزرار كبيرة سهلة الاستخدام.',
    details: [
      'خامة تريكو قطنية 100% آمنة وناعمة ومريحة للأطفال',
      'تطريز بارز لرقم 03 وحروف كلاسيكية على الصدر والكم',
      'ياقة بيضاء مدمجة مع خطوط بيضاء عند الأساور والكمر'
    ],
    composition: '100% Anti-Allergic Soft Cotton Knit',
    fit: 'Comfortable Regular Kids Fit',
    care: ['غسيل يدوي أو دورة أطفال ناعمة'],
    isNew: true,
    isBestSeller: true,
    tag: 'KIDS FAVORITE',
    rating: 5.0,
    reviewCount: 57,
    inStock: true
  },
  {
    id: 'kids-leather-bomber',
    name: 'Eiffel Kids Urban Faux-Leather Bomber',
    subtitle: 'Zip-Up Lightweight Faux-Leather Jacket / جاكيت جلد أطفال أسود كاجوال',
    price: 490,
    originalPrice: 620,
    category: 'kids',
    subCategory: 'Outerwear',
    images: [
      getAsset('kids-leather-bomber.jpg')
    ],
    colors: [
      { name: 'Pitch Black', hex: '#111111' }
    ],
    sizes: ['6-7 Y', '8-9 Y', '10-11 Y', '12-14 Y', '14-16 Y'],
    description: 'جاكيت بومبر جلد أطفال كول وشديد الأناقة، مبطن بطبقة داخلية ناعمة وسحاب أمامي سريع مع ياقة وأساور مرنة تمنحه مظهر الرجال الكبار.',
    details: [
      'جلد صناعي مرن وخفيف الوزن لا يتقشر وسهل التنظيف',
      'بطانة داخلية ناعمة تحافظ على دفء الطفل',
      'سحاب أمامي أملس وجيوب جانبية'
    ],
    composition: 'PU Vegan Leather; Lining: 100% Soft Polyester',
    fit: 'Tailored Bomber Fit',
    care: ['مسح بقطعة قماش مبللة فقط'],
    isNew: true,
    tag: 'PREMIUM KIDS',
    rating: 4.9,
    reviewCount: 41,
    inStock: true
  },
  {
    id: 'kids-yellow-sweatshirt',
    name: 'Eiffel Kids Tarino Graphic Crewneck',
    subtitle: 'Mustard Yellow Crewneck with Multi-Color Brush Print / سويت شيرت أطفال أصفر Tarino',
    price: 340,
    category: 'kids',
    subCategory: 'Sweatshirts',
    images: [
      getAsset('kids-yellow-sweatshirt.jpg')
    ],
    colors: [
      { name: 'Bright Mustard', hex: '#fbc02d' }
    ],
    sizes: ['4-5 Y', '6-7 Y', '8-9 Y', '10-11 Y', '12-14 Y'],
    description: 'سويت شيرت أطفال أصفر مبهج مزين بطباعة حروف Tarino الملونة بفرشاة فنية، منسوج من القطن المصري المريح لأيام المدرسة واللعب.',
    details: [
      'قطن مصري 100% ناعم على الجلد',
      'ألوان طباعة صديقة للبيئة وآمنة للأطفال',
      'أساور وياقة مطاطية مريحة'
    ],
    composition: '100% Organic Egyptian Cotton',
    fit: 'Active Kids Fit',
    care: ['غسيل آلي على 30 درجة'],
    isNew: true,
    rating: 4.8,
    reviewCount: 36,
    inStock: true
  },
  {
    id: 'kids-striped-pullover',
    name: 'Eiffel Kids "Original" Striped Knit Pullover',
    subtitle: 'Green & Navy Horizontal Stripe Sweater / بلوفر أطفال مقلم كحلي في زيتي',
    price: 360,
    category: 'kids',
    subCategory: 'Knitwear',
    images: [
      getAsset('kids-striped-pullover.jpg')
    ],
    colors: [
      { name: 'Forest Green & Navy', hex: '#1b4d3e' }
    ],
    sizes: ['6-7 Y', '8-9 Y', '10-11 Y', '12-14 Y'],
    description: 'بلوفر أطفال خفيف شيك جداً بتوليفة ألوان كحلية وزيتية مقلمة مع كلمة Original ذهبية على الصدر، رائع للمناسبات العائلية والخروجات.',
    details: [
      'تريكو قطني ناعم لا يسبب أي حكة',
      'تقليمات متقنة وألوان كلاسيكية أنيقة',
      'سهل الارتداء والتنسيق مع الجينز'
    ],
    composition: '100% Soft Cotton Knit',
    fit: 'Classic Regular',
    care: ['غسيل يدوي بماء بارد'],
    isNew: false,
    rating: 4.7,
    reviewCount: 28,
    inStock: true
  },
  {
    id: 'kids-summer-denim-sets',
    name: 'Eiffel Kids Summer Graphic Tee Collection',
    subtitle: 'Striped & Tie-Dye Tops with Denim Cargo Shorts / تشكيلة تيشيرتات أطفال صيفية مع شورتات جينز',
    price: 390,
    originalPrice: 470,
    category: 'kids',
    subCategory: 'Sets & Tops',
    images: [
      getAsset('kids-striped-summer-tee.jpg'),
      getAsset('kids-tiedye-grey-tee.jpg'),
      getAsset('kids-daily-grind-tee.jpg')
    ],
    colors: [
      { name: 'Black & White Stripe', hex: '#111111' },
      { name: 'Tie-Dye Grey', hex: '#9e9e9e' },
      { name: 'Daily Grind Light Grey', hex: '#e0e0e0' }
    ],
    sizes: ['4-5 Y', '6-7 Y', '8-9 Y', '10-11 Y', '12-14 Y', '14-16 Y'],
    description: 'تشكيلة تيشيرتات صيفية أطفال بأشكال مرحة ورسومات جرافيك كول، مع شورتات جينز كارجو مريحة ومقاومة لكثرة الحركة واللعب.',
    details: [
      'قطن صيفي خفيف جداً يمتص العرق ويحافظ على انتعاش الطفل',
      'قصات مريحة وواسعة لحرية الحركة طوال اليوم',
      'متوفرة بأكثر من تصميم ولون صيفي رائع'
    ],
    composition: '100% Breathable Cotton',
    fit: 'Active Relaxed Fit',
    care: ['غسيل سريع بماء بارد'],
    isNew: true,
    isBestSeller: true,
    tag: 'SUMMER HIT',
    rating: 4.9,
    reviewCount: 74,
    inStock: true
  },

  // ==========================================
  // ACCESSORIES & WATCHES & BAGS (إكسسوارات وساعات وشنط)
  // ==========================================
  {
    id: 'watch-blue-chronograph',
    name: 'Eiffel Royal Chronograph Steel Watch',
    subtitle: 'Deep Navy Multi-Dial with Solid Stainless Steel Bracelet / ساعة كرونوغراف ستيل بمينا كحلي ملكي',
    price: 950,
    originalPrice: 1200,
    category: 'accessories',
    subCategory: 'Timepieces',
    images: [
      getAsset('watch-blue-chronograph.jpg')
    ],
    colors: [
      { name: 'Royal Navy & Silver Steel', hex: '#002244' }
    ],
    sizes: ['One Size (Adjustable Link Bracelet)'],
    description: 'ساعة يد رجالي كرونوغراف فخمة بتصميم رياضي فاخر، تتميز بمينا كحلي ملكي عميق مع عدادات فرعية دقيقة وسوار ستانلس ستيل مصقول ومقاوم للصدأ.',
    details: [
      'ماكينة كوارتز كرونوغراف يابانية عالية الدقة',
      'جسم وسوار من الستانلس ستيل 316L المقاوم للصدأ',
      'زجاج هاردليكس مقاوم للخدوش والصدمات الخفيفة',
      'تأتي في علبة إيفل الفاخرة المبطنة بالجلد والشمواه'
    ],
    composition: '316L Solid Stainless Steel Case & Strap',
    fit: '44mm Dial Diameter — قطر مينا مثالي للمعصم الرجالي',
    care: ['مقاومة للماء حتى 30 متر (الاستخدام اليومي والمطر)', 'تنظيف بقطعة قماش جافة'],
    isNew: true,
    isBestSeller: true,
    tag: 'LUXURY TIMEPIECE',
    rating: 5.0,
    reviewCount: 96,
    inStock: true
  },
  {
    id: 'watch-silver-dial',
    name: 'Eiffel Minimalist Silver Dial Steel Watch',
    subtitle: 'Sunburst Silver Dial with Precision Fluted Bezel / ساعة إيفل كلاسيك بمينا فضي مشع',
    price: 850,
    originalPrice: 1050,
    category: 'accessories',
    subCategory: 'Timepieces',
    images: [
      getAsset('watch-silver-dial.jpg')
    ],
    colors: [
      { name: 'Sunburst Silver', hex: '#e0e0e0' }
    ],
    sizes: ['One Size (Adjustable)'],
    description: 'ساعة كلاسيكية راقية تناسب البدل والقمصان الرسمية، مينا فضي عاكس للضوء مع عقارب وعلامات ساعات دقيقة وسوار جوبيليه ستيل مريح.',
    details: [
      'تصميم كلاسيكي خالد يلائم المناسبات الرسمية ورجال الأعمال',
      'سوار ستيل ناعم ومريح جداً على المعصم',
      'عرض التاريخ عند موضع الساعة 3'
    ],
    composition: 'Stainless Steel Case & Link Band',
    fit: '41mm Classic Size',
    care: ['مسح دوري بقطعة قماش ناعمة'],
    isNew: true,
    rating: 4.9,
    reviewCount: 64,
    inStock: true
  },
  {
    id: 'watch-tan-leather',
    name: 'Eiffel Diver Ceramic Bezel Tan Leather Watch',
    subtitle: 'Black Matte Dial with Camel Saddle-Stitched Leather Strap / ساعة إيفل سبورت بإطار سيراميك وسوار جلد هافان',
    price: 890,
    originalPrice: 1100,
    category: 'accessories',
    subCategory: 'Timepieces',
    images: [
      getAsset('watch-tan-leather.jpg')
    ],
    colors: [
      { name: 'Camel Tan Leather & Black Dial', hex: '#c19a6b' }
    ],
    sizes: ['One Size'],
    description: 'ساعة رياضية استثنائية تجمع بين إطار السيراميك الأسود التكتيكي وسوار جلد طبيعي بلون الهافان (Tan) مع خياطة يدوية بارزة.',
    details: [
      'سوار جلد طبيعي أصلي ناعم الملمس برائحة الجلد الطبيعي',
      'إطار سيراميك أسود دوار بتدريجات غوص دقيقة',
      'عقارب مضيئة في الظلام (Luminous Hands)'
    ],
    composition: 'Genuine Leather Strap, Ceramic Bezel, Stainless Steel Case',
    fit: '43mm Sport Dial',
    care: ['تجنب غمر الجلد في الماء للحفاظ على رونقه ولونه'],
    isNew: true,
    isBestSeller: true,
    tag: 'EXCLUSIVE',
    rating: 5.0,
    reviewCount: 78,
    inStock: true
  },
  {
    id: 'watch-black-sport',
    name: 'Eiffel Tactical Black Sport Watch & Sunglass Gift Set',
    subtitle: 'All-Black Chrono Watch with Polarized Luxury Sunglasses in Gift Box / طقم ساعة إيفل سوداء سبورت ونظارة شمسية في علبة هدايا',
    price: 980,
    originalPrice: 1300,
    category: 'accessories',
    subCategory: 'Timepieces',
    images: [
      getAsset('watch-black-sport.jpg')
    ],
    colors: [
      { name: 'Matte Stealth Black', hex: '#0a0a0a' }
    ],
    sizes: ['Gift Box Set (One Size)'],
    description: 'بوكس هدايا فاخر وشامل يضم ساعة رياضية سوداء بالكامل مع نظارة شمسية أنيقة بعدسات بولارايزد للحماية من الشمس، في علبة إيفل الفاخرة.',
    details: [
      'طقم هدية متكامل ومثالي للمناسبات والأعياد وأعياد الميلاد',
      'ساعة سوداء مات كرونوغراف بتصميم جريء وقوي',
      'نظارة شمسية UV400 لحماية تامة للعين من أشعة الشمس'
    ],
    composition: 'Matte Coated Alloy Case, Silicone Sport Strap, UV Polycarbonate Lens',
    fit: 'Universal Men Gift Size',
    care: ['مسح عدسات النظارة بقماش المايكروفايبر المرفق'],
    isNew: true,
    isBestSeller: true,
    tag: 'GIFT BOX',
    rating: 5.0,
    reviewCount: 135,
    inStock: true
  },
  {
    id: 'bag-crossbody-black',
    name: 'Eiffel Luxury Leather Horse & Carriage Crossbody',
    subtitle: 'Pebbled Black Leather with Gold Hardware / شنطة كروس جلد سوداء فاخرة',
    price: 650,
    originalPrice: 780,
    category: 'accessories',
    subCategory: 'Bags & Leather',
    images: [
      getAsset('bag-crossbody-black.jpg')
    ],
    colors: [
      { name: 'Pebbled Black & Gold', hex: '#111111' }
    ],
    sizes: ['Medium Dimensions (24cm x 20cm x 6cm)'],
    description: 'شنطة كروس رجالي جلد أسود حبيبي فاخر مزينة بشعار العربة الذهبي الشهير، حجم مثالي لحمل الموبايل، المحفظة، المفاتيح والنظارة بكل سهولة وأناقة.',
    details: [
      'جلد صناعي حبيبي عالي الجودة ومقاوم للخدوش والماء',
      'حزام كتف عريض قابل لتعديل الطول مع وسادة راحة',
      'سحابات ذهبية ناعمة ومقسمة من الداخل بجيوب متعددة'
    ],
    composition: 'High-Density Grained Faux Leather',
    fit: 'Standard Crossbody Size',
    care: ['مسح دوري بقطعة قماش ناعمة'],
    isNew: true,
    isBestSeller: true,
    tag: 'HOT ITEM',
    rating: 4.9,
    reviewCount: 84,
    inStock: true
  },
  {
    id: 'bag-lacoste-brown',
    name: 'Lacoste Embossed Leather Crossbody Messenger',
    subtitle: 'Rich Chocolate Brown with Tonal Crocodile Badge / شنطة كروس لاكوست جلد بني أنيقة',
    price: 690,
    originalPrice: 820,
    category: 'accessories',
    subCategory: 'Bags & Leather',
    images: [
      getAsset('bag-lacoste-brown.jpg')
    ],
    colors: [
      { name: 'Chocolate Brown', hex: '#3e2723' }
    ],
    sizes: ['Medium (25cm x 22cm x 7cm)'],
    description: 'شنطة كروس لاكوست باللون البني الشوكولاتة الغني، تتميز بجيب أمامي بسحاب معدني وشعار التمساح الأسود البارز، عملية جداً ومريحة.',
    details: [
      'جلد مات ناعم عالي المتانة ومقاوم للاهتراء اليومي',
      'جيب خارجي سريع الوصول للهاتف والمحفظة',
      'حزام متين من النسيج المقوى بشعار محفور'
    ],
    composition: 'Matte Finished Faux Leather & Nylon Strap',
    fit: 'Compact Messenger Fit',
    care: ['تنظيف بقطعة قماش مبللة خفيفة'],
    isNew: true,
    rating: 4.8,
    reviewCount: 62,
    inStock: true
  },
  {
    id: 'bag-jeep-leather',
    name: 'Jeep Heritage Distressed Leather Messenger Bag',
    subtitle: 'Vintage Saddle Leather with Metal D-Ring Accent / شنطة كروس جيب جلد طبيعي عتيق',
    price: 620,
    category: 'accessories',
    subCategory: 'Bags & Leather',
    images: [
      getAsset('bag-jeep-leather.jpg')
    ],
    colors: [
      { name: 'Vintage Dark Brown', hex: '#4a3525' }
    ],
    sizes: ['Medium-Large (26cm x 22cm x 8cm)'],
    description: 'شنطة كروس جيب الكلاسيكية بمظهر الجلد الطبيعي العتيق المتين والمفضل لعشاق الطابع الرجالي العملي والقوي، مزودة بحلقة D-Ring معدنية.',
    details: [
      'مظهر جلد طبيعي بلمسات عتيقة (Vintage Distressed Finish)',
      'جيوب متعددة بسحابات متينة وأقفال مغناطيسية قوية',
      'مساحة داخلية واسعة تتسع لكافة المتعلقات الشخصية والتابلت الصغير'
    ],
    composition: 'Heavy-Duty Vintage PU Leather',
    fit: 'Spacious Everyday Crossbody',
    care: ['مسح بمرطب جلود للمحافظة على الليونة واللمعان'],
    isNew: false,
    rating: 4.9,
    reviewCount: 91,
    inStock: true
  },
  {
    id: 'bag-crossbody-navy-check',
    name: 'Eiffel Geometric Navy Grid Crossbody Bag',
    subtitle: 'Water-Resistant Checkered Fabric with Metal Hardware / شنطة كروس كحلي كاروهات وتربروف',
    price: 550,
    originalPrice: 650,
    category: 'accessories',
    subCategory: 'Bags & Leather',
    images: [
      getAsset('bag-crossbody-navy-check.jpg')
    ],
    colors: [
      { name: 'Navy Grid Pattern', hex: '#1a237e' }
    ],
    sizes: ['Medium (24cm x 20cm x 6cm)'],
    description: 'شنطة كروس رجالي بنقشة الكاروهات الهندسية باللون الكحلي الجذاب، مصنوعة من قماش معالج ضد تسرب المياه وخفيف الوزن جداً.',
    details: [
      'قماش معالج طارد لقطرات المطر والماء (Water-Resistant)',
      'سحابات فضية ناعمة وسهلة الفتح والإغلاق',
      'تصميم خفيف الوزن لا يشكل أي عبء على الكتف'
    ],
    composition: 'Water-Resistant Coated Textile & Vegan Leather Accents',
    fit: 'Urban Compact Fit',
    care: ['غسيل يدوي ومسح خفيف'],
    isNew: true,
    rating: 4.7,
    reviewCount: 43,
    inStock: true
  },
  {
    id: 'bracelet-versace-steel-leather',
    name: 'Versace Greca Medusa Multi-Strand Bracelet',
    subtitle: 'Braided Black Leather with Greek Key Pattern Steel / إسورة فرزاتشي ميدوسا جلد طبيعي وستيل',
    price: 320,
    originalPrice: 420,
    category: 'accessories',
    subCategory: 'Jewelry',
    images: [
      getAsset('bracelet-versace-steel-leather.jpg')
    ],
    colors: [
      { name: 'Silver Steel & Black Leather', hex: '#000000' }
    ],
    sizes: ['Standard Men Size (21cm with extension)'],
    description: 'إسورة يد رجالي فاخرة بتصميم فرزاتشي الشهير، تجمع بين 3 طبقات من الجلد المجدول وقطعة ستيل مصقولة محفورة بنقش المفتاح الإغريقي ورأس الميدوسا.',
    details: [
      'ستانلس ستيل 316L لا يغير لونه ولا يصدأ مع العرق أو الماء',
      'جلد طبيعي مجدول ناعم ومريح على المعصم',
      'قفل مغناطيسي محكم وسهل الارتداء'
    ],
    composition: 'Stainless Steel & Braided Genuine Leather',
    fit: 'Standard 21cm Wrist Fit',
    care: ['تجنب ملامسة العطور المباشرة للحفاظ على بريق الستيل'],
    isNew: true,
    isBestSeller: true,
    tag: 'LUXURY JEWELRY',
    rating: 5.0,
    reviewCount: 89,
    inStock: true
  },
  {
    id: 'bracelet-cartier-braided',
    name: 'Cartier Classic Braided Leather Clasp Bracelet',
    subtitle: 'Triple-Strand Black Leather with Engraved Steel Clasp / إسورة كارتييه كلاسيك جلد مجدول بقفل ستيل',
    price: 290,
    originalPrice: 380,
    category: 'accessories',
    subCategory: 'Jewelry',
    images: [
      getAsset('bracelet-cartier-braided.jpg')
    ],
    colors: [
      { name: 'Onyx Noir & Silver Clasp', hex: '#111111' }
    ],
    sizes: ['20.5cm Standard'],
    description: 'إسورة كارتييه الرجالية الأنيقة المجدولة من الجلد الأسود الفاخر، مزودة بقفل ستيل محفور بدقة، تضفي لمسة فخامة هادئة بجانب ساعتك.',
    details: [
      'حبل جلدي مجدول متعدد الطبقات فائق النعومة والمتانة',
      'قفل ستانلس ستيل محفور بالليزر ومقاوم للخدش',
      'مثالية للارتداء اليومي ومع الساعات الكلاسيكية'
    ],
    composition: 'Genuine Braided Leather & 316L Stainless Steel',
    fit: '20.5cm Length',
    care: ['مسح بقطعة قماش ناعمة'],
    isNew: true,
    rating: 4.9,
    reviewCount: 71,
    inStock: true
  },
  {
    id: 'mens-leather-steel-bracelet',
    name: 'Eiffel Beaded & Multi-Strand Leather Bracelet',
    subtitle: 'Matte Black Beads & Braided Rope Layers / سوار رجالي متعدد الطبقات جلد وخرز فاخر',
    price: 250,
    category: 'accessories',
    subCategory: 'Jewelry',
    images: [
      getAsset('mens-leather-steel-bracelet.jpg')
    ],
    colors: [
      { name: 'Matte Black & Silver', hex: '#111111' }
    ],
    sizes: ['One Size Fits All (Adjustable / Elastic)'],
    description: 'سوار رجالي يجمع بين خرز الحجر البركاني الأسود المات وحبال الجلد المجدولة، يمنح معصمك طابعاً عصرياً شبابياً جذاباً.',
    details: [
      'خرز أسود طبيعي مات عالي الجودة',
      'حبال جلدية متينة مقاومة للقطع',
      'قفل مغناطيسي ستيل سهل الإغلاق باليد الواحدة'
    ],
    composition: 'Natural Stone Beads, Leather Cord, Steel Fastener',
    fit: 'Adjustable 19-22cm',
    care: ['حفظ في علبة المجوهرات عند عدم الاستخدام'],
    isNew: false,
    rating: 4.8,
    reviewCount: 54,
    inStock: true
  },
  {
    id: 'sneaker-adidas-grey',
    name: 'Adidas Climacool Athletic Running Sneakers — Grey/Navy',
    subtitle: 'Lightweight Breathable Mesh Cushioning Trainers / كوتشي أديداس رياضي كلايما كول رمادي وكحلي',
    price: 850,
    originalPrice: 1100,
    category: 'accessories',
    subCategory: 'Footwear',
    images: [
      getAsset('sneaker-adidas-grey.jpg')
    ],
    colors: [
      { name: 'Cool Grey & Navy Blue', hex: '#78909c' }
    ],
    sizes: ['41', '42', '43', '44', '45'],
    description: 'كوتشي أديداس رياضي احترافي بتقنية كلايما كول للتهوية وراحة القدمين أثناء المشي الطويل والجري، نعل ممتص للصدمات بتصميم عصري جريء.',
    details: [
      'شبكة علوية مسامية تسمح بتدفق الهواء وتمنع التعرق',
      'نعل أوسط ممتص للصدمات (Cloud Cushioning Foam)',
      'نعل سفلي مطاطي بنمط متعرج يمنع الانزلاق على كافة الأسطح',
      'مقاسات من 41 حتى 45'
    ],
    composition: 'Breathable Mesh Upper, EVA Midsole, Rubber Traction Outsole',
    fit: 'True to Standard European Size (مقاس مريح ومضبوط)',
    care: ['تنظيف بفرشاة ناعمة وماء فاتر'],
    isNew: true,
    isBestSeller: true,
    tag: 'SPORTS SALE',
    rating: 4.9,
    reviewCount: 118,
    inStock: true
  },
  {
    id: 'sneaker-adidas-white',
    name: 'Adidas Dynamic Cushioning Sneakers — White/Navy',
    subtitle: 'Streamlined Aerodynamic Sport Shoe / كوتشي أديداس أبيض في كحلي ديناميك',
    price: 850,
    originalPrice: 1050,
    category: 'accessories',
    subCategory: 'Footwear',
    images: [
      getAsset('sneaker-adidas-white.jpg')
    ],
    colors: [
      { name: 'White & Navy Three-Stripes', hex: '#ffffff' }
    ],
    sizes: ['41', '42', '43', '44', '45'],
    description: 'كوتشي أديداس أبيض أنيق مع الخطوط الثلاثية الكحلية ولمسات فسفورية خفيفة في النعل، يجمع بين الأداء الرياضي وشياكة الكاجوال اليومي.',
    details: [
      'هيكل خفيف ومرن يدعم حركة القدم الطبيعية',
      'بطانة داخلية ميموري فوم مريحة لكعب القدم',
      'مثالي للارتداء مع الجينز والترنجات والشورتات'
    ],
    composition: 'Synthetic Leather & Technical Mesh Upper',
    fit: 'Standard Regular Size',
    care: ['مسح بقطعة قماش مبللة للحفاظ على بياض الحذاء'],
    isNew: true,
    rating: 4.8,
    reviewCount: 92,
    inStock: true
  }
];

export interface CategoryCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  count: number;
  href: string;
}

export const CATEGORIES: CategoryCard[] = [
  {
    id: 'men',
    title: 'MENSWEAR',
    subtitle: 'Oversized Tees, Polos, Cardigans & Tailored Pants',
    image: getAsset('mens-olive-tee-beige-pants.jpg'),
    count: 15,
    href: '/collections/men'
  },
  {
    id: 'offers',
    title: 'SPECIAL OFFERS',
    subtitle: 'Seasonal Markdown & Complete Look Packages',
    image: getAsset('eiffel-cardigan-trio.jpg'),
    count: 12,
    href: '/collections/offers'
  },
  {
    id: 'kids',
    title: 'KIDS COLLECTION',
    subtitle: 'Varsity Knits, Leather Bombers & Summer Sets',
    image: getAsset('kids-burgundy-cardigan.jpg'),
    count: 5,
    href: '/collections/kids'
  },
  {
    id: 'accessories',
    title: 'TIMEPIECES & LEATHER',
    subtitle: 'Steel Chronographs, Crossbody Bags & Bracelets',
    image: getAsset('watch-blue-chronograph.jpg'),
    count: 11,
    href: '/collections/accessories'
  }
];

export interface LookbookHotspotItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  products: {
    productId: string;
    label: string;
    top: string;
    left: string;
  }[];
}

export const LOOKBOOK_HOTSPOTS: LookbookHotspotItem[] = [
  {
    id: 'look-1',
    title: 'Smart Casual Ensemble',
    subtitle: 'The Complete Eiffel Signature Day & Night Look',
    image: getAsset('eiffel-outfit-flatlay.jpg'),
    products: [
      { productId: 'mens-oxford-shirts-collection', label: 'Classic Oxford Shirt', top: '35%', left: '48%' },
      { productId: 'mens-pants-collection-colors', label: 'Tailored Chino Trousers', top: '65%', left: '60%' },
      { productId: 'sneaker-adidas-white', label: 'Adidas Sport Sneakers', top: '80%', left: '30%' },
      { productId: 'watch-black-sport', label: 'Tactical Watch & Gift Box', top: '25%', left: '20%' }
    ]
  },
  {
    id: 'look-2',
    title: 'Retro Knit & Raw Denim',
    subtitle: 'Vintage Striped Knit Polo with Handcrafted Accessories',
    image: getAsset('polo-striped-outfit.jpg'),
    products: [
      { productId: 'mens-polo-striped-outfit', label: 'Retro Striped Knit Polo', top: '40%', left: '50%' },
      { productId: 'mens-pants-collection-colors', label: 'Tailored Gabardine Pants', top: '75%', left: '35%' },
      { productId: 'bracelet-versace-steel-leather', label: 'Versace Greca Bracelet', top: '60%', left: '85%' }
    ]
  },
  {
    id: 'look-3',
    title: 'Mineral Washed Comfort',
    subtitle: 'Acid-Wash Heavyweight Cotton & Crossbody Leather',
    image: getAsset('mens-brown-wash-tee-jeans.jpg'),
    products: [
      { productId: 'mens-brown-wash-tee-jeans', label: 'Washed Cocoa Tee', top: '40%', left: '35%' },
      { productId: 'bag-lacoste-brown', label: 'Lacoste Crossbody Bag', top: '55%', left: '70%' },
      { productId: 'watch-tan-leather', label: 'Diver Ceramic Leather Watch', top: '30%', left: '75%' }
    ]
  }
];
