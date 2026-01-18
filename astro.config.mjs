import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://shivekkhurana.com',
  integrations: [react(), tailwind()],
  devToolbar: {
    enabled: false,
  },
  build: {
    // Inline all CSS to avoid render-blocking stylesheet requests
    inlineStylesheets: 'always',
  },
});
