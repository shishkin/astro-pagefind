import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";
import node from "@astrojs/node";

export default defineConfig({
  output: "hybrid",
  integrations: [pagefind()],
  adapter: node({
    mode: "standalone",
  }),
});
