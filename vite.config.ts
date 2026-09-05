import { defineConfig }       from 'vite'
import vue                    from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { loadEnv }            from 'vite'
import path                   from 'node:path'

export default defineConfig(({ mode }) => {
  // 加载当前环境的变量
  const env = loadEnv(mode, path.resolve(process.cwd(), 'envs'))
  console.log('当前环境:', mode)
  console.log('VITE_API_BASE_URL:', env.VITE_API_BASE_URL)
  console.log('VITE_WS_BASE_URL:', env.VITE_WS_BASE_URL)

  const isProduction = mode === 'production'
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api/v1/chat': {
          target: 'http://127.0.0.1:10660',
          changeOrigin: true,
          secure: false
        },
        '/api/v1/files': {
          target: 'http://127.0.0.1:10866',
          changeOrigin: true,
          secure: false
        },
        // 添加 WebSocket 代理
        '/ws': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          ws: true // 启用 WebSocket 代理
        }
      }
    },
    // 生产环境构建优化
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction
        }
      } as any,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    optimizeDeps: {
      exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
    }
  }
})
