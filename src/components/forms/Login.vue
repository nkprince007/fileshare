<template>
  <v-layout row>
    <v-card width="45%" class="mx-auto">
      <v-card-title>
        <h2>Login to your account</h2>
      </v-card-title>
      <b class="red--text">{{error}}</b>
      <v-form @submit="submit" v-model="valid" class="container" ref="loginForm">
        <v-text-field
          label="Email Address"
          v-model="email"
          :rules="emailRules"
          name="email"
          required
        ></v-text-field>
        <v-text-field
          name="password"
          label="Enter your password"
          v-model="password"
          :append-icon="showPass ? 'visibility' : 'visibility_off'"
          :append-icon-cb="() => (showPass = !showPass)"
          :type="showPass ? 'text' : 'password'"
          required
        ></v-text-field>
        <p>
          Don't have an account?
          <router-link to="/signup">Register here</router-link>
        </p>
        <v-btn type="submit" :disabled="!valid">submit</v-btn>
        <v-btn @click="clear">clear</v-btn>
      </v-form>
    </v-card>
  </v-layout>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      valid: true,
      error: '',
      email: '',
      password: '',
      showPass: false,
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
          email: this.email,
          password: this.password
        }
        axios.post('/login', data).then(async (resp) => {
          if (resp.data.error) {
            this.error = resp.data.error
          } else {
            this.$store.dispatch('getUserEmail')
            this.$store.dispatch('getUserFiles')
            window.location = '/'
          }
        })
      }
    },
    clear() {
      this.$refs.loginForm.reset()
    }
  }
}
</script>

<style>
</style>
