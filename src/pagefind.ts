import type { AstroIntegration, AstroUserConfig } from "astro";
import { fileURLToPath } from "node:url";
import { execSync } from "child_process";
import sirv from "sirv";

type Config = Required<AstroUserConfig>;

export default function pagefind(): AstroIntegration {
  let outDir: string;
  return {
    name: "pagefind",
    hooks: {
      "astro:config:setup": ({ config }) => {
        const c = config as Config;
        if (c.output === "server") {
          console.warn("Output type `server` does not produce static *.html pages in its output and thus will not work with astro-pagefind integration.");
          return;
        }

        if (c.adapter?.name.startsWith("@astrojs/vercel")) {
          outDir = fileURLToPath(new URL(".vercel/output/static/", c.root))
        } else if (c.adapter?.name === "@astrojs/cloudflare") {
          outDir = fileURLToPath(new URL(c.base?.replace(/^\//, ""), c.outDir));
        } else if (c.adapter?.name === "@astrojs/node" && c.output === "hybrid") {
          outDir = fileURLToPath(c.build.client!);
        } else {
          outDir = fileURLToPath(c.outDir);
        }
      },
      "astro:server:setup": ({ server }) => {
        if (!outDir) {
          console.warn("astro-pagefind could reliably determine the output directory. Search assets will not be served.")
          return;
        };

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
      "astro:build:done": () => {
        if (!outDir) {
          console.warn("astro-pagefind could reliably determine the output directory. Search index will not be built.")
          return;
        };
        const cmd = `npx pagefind --source "${outDir}"`;
        execSync(cmd, {
          stdio: [process.stdin, process.stdout, process.stderr],
        });
      },
    },
  };
}
