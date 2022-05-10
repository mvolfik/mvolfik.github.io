import { defineConfig } from "astro/config";

import solid from "@astrojs/solid-js";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [solid(), sitemap()],
  site: "https://mvolfik.github.io",
});
