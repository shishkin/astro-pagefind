import { defineConfig } from "astro/config";
import pagefind from "./src/pagefind.js";
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
