import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { execSync } from "child_process";
import sirv from "sirv";

export default function pagefind(pagefindConfig: { site?: string; outputSubdir?: string } = {}): AstroIntegration {
  const {site, outputSubdir = 'pagefind'} = pagefindConfig

  process.env.PAGEFIND_OUTPUT_SUBDIR = outputSubdir
  process.env.PAGEFIND_SITE = site

  let outDir: string;
  return {
    name: "pagefind",
    hooks: {
      "astro:config:setup": ({ config }) => {
        if (config.output === "server") {
          console.warn(
            "Output type `server` does not produce static *.html pages in its output and thus will not work with astro-pagefind integration.",
          );
          return;
        }

        if (config.adapter?.name.startsWith("@astrojs/vercel")) {
          outDir = fileURLToPath(new URL(".vercel/output/static/", config.root));
        } else if (config.adapter?.name === "@astrojs/cloudflare") {
          outDir = fileURLToPath(new URL(config.base?.replace(/^\//, ""), config.outDir));
        } else if (config.adapter?.name === "@astrojs/node" && config.output === "hybrid") {
          outDir = fileURLToPath(config.build.client!);
        } else {
          outDir = fileURLToPath(config.outDir);
        }
      },
      "astro:server:setup": ({ server }) => {
        if (!outDir) {
          console.warn(
            "astro-pagefind could reliably determine the output directory. Search assets will not be served.",
          );
          return;
        }

        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith(`/${outputSubdir}/`)) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
      "astro:build:done": () => {
        if (!outDir) {
          console.warn(
            "astro-pagefind could reliably determine the output directory. Search index will not be built.",
          );
          return;
        }
        const cmd = `npx pagefind --site "${outDir}" --output-subdir "${outputSubdir}"`;
        execSync(cmd, {
          stdio: [process.stdin, process.stdout, process.stderr],
        });
      },
    },
  };
}
