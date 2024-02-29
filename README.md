# Astro-Pagefind

[![CI](https://github.com/shishkin/astro-pagefind/actions/workflows/ci.yaml/badge.svg)](https://github.com/shishkin/astro-pagefind/actions/workflows/ci.yaml)
[![npm](https://img.shields.io/npm/v/astro-pagefind)](https://www.npmjs.com/package/astro-pagefind)

[Astro](https://astro.build) integration for [Pagefind](https://pagefind.app/) static site search.

## Features

- Build pagefind index upon static build
- Serve previously prebuilt search index in `astro dev` mode
- Search Astro component
- Supports customized base URL path
- Supports multiple instances of the component on a page
- Supports pre-filled search query
- Supports [Astro view transitions](https://docs.astro.build/en/guides/view-transitions)

## Usage

Install:

```bash
npm i astro-pagefind
```

Add integration to the Astro config:

```typescript
//astro.config.ts

import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";

export default defineConfig({
  build: {
    format: "file",
  },
  integrations: [pagefind()],
});
```

Add search component on a page:

```astro
---
import Search from "astro-pagefind/components/Search";
---

<Search id="search" className="pagefind-ui" uiOptions={{ showImages: false }} />
```

See [Main.layout](packages/example/src/layouts/Main.astro) for a usage example.

### Pre-filled Search Query

In SSR mode Astro provides access to URL query parameters which can be used to pre-fill search query via a prop:

```astro
---
import Search from "astro-pagefind/components/Search";

export const prerender = false;

const q = Astro.url.searchParams.get("q") ?? undefined;
---

<Search query={q} />
```

See [prefilled.astro](packages/example/src/pages/prefilled.astro) for a full example.
