import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/book-tracker/",
  server: {
    port: 5173,
    strictPort: true,
  },
});
