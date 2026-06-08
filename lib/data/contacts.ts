// UPDATED v1.2: Реальные контактные данные команды
export interface ContactPerson {
  id: string;
  name: string;
  nameKz?: string;
  role: string;
  roleKz?: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  whatsappHref: string;
  email: string;
}

export const contacts: ContactPerson[] = [
  {
    id: "mavlid",
    name: "Мавлид Бектимиров",
    role: "Основатель и руководитель сообщества ELEKTROPROFI",
    roleKz: "ELEKTROPROFI қауымдастығының негізін қалаушы және жетекшісі",
    phone: "+7 708 112 69 00",
    phoneHref: "tel:+77081126900",
    whatsapp: "+7 708 112 69 00",
    whatsappHref: "https://wa.me/77081126900",
    email: "mavlid.b@ekt.kz",
  },
  {
    id: "daniil",
    name: "Даниил Асилов",
    role: "Оператор сообщества ELEKTROPROFI",
    roleKz: "ELEKTROPROFI қауымдастығының операторы",
    phone: "+7 778 900 84 61",
    phoneHref: "tel:+77789008461",
    whatsapp: "+7 778 900 84 61",
    whatsappHref: "https://wa.me/77789008461",
    email: "asilov.d@ekt.kz",
  },
];