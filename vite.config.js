import { defineConfig } from 'vite'

export default defineConfig({
    /** 用相对路径，打包后可直接放到任意子目录 */
    base: './',
    server: {
        port: 8080,
        open: true,
    },
    build: {
        outDir: 'dist',
        /** 打包产物放 static/，避免和 public/assets 里的贴图混在一起 */
        assetsDir: 'static',
        chunkSizeWarningLimit: 4000,
    },
})
