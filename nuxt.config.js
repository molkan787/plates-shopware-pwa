import { shopwareEndpoint } from './shopware-pwa.config'

export default {
  telemetry: false,
  env: {
    CHOKIDAR_USEPOLLING: process.env.NODE_ENV == 'production' ? 0 : 1,
  },
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'REG 4 PLATES',
    meta: [
      { hid: 'project-type', name: 'project-type', content: 'shopware-pwa' },
      { hid: 'project-type', name: 'project-type', content: 'shopware-pwa' },
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~assets/scss/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vue-fb-customer-chat.client.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@shopware-pwa/nuxt-module',
    '@nuxtjs/device'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/proxy'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
    workbox: {
      offlineStrategy: 'StaleWhileRevalidate',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  proxy: [
    `${shopwareEndpoint}/store-api/v3/shopware-pwa/payment-method-settings`,
    `${shopwareEndpoint}/sales-channel-api/v3/checkout/order/*/pay`,
    `${shopwareEndpoint}/store-api/v3/handle-payment`
  ]
}
