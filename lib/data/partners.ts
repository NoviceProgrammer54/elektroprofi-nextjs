const unitLogo      = "/logos/unit.png";
const kvtLogo       = "/logos/kvt.ico";
const megalightLogo = "/logos/megalight.png";
const ektLogo       = "/logos/ekt.png";
const chintLogo     = "/logos/chint.png";
const promrukavLogo = "/logos/promrukav.svg";
const ptkAstanaLogo = "";
// Источники логотипов (поддерживать вручную при необходимости):
// - Legrand:           https://www.legrand.com/themes/custom/legrand/images/logo.png
// - IEK GROUP:         https://www.iek.ru/local/templates/mainpage_2024/images/logo.svg
// - CHINT:             https://www.chintglobal.com/content/dam/chintsite/common/system/logo.png
// - Systeme Electric:  https://systeme.ru/_nuxt/img/logo.7e55443.svg
// - Промрукав:         https://www.promrukav.ru/favicon.svg
// - КВТ:               https://kvt.su/favicon.ico
// - ЕКТ (Электрокомплект): https://ekt.kz/favicon.ico
// - UNIT:              https://unitgroup.ru/sites/default/files/footer-logo_0.png
// - MEGALIGHT:         TODO: добавить рабочий внешний URL логотипа
// - BI Group:          TODO: добавить рабочий внешний URL логотипа
// - BAZIS:             TODO: добавить рабочий внешний URL логотипа
// - RAMS Kazakhstan:   https://rams.kz/images/favicon.svg?1776347596
// - Qazaq Stroy:       https://qazaqstroy.kz/themes/default/assets/sprite-icons/qs-ny-logo.png
// - CCK:               TODO: добавить рабочий внешний URL логотипа
// - Siphouzz:          TODO: добавить рабочий внешний URL логотипа
// - IT KAZAKHSTAN:     TODO: добавить рабочий внешний URL логотипа
// - SLET.ASIA:         TODO: добавить рабочий внешний URL логотипа
// - Power Grid:        TODO: добавить рабочий внешний URL логотипа
// - ADVERSO:           https://adverso.kz/img/logos/header__logo.svg
// TODO: при появлении более качественных SVG-логотипов — заменить URL ниже.

export interface Partner {
  name: string;
  text: string;
  logo?: string;
  url?: string;
  /** Подсказка PartnerLogo — нужно ли инвертировать (для тёмных силуэтов). */
  logoVariant?: "color" | "mono-light";
}

export interface PartnerCategory {
  id: string;
  title: string;
  titleKz: string;
  description: string;
  descriptionKz: string;
  partners: Partner[];
}

export const partnerCategories: PartnerCategory[] = [
  {
    id: "brand",
    title: "Бренд-партнёры",
    titleKz: "Бренд-серіктестер",
    description:
      "Ведущие производители электротехнической продукции, которые в рамках сотрудничества с ГК «Электрокомплект» оказывают прямую поддержку сообществу ELEKTROPROFI и развитию профессиональной среды электромонтажников.",
    descriptionKz:
      "«Электрокомплект» компаниялар тобымен серіктестік аясында ELEKTROPROFI қауымдастығын тікелей қолдайтын электротехникалық өнімнің жетекші өндірушілері.",
    partners: [
      {
        name: "Legrand",
        text: "Французский лидер в электротехнической продукции, щитовом оборудовании и системах автоматизации зданий.",
        logo: "/logos/legrand.png",
        url: "https://www.legrand.com",
      },
      {
        name: "IEK",
        text: "Широкая линейка модульной аппаратуры, корпусов и щитового оборудования для жилых и промышленных объектов.",
        logo: "/logos/iek.svg",
        url: "https://www.iek.ru",
      },
      {
        name: "CHINT",
        text: "Глобальный производитель защитной, пусковой и низковольтной аппаратуры.",
        logo: chintLogo,
        url: "https://chintglobal.com",
      },
      {
        name: "Systeme Electric",
        text: "Решения для коммерческих и инфраструктурных объектов, преемник продуктовой линейки Schneider Electric.",
        logo: "/logos/systeme.svg",
        url: "https://systeme.ru",
      },
      {
        name: "Промрукав",
        text: "Кабеленесущие системы, гофрированные и гладкие трубы, аксессуары для электромонтажа.",
        logo: promrukavLogo,
        url: "https://promrukav.ru",
      },
      {
        name: "КВТ",
        text: "Профессиональный электромонтажный инструмент, наконечники и расходные материалы.",
        logo: kvtLogo,
        url: "https://kvt.su",
      },
      {
        name: "ЕКТ",
        text: "Электротехническая продукция и оборудование, поставляемые по всему Казахстану.",
        logo: ektLogo,
        url: "https://ekt.kz",
      },
      {
        name: "UNIT",
        text: "Светотехническое оборудование и решения для систем освещения.",
        logo: unitLogo,
        url: "https://unitgroup.ru",
      },
      {
        name: "MEGALIGHT",
        text: "Декоративное и техническое освещение для жилых и коммерческих интерьеров.",
        logo: megalightLogo,
        url: "https://megalight.kz",
      },
    ],
  },
  {
    id: "business",
    title: "Бизнес-партнёры",
    titleKz: "Бизнес-серіктестер",
    description:
      "Девелоперы и строительные компании, которые сотрудничают с участниками сообщества ELEKTROPROFI в рамках реализации жилых и коммерческих проектов.",
    descriptionKz:
      "ELEKTROPROFI қатысушыларымен тұрғын үй және коммерциялық жобаларды іске асыратын девелоперлер мен құрылыс компаниялары.",
    partners: [
      {
        name: "CCK",
        text: "Строительно-монтажный подрядчик.",
        url: "https://cck.kz",
      },
      {
        name: "Siphouzz",
        text: "Партнёр по жилым и коммерческим объектам.",
        url: "https://siphouzz.com",
      },
    ],
  },
  {
    id: "tech",
    title: "Технические партнёры",
    titleKz: "Техникалық серіктестер",
    description:
      "Подрядные организации, прорабы, архитекторы и дизайнеры, с которыми электромонтажники сообщества работают в одной команде на проектах.",
    descriptionKz:
      "Қауымдастық электриктерімен бір командада жұмыс істейтін мердігер ұйымдар, прорабтар, сәулетшілер мен дизайнерлер.",
    partners: [
      {
        name: "IT KAZAKHSTAN",
        text: "Слаботочные системы, СКС и сетевая инфраструктура.",
        url: "https://itkazakhstan.kz",
      },
    ],
  },
  {
    id: "education",
    title: "Образовательные партнёры",
    titleKz: "Білім беру серіктестері",
    description:
      "Колледжи и учебные центры, с которыми сообщество ведёт открытые лекции, мастер-классы и поддерживает студентов технических специальностей.",
    descriptionKz:
      "Қауымдастық ашық дәрістер, шеберлік сабақтар өткізетін және техникалық мамандық студенттерін қолдайтын колледждер.",
    partners: [
      // Колледжи: качественных лого нет в открытом доступе — оставляем текстовые чипы.
      // TODO: заменить на реальные логотипы при получении от учебных заведений.
      { name: "Колледж АУЭС", text: "Алматы. Подготовка специалистов в области энергетики и связи." },
      { name: "Колледж архитектуры и дизайна", text: "Подготовка специалистов смежных профилей." },
      { name: "Карагандинский колледж", text: "Партнёр по подготовке электромонтажников в регионе." },
      {
        name: "ПТК",
        text: "Профессионально-технический колледж акимата г. Астаны — партнёр по подготовке кадров в столичном регионе.",
        logo: ptkAstanaLogo,
        url: "https://ptk-astana.edu.kz",
      },
    ],
  },
  {
    id: "media",
    title: "Медиа-партнёры",
    titleKz: "БАҚ серіктестері",
    description:
      "Профильные издания и медиа, освещающие профессиональные мероприятия сообщества и популяризирующие профессию электромонтажника.",
    descriptionKz:
      "Қауымдастықтың кәсіби іс-шараларын жариялайтын және электрик мамандығын насихаттайтын бейіндік басылымдар.",
    partners: [
      {
        name: "SLET.ASIA",
        text: "Медиа-площадка профессиональных слётов и мероприятий в Центральной Азии.",
        logo: "https://slet.asia/favicon.ico",
        url: "https://slet.asia",
      },
      {
        name: "ADVERSO",
        text: "Медиа-партнёр сообщества по освещению событий.",
        logo: "/logos/adverso.svg",
        logoVariant: "mono-light",
        url: "https://adverso.kz",
      },
      // TODO: добавить логотип журнала «Энергетик» при наличии официального источника.
      { name: "Журнал «Энергетик»", text: "Профильное издание о электроэнергетике Казахстана." },
    ],
  },
];

// Плоский список — для совместимости со старыми экранами (главная и т.п.)
export const partners: Partner[] = partnerCategories.flatMap((c) => c.partners);