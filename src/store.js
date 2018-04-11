import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    email: '',
    files: {},
    chat: {
      connected: false,
      onlineUsers: [],
      messages: []
    },
    users: []
  },

  mutations: {
    setUser: function (state, payload) {
      state.email = payload.email || ''
    },
    setFiles: function (state, payload) {
      state.files = payload.files
    },
    setUserList: function (state, payload) {
      state.users = payload.users
    },
    SOCKET_CONNECT: function (state) {
      state.chat.connected = true
    },
    SOCKET_DISCONNECT: function (state) {
      state.chat.connected = false
    },
    SOCKET_MESSAGE: function (state, msg) {
      state.chat.messages.push(msg[0])
    },
    SOCKET_LOGOUT: function (state, payload) {
      state.chat.logout = payload[0]
      console.log(payload)
    },
    SOCKET_ONLINE: function (state, payload) {
      state.chat.messages = payload[0].messages
    },
    SOCKET_OFFLINE: function (state, payload) {
      console.log(payload)
    }
  },

  getters: {
    otherUsers: state => {
      return state.users.filter(user => user.email !== state.email)
    },
    allFiles: state => {
      return state.files.owned || []
    }
  },

  actions: {
    async getUserEmail (context) {
      const resp = await axios.get('/user')
      if (resp.data.email) {
        context.commit('setUser', { email: resp.data.email })
        this._vm.$socket.emit('online')
      }
    },
    async getUserFiles (context) {
      const resp = await axios.get('/files')
      context.commit('setFiles', { files: resp.data })
    },
    async getUserList (context) {
      const resp = await axios.get('/users')
      context.commit('setUserList', { users: resp.data.users })
    }
  }
})
