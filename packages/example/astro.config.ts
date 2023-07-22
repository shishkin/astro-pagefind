import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";
import node from "@astrojs/node";

export default defineConfig({
  base: "/something/",
  output: "hybrid",
  build: {
    format: "file",
  },
  integrations: [pagefind()],
  adapter: node({
    mode: "standalone",
  }),
});
