import { defineConfig } from "astro/config";
import pagefind from "./src/pagefind.js";

export default defineConfig({
  base: "/something/",
  build: {
    format: "file",
  },
  integrations: [pagefind()],
});
