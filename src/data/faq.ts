export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQCategory {
  id: string;
  title: string;
  questions: FAQItem[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'orders',
    title: 'SHIPPING & DELIVERY ACROSS EGYPT',
    questions: [
      {
        q: 'What are the delivery timeframes across Egypt?',
        a: 'We provide complimentary Express Courier delivery for all orders over 3,000 EGP. Orders in Greater Cairo (Zamalek, New Cairo, Sheikh Zayed, Maadi, Heliopolis) and Giza are delivered within 24–48 hours. Orders to Alexandria, the Delta, and coastal destinations (El Gouna, Hurghada, North Coast) arrive within 2–3 business days.'
      },
      {
        q: 'Can I pay via InstaPay or Cash on Delivery (COD)?',
        a: 'Yes. We accept Cash on Delivery (COD) across all Egyptian governorates, instant transfers via InstaPay (@eiffel.egypt), Mobile Wallets (Vodafone Cash, Orange Money), and all major Credit/Debit Cards including Meeza, Visa, and Mastercard.'
      },
      {
        q: 'Can I inspect and try on the pieces before accepting the courier delivery?',
        a: 'Yes, our VIP White Glove delivery service allows you to inspect the garment in the presence of our courier representative to ensure optimal sizing and quality.'
      }
    ]
  },
  {
    id: 'returns',
    title: 'RETURNS & EXCHANGES IN EGYPT',
    questions: [
      {
        q: 'What is your return and size exchange policy in Egypt?',
        a: 'In accordance with Egyptian consumer protection regulations, we offer a 14-day doorstep exchange and return policy. Our dedicated courier will collect the unworn piece directly from your residence in Cairo, Alexandria, or other governorates with complimentary return shipping.'
      },
      {
        q: 'Can I exchange or return my online order at your Cairo or Alexandria boutiques?',
        a: 'Yes. You can bring your order confirmation to our flagship boutiques in Zamalek (14 Abou El Feda St) or 5A Waterway New Cairo for instant sizing exchange or atelier alterations.'
      }
    ]
  },
  {
    id: 'sizing',
    title: 'SIZING & BESPOKE ATELIER TAILORING',
    questions: [
      {
        q: 'How do EIFFEL sizes fit?',
        a: 'Our silhouettes feature modern architectural boxy cuts and structured tailoring. We recommend choosing your standard size for the intended runway silhouette, or one size down for a classic tailored fit.'
      },
      {
        q: 'Do you offer custom tailoring in Egypt?',
        a: 'Yes. Complimentary bespoke sleeve and hem adjustments are provided with every tailored trench, overcoat, and wool trouser purchase at our Zamalek and New Cairo atelier suites.'
      }
    ]
  },
  {
    id: 'craft',
    title: 'EGYPTIAN GIZA COTTON & TEXTILE HERITAGE',
    questions: [
      {
        q: 'What materials are used in EIFFEL collections?',
        a: 'We combine authentic extra-long staple Egyptian Giza Cotton (Giza 86 / 45) with Japanese 700GSM loopwheel knitting and Italian virgin wools. Our heavyweight combed cotton jerseys provide unmatched density, breathability, and structural longevity.'
      },
      {
        q: 'Where are the garments designed and assembled?',
        a: 'Our designs are conceptualized in Paris and finished in specialized luxury ateliers across Cairo, Wakayama, and Florence with strict quality standards.'
      }
    ]
  }
];
