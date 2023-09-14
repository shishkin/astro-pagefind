import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";

export default defineConfig({
  base: "/something/",
  output: "static",
  build: {
    format: "file",
  },
  integrations: [pagefind()],
});
