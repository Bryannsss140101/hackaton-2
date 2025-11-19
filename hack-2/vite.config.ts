import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


const tailwindPlugin = tailwindcss() as unknown as PluginOption

export default defineConfig({
  plugins: [
    react(),
    tailwindPlugin, 
  ],
})
