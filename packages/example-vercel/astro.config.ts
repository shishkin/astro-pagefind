import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [pagefind()],
});
