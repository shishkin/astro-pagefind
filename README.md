# Astro-Pagefind

[![CI](https://github.com/shishkin/astro-pagefind/actions/workflows/ci.yaml/badge.svg)](https://github.com/shishkin/astro-pagefind/actions/workflows/ci.yaml)
[![npm](https://img.shields.io/npm/v/astro-pagefind)](https://www.npmjs.com/package/astro-pagefind)

[Astro](https://astro.build) integration for [Pagefind](https://pagefind.app/) static site search.

## Features

- Build pagefind index upon static build
- Serve previously prebuilt search index in `astro dev` mode
- Simple Search Astro component based on Pagefind Searchbox
- Supports customized base URL path
- Supports multiple instances of the component on a page
- Supports [Astro view transitions](https://docs.astro.build/en/guides/view-transitions)
- Allows [passing index config](packages/example/astro.config.ts) to pagefind

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
  integrations: [pagefind()],
});
```

Add search component on a page:

```astro
---
import Search from "astro-pagefind/components/Search";
---

<Search instance="search" className="pagefind-ui" searchboxOptions={{ placeholder: "search" }} />
```

See [Main.layout](packages/example/src/layouts/Main.astro) for a usage example.

### Pagefind 1.5.0

Pagefind has introduced [component-based UI](https://pagefind.app/docs/components/) in version 1.5.0.
It is now much easier to integrate Pagefind UI into Astro projects.
New users are encouraged to integrate Pagefind UI component directly instead of using the `astro-pagefind/components/Search` component.
This component is now in maintenance mode and will not receive any new UI-related features anymore.

Here is how to get the searchbox UI on a page:

```astro
---
import "@pagefind/component-ui/css/pagefind-component-ui.css";
---

<pagefind-searchbox></pagefind-searchbox>
<script>
  import "@pagefind/component-ui";
</script>
```

For more details and information on Pagefind UI please consult [Pagefind docs](https://pagefind.app/docs/components/searchbox/) directly.
