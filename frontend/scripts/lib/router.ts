import Vue from 'vue/dist/vue.esm'
import VueRouter from 'vue-router'
import { routes } from 'scripts/config/routes'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes,
})
