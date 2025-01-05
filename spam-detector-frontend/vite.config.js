import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:4000', // URL de `auth-service`
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, '/auth'), // Vérifie que les chemins correspondent
      },
      '/analyze': {
        target: 'http://localhost:5001', // URL du backend d'analyse
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/analyze/, '/analyze'),
      },
      '/file': {
        target: 'http://localhost:5002', // Nouveau serveur dédié
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/file/, '/file'),
      },      
    },
  },
});
