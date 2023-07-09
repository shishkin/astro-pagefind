import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "child_process";
import sirv from "sirv";

function isPageFindConfigExist() {
    const rootDir = process.cwd(); 

    const fileNames = ['pagefind.toml', 'pagefind.yml', 'pagefind.yaml', 'pagefind.json'];
  
    for (const fileName of fileNames) {
      const filePath = join(rootDir, fileName);
      if (existsSync(filePath)) {
        return true; 
      }
    }
  
    return false; 
}

export default function pagefind(): AstroIntegration {
  let outDir = "./public";
  return {
    name: "pagefind",
    hooks: {
      "astro:config:setup": ({ config }) => {
        const c = config as unknown as { build: { client: URL } };
        outDir = fileURLToPath(c.build.client);
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
        let cmd = "";
        if (isPageFindConfigExist()) {
            cmd = `npx pagefind`;
        }else{
            cmd = `npx pagefind --source "${path}"`;
        }
        
        execSync(cmd, {
          stdio: [process.stdin, process.stdout, process.stderr],
        });
      },
    },
  };
}

