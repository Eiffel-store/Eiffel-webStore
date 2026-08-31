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
    titleAr: 'المقاسات ودليل التلبيس',
    questions: [
      {
        qEn: 'How do EIFFEL sizes fit?',
        qAr: 'كيف أختار المقاس المناسب لمنتجات إيفل؟',
        aEn: 'Our clothing features accurate, modern regular and relaxed fits. We recommend choosing your usual size, or checking the size guide on each product page.',
        aAr: 'تتميز ملابسنا بمقاسات وتلبيس مصري قياسي مظبوط ومريح. ننصح باختيار مقاسك المعتاد، أو مراجعة جدول المقاسات التوضيحي الموجود بصفحة كل منتج.'
      },
      {
        qEn: 'Can I try on the sizes before paying?',
        qAr: 'هل يمكنني معاينة وتجربة المقاس عند استلام الطلب؟',
        aEn: 'Yes! Our delivery service allows you to inspect the items upon delivery. You can also visit our branches in Zefta and Nahtay to try them on.',
        aAr: 'نعم بكل تأكيد! يمكنك معاينة وتجربة المقاس والتأكد من جودة القماش مع مندوب الشحن قبل دفع أي مبلغ، أو تشريفنا بزيارة فروعنا في زفتى ونهطاي.'
      }
    ]
  },
  {
    id: 'craft',
    titleEn: 'FABRICS & QUALITY',
    titleAr: 'جودة الخامات والملابس',
    questions: [
      {
        qEn: 'What materials and fabrics are available at EIFFEL?',
        qAr: 'ما هي الخامات والأقمشة المتوفرة في متجر إيفل؟',
        aEn: 'We carefully select all our ready-to-wear apparel from trusted manufacturers using high-grade Egyptian cotton and comfortable durable fabrics that hold up wash after wash.',
        aAr: 'نختار جميع ملابسنا الجاهزة بعناية فائقة من أجود الخامات والأقطان المصرية والأقمشة المريحة وعالية الجودة التي تحافظ على رونقها وألوانها مع الاستخدام والغسيل المتكرر.'
      },
      {
        qEn: 'How should I care for and wash my garments?',
        qAr: 'كيف أحافظ على الملابس عند الغسيل؟',
        aEn: 'We recommend gentle washing with cold water and following the care instructions on each garment label to maintain colors and fabric softness.',
        aAr: 'ننصح بالغسيل المعتدل بالماء الفاتر أو البارد، واتباع إرشادات الغسيل الموضحة على تيكت كل قطعة للحفاظ على نعومة القماش وثبات الألوان.'
      }
    ]
  }
];
