// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://frrst.xyz',
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      wrap: true,
      theme: {
        name: 'my-theme',
        settings: [
          {
            scope: ['comment'],
            settings: {
              fontStyle: 'italic',
              foreground: 'rgba(255,255,255, 0.3)'
            }
          },
          {
            scope: ['keyword', 'constant'],
            settings: {
              foreground: 'var(--primary)'
            }
          },
          {
            scope: ['string'],
            settings: {
              foreground: 'var(--white)'
            }
          },
          {
            scope: ['meta.brace'],
            settings: {
              foreground: 'var(--white)'
            }
          },
          {
            scope: ['entity'],
            settings: {
              foreground: 'var(--secondary)'
            }
          },
          {
            scope: ['storage'],
            settings: {
              foreground: 'var(--secondary-dark)'
            }
          },
        ],
        bg: 'var(--black)',
        fg: 'var(--gray)',
      },
    },
  }
});
