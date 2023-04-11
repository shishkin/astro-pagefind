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

<Search />
```

See [Main.layout](./src/layouts/Main.astro) for a usage example.
