import Vue from 'vue/dist/vue.esm'
import VueI18n from 'vue-i18n'
import browserLocale from 'browser-locale'

import ja from 'scripts/constants/locales/ja'

Vue.use(VueI18n)

const messages = Object.assign({}, ja)
const locale = browserLocale()
const i18n = new VueI18n({
  locale,
  messages,
})

// usage:
// i18n.t('hello', {name: 'taro'})

export default i18n
