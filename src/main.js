import Vue from 'vue'
import VueRouter from 'vue-router'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'
import Vuetify from 'vuetify'
import App from './components/App.vue'
import routes from './routes'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import './assets/iconfont/material-icons.css'

const SocketInstance = socketio('http://localhost:8000')
Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.use(VueSocketio, SocketInstance, store)
const router = new VueRouter({ routes })

const vue = new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})

export default vue
