import type { AstroGlobal } from 'astro';
import { defaultLang, ui } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[keyof typeof ui], variables?: Record<string, string>): string {
    let text = (ui[lang] as any)[key] || ui[defaultLang as keyof typeof ui][key];

    if (!text) {
      console.warn(`Missing translation for key: ${key} in language: ${lang}`);
      return '';
    }

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        text = text?.replaceAll(`{${key}}`, value)
      })
    }

    return text;
  }
}

export function useI18n(astro: AstroGlobal) {
  return {
    t: useTranslations(astro.currentLocale as keyof typeof ui ?? defaultLang),
  }
}