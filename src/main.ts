import Vue from 'vue'
import { fn_a } from './test'
import App from './app.vue'
import router from './router'
import vwAdjust from './libs/vw_adjust'
vwAdjust()

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App),
  router
})

fn_a()

window.document.addEventListener('click', () => {
  import(/* webpackPrefetch: true */ './utils')
    .then(({ default: func }) => console.log('test', func(1, 2)))
})