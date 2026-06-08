import ru from "./ru.json";
import kz from "./kz.json";

export type Lang = "ru" | "kz";

export const LANGS: Lang[] = ["ru", "kz"];

export const dict: Record<Lang, Record<string, string>> = {
  ru: ru as Record<string, string>,
  kz: kz as Record<string, string>,
};

// Permissive type: any string is accepted; missing keys fall back to the key itself.
export type DictKey = string;
