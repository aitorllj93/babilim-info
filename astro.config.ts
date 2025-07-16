import icon from "astro-icon";
import pagefind from "astro-pagefind";
import { defineConfig } from 'astro/config';


import tailwindcss from '@tailwindcss/vite';
import markdown from "./astro/markdown/config";

import websiteConfig from './website.config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: websiteConfig.site,
  base: websiteConfig.base,
  devToolbar: {
    enabled: false
  },
  build: {
    format: 'file',
  },
  i18n: {
    defaultLocale: websiteConfig.defaultLanguage,
    locales: [websiteConfig.defaultLanguage],
  },
  markdown,
  integrations: [icon(), pagefind(), sitemap()],
  vite: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    plugins: [(tailwindcss as any)()],
  },
});