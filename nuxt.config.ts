import { createResolver } from '@nuxt/kit'
import vuetify from 'vite-plugin-vuetify'

const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  typescript: {
    shim: false
  },
  build: {
    //   extractCSS: false,
    transpile: ['vuetify']
  },
  modules: ['@pinia/nuxt'],
  app: {
    head: {
      title:
      'PUPR - Smart Campuss'
    }
  },
  nitro: {
    serveStatic: true
  },
  devServerHandlers: [],
  experimental: {
    payloadExtraction: true
  },
  hooks: {
    'vite:extendConfig': (config: any) => {
      config.plugins.push(
        vuetify({
          styles: { configFile: resolve('/assets/scss/variables.scss') }
        })
      )
    }
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'https://api.eakademik.livinglab.id'
      // baseUrl: process.env.BASE_URL || 'https://eakademik-be.politeknikpu.ac.id'
    }
  },
  plugins: [
    // { src: '~/plugins/base64.ts' },
  ]
})
