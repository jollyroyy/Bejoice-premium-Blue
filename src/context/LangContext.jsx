import { createContext, useContext, useState, useEffect } from 'react'

export const LANGS = {
  en: {
    dir: 'ltr',
    navBook: 'Book Call with Freight Expert',
    navBookShort: 'Book a Call',
    getQuote: 'Get a Quote',
    ourServices: 'Our Services',
    trackNow: 'TRACK NOW',
    whereShipment: 'WHERE IS YOUR SHIPMENT?',
    trackSub: 'Enter your BL / AWB / Container No. for an instant WhatsApp update.',
    trackPlaceholder: 'e.g. MSKU1234567 or 157-12345678',
    servicesLabel: 'Our Services',
    whyUs: 'Why Bejoice',
    contact: 'Contact',
    certifiedBy: 'Certified By',
    footerRights: '© 2024 Bejoice Group. All rights reserved.',
    calcTitle: 'Freight Calculators',
    calcSub: 'Accurate CBM and chargeable weight estimates in real time — Sea, Air, Land or Warehouse — before you send us an enquiry.',
    calcGenerate: 'GENERATE AI ANALYSIS',
    calcTabs: { sea: 'Sea', air: 'Air', land: 'Land', warehouse: 'Warehouse' },
    containerGuide: 'Container Guide',
  },
  ar: {
    dir: 'rtl',
    navBook: 'احجز مكالمة مع خبير الشحن',
    navBookShort: 'احجز مكالمة',
    getQuote: 'احصل على عرض سعر',
    ourServices: 'خدماتنا',
    trackNow: 'تتبع الآن',
    whereShipment: 'أين شحنتك؟',
    trackSub: 'أدخل رقم البوليصة / AWB / الحاوية للحصول على تحديث فوري عبر واتساب.',
    trackPlaceholder: 'مثال: MSKU1234567',
    servicesLabel: 'خدماتنا',
    whyUs: 'لماذا بيجويس',
    contact: 'تواصل معنا',
    certifiedBy: 'معتمد من',
    footerRights: '© 2024 مجموعة بيجويس. جميع الحقوق محفوظة.',
    calcTitle: 'حاسبات الشحن',
    calcSub: 'احسب حجم الشحنة والوزن القابل للشحن في الوقت الفعلي — بحراً أو جواً أو براً أو تخزين.',
    calcGenerate: 'إنشاء تحليل ذكي',
    calcTabs: { sea: 'بحري', air: 'جوي', land: 'بري', warehouse: 'تخزين' },
    containerGuide: 'دليل الحاويات',
  },
}

// Read current language from the googtrans cookie (set on page reload)
function detectLangFromCookie() {
  try {
    const match = document.cookie.split(';').find(s => s.trim().startsWith('googtrans='))
    if (match && match.includes('/ar')) return 'ar'
  } catch {}
  return 'en'
}

const LangContext = createContext({ lang: 'en', t: LANGS.en, setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detectLangFromCookie)

  const setLang = (l) => {
    setLangState(l)
    document.documentElement.lang = l
    document.documentElement.dir = LANGS[l].dir
  }

  useEffect(() => {
    const l = detectLangFromCookie()
    document.documentElement.lang = l
    document.documentElement.dir = LANGS[l].dir
  }, [])

  return (
    <LangContext.Provider value={{ lang, t: LANGS[lang], setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
