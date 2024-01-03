import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
const { createProxyMiddleware } = require('http-proxy-middleware');

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    proxy: {
      '/server': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        logLevel: 'debug', // 设置日志级别为 debug
        pathRewrite: {
          '^/server': '/server'
        }
    }},
    hmr: true,
    watch: {
        usePolling: true,
    },

  },
  plugins: [react()],
  resolve: {
	  alias: {
		        '@': path.resolve(__dirname, './src'),
            '_c': path.resolve(__dirname, './src/components')
		 }
  }

})
