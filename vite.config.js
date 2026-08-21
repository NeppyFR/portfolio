import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: '/' because the site is served from a custom apex domain
// (singh-angad.ch), not a github.io project subpath.
export default defineConfig({
  plugins: [react()],
  base: "/",
});
