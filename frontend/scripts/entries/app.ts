import Vue from 'vue/dist/vue.esm'

import i18n from 'scripts/lib/i18n'
import router from 'scripts/lib/router'
import store from 'scripts/stores'
import 'scripts/config/icons'
import 'scripts/lib/eventHub'

import 'styles/main/application'

document.addEventListener('DOMContentLoaded', () => {
  const app = document.createElement('div')
  app.id = '__app'
  document.body.appendChild(app)

  new Vue({
    el: '#__app',
    template: `
      <div>
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </div>
    `,
    i18n,
    router,
    store,
  })
})
