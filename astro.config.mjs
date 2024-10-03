// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://frrst.xyz',
	integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // theme: 'github-light-high-contrast'
      // theme: 'light-plus'
      theme: 'min-dark'
    }
  }
});
