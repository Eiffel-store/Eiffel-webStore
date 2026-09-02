# قاعدة الترجمة والنصوص المترجمة (i18n Translation Rule)

## 1. الحظر التام لاستخدام `isRTL` في الترجمة
- **ممنوع تماماً** استخدام المتغير `isRTL` في جمل شرطية لاختيار النصوص بين العربي والإنجليزي مثل:
  ```tsx
  // ❌ ممنوع قطيعاً:
  {isRTL ? 'طلب استبدال' : 'Exchange Request'}
  placeholder={isRTL ? 'ابحث هنا...' : 'Search here...'}
  ```

## 2. الإلزام باستخدام قاموس الترجمة المركزي `t`
- **يجب دائماً** استخدام دالة وكائن الترجمة `t` المستخرج من `useLanguage()`:
  ```tsx
  // ✅ الاستخدام المعتمد والصحيح:
  const { t } = useLanguage();
  
  <span>{t.requestExchange}</span>
  placeholder={t.searchPlaceholder}
  ```
- عند الحاجة لأي نص جديد غير متوفر، يجب إضافته في 3 ملفات مركزية:
  1. `src/i18n/types.ts` (تعريف النوع)
  2. `src/i18n/locales/ar.ts` (الترجمة العربية)
  3. `src/i18n/locales/en.ts` (الترجمة الإنجليزية)

## 3. الحالات المسموحة فقط لاستخدام `isRTL`
يُسمح بـ `isRTL` حصراً في الأمور البصرية والاتجاهات Layout & Styling:
- اتجاه الصفحة والعناصر: `dir={isRTL ? 'rtl' : 'ltr'}`
- كلاسات المحاذاة والتموضع: `text-right` / `text-left`، `right-4` / `left-4`
- أيقونات الاتجاهات وتدوير الأسهم: `isRTL ? <ArrowRight /> : <ArrowLeft />` أو `isRTL ? 'rotate-180' : ''`
- وسيط المتصفح لتنسيق التاريخ الزمني: `toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')`

## 4. حقول قواعد البيانات ثنائية اللغة
- إذا كانت البيانات قادمة من قاعدة البيانات وبها حقل عربي وإنجليزي (مثل `banner.titleAr` و `banner.titleEn`)، يتم فحص اللغة عبر `language === 'ar'` وليس عبر `isRTL`.
