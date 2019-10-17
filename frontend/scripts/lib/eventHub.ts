import Vue, { VueConstructor } from 'vue'

const eventHub = {
  install (Vue: VueConstructor, options: object) {
    Vue.prototype.$eventHub = new Vue()
  }
}
Vue.use(eventHub)
