import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import sirv from "sirv";
import * as pf from "pagefind";

type PagefindConfig = pf.PagefindServiceConfig;

export default function pagefind(config: PagefindConfig = {}): AstroIntegration {
  let outDir: string;
  return {
    name: "pagefind",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        if (config.output === "server") {
          logger.warn(
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
      "astro:server:setup": ({ server, logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search assets will not be served.",
          );
          return;
        }

        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/pagefind/")) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
      "astro:build:done": async ({ logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search index will not be built.",
          );
          return;
        }

        const { index, errors: createIndexErrors } = await pf.createIndex(config);
        if (createIndexErrors.length) {
          logger.warn(
            `astro-pagefind errored when creating index. Search index will not be built.\n\n${createIndexErrors.join("\n")}`,
          );
          await pf.close();
          return;
        }
        const { page_count, errors: addDirectoryErrors } = await index!.addDirectory({ path: outDir });
        if (addDirectoryErrors.length) {
          logger.warn(
            `astro-pagefind errored when adding the output directory. Search index will not be built.\n\n${addDirectoryErrors.join("\n")}`,
          );
          await pf.close();
          return;
        }
        logger.info(`astro-pagefind has indexed ${page_count} page(s).`);
        const { errors: writeFilesErrors } = await index!.writeFiles({
          outputPath: join(outDir, "pagefind"),
        });
        if (writeFilesErrors.length) {
          logger.warn(
            `astro-pagefind errored when writing files. Search index will not be built.\n\n${writeFilesErrors.join("\n")}`,
          );
          await pf.close();
          return;
        }
      },
    },
  };
}
