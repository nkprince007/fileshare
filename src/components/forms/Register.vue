<template>
  <v-layout row>
    <v-card width="45%" class="mx-auto">
      <v-card-title>
        <h2>Create your account</h2>
      </v-card-title>
      <b class="red--text">{{error}}</b>
      <v-form v-model="valid" @submit="submit" class="container" ref="signupForm">
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
        <v-text-field
          name="cpassword"
          label="Enter your password again"
          v-model="confirmPassword"
          type="text"
          required
        ></v-text-field>
        <p>
          Already have an account?
          <router-link to="/login">Login here</router-link>
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
      confirmPassword: '',
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
      if (this.$refs.signupForm.validate()) {
        const data = {
          email: this.email,
          password: this.password,
          cpassword: this.confirmPassword
        }
        axios.post('/signup', data).then(async (resp) => {
          if (resp.data.error) {
            this.error = resp.data.error
          }
        })
      }
    },
    clear() {
      this.$refs.signupForm.reset()
    }
  }
}
</script>

<style>
</style>

</style>
