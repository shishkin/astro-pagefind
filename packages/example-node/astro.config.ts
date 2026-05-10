import node from "@astrojs/node";
import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [pagefind()],
});
