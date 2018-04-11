<template>
  <v-jumbotron>
    <v-container fill-height>
      <v-layout align-center>
        <v-flex>
          <h3 class="display-3">
            Welcome to FileShare{{loggedIn ? `, ${loggedIn}`: ''}}!
          </h3>
          <span class="subheading">
            A filesharing platform for the intranet.
          </span>
          <v-divider class="my-3"></v-divider>
          <div class="title mb-3">Dive right in to learn more!</div>
          <div v-if="!loggedIn">
            <v-btn large color="primary" to="/login">
              Login
            </v-btn>
            <v-btn large color="success" to="/signup">
              Sign Up
            </v-btn>
          </div>
          <div v-if="loggedIn">
            <v-btn large color="primary" to="/chat">
              <v-icon>chat</v-icon>&nbsp;Chat
            </v-btn>
            <v-btn large color="success" to="/upload">
              <v-icon>file_upload</v-icon>&nbsp;Upload
            </v-btn>
            <v-btn large color="secondary" to="/files">
              <v-icon>folder</v-icon>&nbsp;Files
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron>
</template>

<script>
import axios from 'axios'

export default {
  computed: {
    loggedIn () {
      return this.$store.state.email;
    }
  },
  data () {
    return {
      loginForm: {
        enabled: false,
        valid: true,
        show: false,
        email: '',
        error: '',
        password: '',
      },
      signupForm: {
        enabled: false,
        valid: true,
        show: false,
        email: '',
        error: '',
        password: '',
        cpassword: ''
      },
      emailRules: [
        v => !!v || 'Email is required!',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
    }
  },
  methods: {
    submit(event) {
      event.preventDefault()
      if (this.$refs.loginForm.validate()) {
        const data = {
          email: this.loginForm.email,
          password: this.loginForm.password
        }
        axios.post('/login', data).then(async (resp) => {
          if (resp.data.error) {
            this.loginForm.error = data.error
          } else {
            this.$store.dispatch('getUserEmail')
            this.loginForm.enabled = false
          }
        })
      }
    },
    signupSubmit(event) {
      event.preventDefault()
      if (this.$refs.signupForm.validate()) {
        const data = {
          email: this.signupForm.email,
          password: this.signupForm.password,
          cpassword: this.signupForm.cpassword
        }
        axios.post('/signup', data).then(async (resp) => {
          if (resp.data.error) {
            this.signupForm.error = data.error
          }
        })
      }
    },
    clear() {
      this.$refs.loginForm.reset()
    },
    signupClear() {
      this.$refs.signupForm.reset()
    }
  }
}
</script>

<style scoped>
</style>
