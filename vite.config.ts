// import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir)
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': pathResolve('src'),
      '@assets': pathResolve('src/assets'),
      '@components': pathResolve('src/components'),
      '@layout': pathResolve('src/components/layout'),
      '@pages': pathResolve('src/pages'),
      '@scss': pathResolve('src/style'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "./src/style/var.scss"`
      }
    },
    devSourcemap: true,
  },
  json: {
    stringify: true,  // 導入的JSON會被轉換為 export default JSON.parse(...)，當JSON文件較大的時候，性能更好
  },
  server: {
    port: 5000,
    // open: '/index.html',  // 服務器啟動時，自動開啟
    proxy: {
      '/api': {
        target: '',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: '/dist',
    rollupOptions: {
      output: {
        // 最小化拆分包
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        // 用於從入口點創建的塊的打包輸出格式[name]表示文件名,[hash]表示該文件內容hash值
        entryFileNames: 'js/[name].[hash].js',
        // 用於命名代碼拆分時創建的共享塊的輸出命名
        chunkFileNames: 'js/[name].[hash].js',
        // 用於輸出靜態資源的命名，[ext]表示文件擴展名
        assetFileNames: '[ext]/[name].[hash].[ext]',
        // 拆分js到模塊文件夾
        // chunkFileNames: (chunkInfo) => {
        //     const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
        //     const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
        //     return `js/${fileName}/[name].[hash].js`;
        // },
      }
    }
  }
});
