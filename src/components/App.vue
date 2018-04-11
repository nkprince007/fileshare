<template>
  <v-app id="app">
    <!-- <sidebar v-if="isChat && this.$store.state.email"></sidebar> -->
    <v-toolbar app class="toolbar">
      <v-toolbar-title class="title">
        <v-icon class="pa-1">share</v-icon>
        <router-link to="/">FileShare</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn to="/" flat>Home</v-btn>
        <v-btn to="/files" flat>Files</v-btn>
        <v-btn to="/uploads" flat>Upload</v-btn>
        <v-btn to="/chat" flat>Chat</v-btn>
        <v-btn to="/login" v-if="!this.$store.state.email" flat>Login</v-btn>
        <v-btn
          v-if="this.$store.state.email"
          @click="logout"
          flat
        >Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content id="content">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';
import Sidebar from './includes/Sidebar';

export default {
  name: 'app',
  components: {
    sidebar: Sidebar
  },
  computed: {
    isChat () {
      return this.$route.path === '/chat'
    }
  },
  mounted () {
    this.$store.dispatch('getUserEmail')
    this.$store.dispatch('getUserFiles')
    this.$store.dispatch('getUserList')
  },
  data: function() {
    return {}
  },
  methods: {
    logout () {
      const email = this.$store.state.email
      axios.post('/logout').then(() => {
        this.$socket.disconnect()
        window.location = '/'
      })
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  display: flex;
}

#content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.toolbar .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
