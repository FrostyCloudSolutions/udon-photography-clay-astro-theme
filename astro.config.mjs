// // @ts-check
// import { defineConfig } from 'astro/config';
// import sitemap from '@astrojs/sitemap';

// // https://astro.build/config
// export default defineConfig({
//     site: 'https://clay-astro-theme.netlify.app',
//     integrations: [sitemap()],
// });


// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://udonphoto.com',
    integrations: [sitemap()],
});