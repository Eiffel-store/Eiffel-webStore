export interface FAQItem {
  qEn: string;
  qAr: string;
  aEn: string;
  aAr: string;
  q?: string;
  a?: string;
}

export interface FAQCategory {
  id: string;
  titleEn: string;
  titleAr: string;
  title?: string;
  questions: FAQItem[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'orders',
    titleEn: 'SHIPPING & DELIVERY ACROSS EGYPT',
    titleAr: 'الطلبات والشحن والتوصيل',
    questions: [
      {
        qEn: 'What are the delivery timeframes across Egypt?',
        qAr: 'ما هي مواعيد ومدة توصيل الطلبات داخل مصر؟',
        aEn: 'We provide complimentary Express Courier delivery for all orders over 1,500 EGP. Orders in Greater Cairo and Giza are delivered within 24–48 hours. Orders to Alexandria, the Delta, and other governorates arrive within 2–3 business days.',
        aAr: 'نوفر خدمة التوصيل السريع لجميع المحافظات مع شحن مجاني للطلبات بقيمة 1,500 جنيه أو أكثر. يتم التوصيل داخل القاهرة الكبرى والجيزة خلال 24 إلى 48 ساعة، ومحافظات الإسكندرية والدلتا وباقي الجمهورية خلال 2 إلى 3 أيام عمل.'
      },
      {
        qEn: 'What payment methods are supported for my order?',
        qAr: 'ما هي طرق الدفع المتاحة لإتمام الطلب؟',
        aEn: 'We accept Cash on Delivery (COD) across all Egyptian governorates. You can also pay via electronic payment, credit/debit cards, and InstaPay.',
        aAr: 'نقبل الدفع عند الاستلام (COD) في جميع محافظات مصر، بالإضافة إلى الدفع الإلكتروني والبطاقات البنكية وخدمة انستاباي (InstaPay).'
      },
      {
        qEn: 'Can I inspect and try on the pieces before accepting the courier delivery?',
        qAr: 'هل يمكنني معاينة المنتجات والتأكد من المقاس عند استلام الشحنة؟',
        aEn: 'Yes, our courier service allows you to inspect the pieces upon delivery to ensure optimal sizing and premium luxury quality before finalizing payment.',
        aAr: 'نعم بكل تأكيد، تتيح لك خدمة التوصيل معاينة القطع والتأكد من جودتها ومقاسها بحضور مندوب التوصيل قبل إتمام السداد.'
      }
    ]
  },
  {
    id: 'returns',
    titleEn: 'RETURNS & EXCHANGES IN EGYPT',
    titleAr: 'الإرجاع والاستبدال',
    questions: [
      {
        qEn: 'What is your return and size exchange policy in Egypt?',
        qAr: 'ما هي سياسة الاسترجاع واستبدال المقاسات؟',
        aEn: 'In accordance with Egyptian consumer protection regulations, we offer a 14-day doorstep exchange and return policy. Our dedicated courier will collect the unworn piece in its original condition from your residence.',
        aAr: 'وفقاً لقانون حماية المستهلك المصري، نوفر سياسة استبدال واسترجاع مرنة خلال 14 يوماً من تاريخ الاستلام، حيث يصلك المندوب حتى باب منزلك لاستلام القطعة بحالتها الأصلية.'
      },
      {
        qEn: 'Can I exchange or return my online order at your branches?',
        qAr: 'هل يمكنني استبدال أو إرجاع طلبي الإلكتروني من خلال فروع إيفل؟',
        aEn: 'Yes. You can visit any of our official branches with your order confirmation/invoice for instant sizing exchange or return.',
        aAr: 'نعم، يمكنك زيارة أي فرع من فروعنا الرسمية مع إظهار رقم الطلب أو الفاتورة لإتمام الاستبدال الفوري للمقاس أو استرجاع المنتج.'
      }
    ]
  },
  {
    id: 'sizing',
    titleEn: 'SIZING & FIT GUIDE',
    titleAr: 'المقاسات ودليل الجسم',
    questions: [
      {
        qEn: 'How do EIFFEL sizes fit?',
        qAr: 'كيف أختار المقاس المناسب لمنتجات إيفل؟',
        aEn: 'Our silhouettes feature modern tailored cuts and structured fits. We recommend choosing your standard size for the intended elegant fit, or consulting our interactive size guide on each product page.',
        aAr: 'تتميز تشكيلاتنا بقصات إيطالية عصرية متقنة. ننصح باختيار مقاسك المعتاد للحصول على المظهر الأنيق المثالي، أو مراجعة دليل المقاسات التفاعلي الموجود بصفحة كل منتج.'
      },
      {
        qEn: 'Do you offer tailoring alterations or custom adjustments?',
        qAr: 'هل تقدمون خدمة تعديل أو ضبط المقاسات؟',
        aEn: 'Yes, we provide complimentary minor tailoring adjustments at our official branches to ensure a flawless bespoke fit.',
        aAr: 'نعم، نقدم خدمة ضبط وتعديل المقاسات البسيطة في فروعنا لضمان ملاءمة القطعة التامة لمقاسك ومظهرك.'
      }
    ]
  },
  {
    id: 'craft',
    titleEn: 'FABRICS & CRAFTSMANSHIP',
    titleAr: 'الخياطة والأقمشة الفاخرة',
    questions: [
      {
        qEn: 'What materials are used in EIFFEL collections?',
        qAr: 'ما هي الخامات والأقمشة المستخدمة في مجموعات إيفل؟',
        aEn: 'We craft our collections using premium Egyptian Giza cotton, Italian virgin wool, and luxury fabric blends, ensuring exceptional breathability, comfort, and longevity.',
        aAr: 'نصنع تشكيلاتنا باستخدام أجود أنواع القطن المصري طويل التيلة (جيزة)، وأصواف الفيرجن الإيطالية، والأقمشة المعالجة الفاخرة لضمان أقصى درجات الراحة والمتانة.'
      },
      {
        qEn: 'How should I care for and maintain my garments?',
        qAr: 'كيف أحافظ على القطع والملابس عند الغسيل؟',
        aEn: 'We recommend dry cleaning for formal suits and coats, and gentle cold washing for luxury cotton shirts, knitwear, and polo shirts.',
        aAr: 'ننصح بالتنظيف الجاف (Dry Clean) للبدل والمعاطف والقطع الصوفية، والغسيل اللطيف بالماء البارد للقمصان والتيشرتات القطنية للحفاظ على النسيج والألوان.'
      }
    ]
  }
];
