import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import pagefind from "astro-pagefind";

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [pagefind()],
});
