import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { pathToFileURL } from "node:url";
import pagefind from "../src/pagefind.ts";

type Middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => void;

const logger = { debug() {}, info() {}, warn() {}, error() {} };

/**
 * Runs the integration's config and dev server hooks against a minimal Astro config and
 * Vite dev server, then requests the Pagefind entry script through the registered middleware.
 */
async function requestPagefindScript(
  root: string,
  astroConfig: { outDir: string; adapter?: object },
): Promise<number> {
  const outDir = path.join(root, astroConfig.outDir);
  const { hooks } = pagefind();
  await hooks["astro:config:setup"]?.({
    config: {
      output: "static",
      adapter: astroConfig.adapter,
      outDir: pathToFileURL(`${outDir}/`),
      build: { client: pathToFileURL(`${path.join(outDir, "client")}/`) },
    },
    logger,
  } as never);

  let middleware: Middleware | undefined;
  await hooks["astro:server:setup"]?.({
    // Vite's own build.outDir stays at its default, independent of Astro's outDir.
    server: {
      config: { root, build: { outDir: "dist" } },
      middlewares: { use: (fn: Middleware) => (middleware = fn) },
    },
    logger,
  } as never);
  assert.ok(middleware, "middleware registered");

  const server = createServer((req, res) =>
    middleware?.(req, res, () => {
      res.statusCode = 404;
      res.end();
    }),
  );
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const { port } = server.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${port}/pagefind/pagefind.js`);
    return response.status;
  } finally {
    server.close();
  }
}

async function writePagefindScript(dir: string) {
  await mkdir(path.join(dir, "pagefind"), { recursive: true });
  await writeFile(path.join(dir, "pagefind", "pagefind.js"), "export {};\n");
}

describe("dev server serves the built Pagefind bundle", () => {
  let root: string;

  before(async () => {
    root = await mkdtemp(path.join(tmpdir(), "astro-pagefind-"));
    await writePagefindScript(path.join(root, "dist"));
    await writePagefindScript(path.join(root, "build"));
    await writePagefindScript(path.join(root, "server-build", "client"));
  });

  after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  test("from the default outDir", async () => {
    assert.equal(await requestPagefindScript(root, { outDir: "dist" }), 200);
  });

  test("from a custom outDir", async () => {
    await rm(path.join(root, "dist"), { recursive: true, force: true });
    assert.equal(await requestPagefindScript(root, { outDir: "build" }), 200);
  });

  test("from build.client when an adapter is configured", async () => {
    assert.equal(await requestPagefindScript(root, { outDir: "server-build", adapter: {} }), 200);
  });
});
