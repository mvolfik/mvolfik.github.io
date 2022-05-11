import { defineConfig } from "astro/config";
import { astroImageTools } from "astro-imagetools";

import solid from "@astrojs/solid-js";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [solid(), sitemap(), astroImageTools],
  site: "https://mvolfik.github.io",
});
