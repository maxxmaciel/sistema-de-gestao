import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"

// dev:   npm run dev  -> http://localhost:5173, /api vai para o backend em :8080
// build: npm run build -> gera o front DENTRO do backend (src/main/resources/public),
//        e o "mvn package" empacota tudo num jar só.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8080"
    }
  },
  build: {
    outDir: fileURLToPath(new URL("../backend/src/main/resources/public", import.meta.url)),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500
  }
})
