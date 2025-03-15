import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import pagefind from "astro-pagefind";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  build: {
    format: "file",
  },
  integrations: [pagefind()],
});
