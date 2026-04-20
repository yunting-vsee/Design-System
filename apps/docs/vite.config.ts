import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Resolve the library source (../../src) so the docs site sees the package
// the same way a downstream consumer would once installed from the registry.
const libRoot = fileURLToPath(new URL('../../src', import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.BASE_URL || '/',
  resolve: {
    alias: {
      '@vsee/ui': libRoot,
    },
  },
})
