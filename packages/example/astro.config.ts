import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";

export default defineConfig({
  output: "static",
  build: {
    format: "file",
  },
  integrations: [
    pagefind({
      // Example of specifying Pagefind config:
      indexConfig: {
        keepIndexUrl: true,
      },
    }),
  ],
});
