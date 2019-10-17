import Vue from 'vue/dist/vue.esm'
import Vuex, { StoreOptions } from 'vuex'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  modules: {},
  state: {},
  getters: {},
  actions: {},
  mutations: {},
}

export default new Vuex.Store<RootState>(store)
