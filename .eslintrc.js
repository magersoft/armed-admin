module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'vuetify'
  ],
  // add your custom rules here
  rules: {
    "no-console": "off",
    "arrow-parens": "off",
    "vue/no-v-html": "off",
    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error',
  }
}
