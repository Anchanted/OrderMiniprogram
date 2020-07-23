import Vue from 'vue'
import App from './App'
import store from '@/store'
import mixin from '@/static/js/mixin.js'

Vue.config.productionTip = false
Vue.mixin(mixin)

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
