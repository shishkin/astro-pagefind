import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";

export default defineConfig({
  integrations: [
    pagefind({
      // Example of specifying Pagefind config:
      indexConfig: {
        keepIndexUrl: true,
      },
    }),
  ],
});
