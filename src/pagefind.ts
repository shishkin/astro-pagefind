import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { execSync } from "child_process";
import sirv from "sirv";

export default function pagefind(): AstroIntegration {
  let outDir = "./public";
  return {
    name: "pagefind",
    hooks: {
      "astro:config:done": ({ config }) => {
        outDir = fileURLToPath(config.outDir);
      },
      "astro:server:setup": ({ server }) => {
        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/_pagefind/")) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
      "astro:build:done": ({ dir }) => {
        const path = fileURLToPath(dir);
        const cmd = `npx pagefind --source "${path}"`;
        execSync(cmd, {
          stdio: [process.stdin, process.stdout, process.stderr],
        });
      },
    },
  };
}
