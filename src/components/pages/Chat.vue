<template>
  <v-container class="pt-0">
    <v-layout column>
      <v-flex v-if="!this.$store.state.email">
        <h3>Please login to continue.</h3>
        <v-btn to="/login">Login</v-btn>
      </v-flex>
      <v-flex v-if="this.$store.state.email" xs12 sm10 order-xs2>
        <v-text-field
          name="message"
          ref="message"
          v-model="typed"
          label="Enter your message.."
          id="message"
          @keyup.enter="send"
        ></v-text-field>
      </v-flex>
      <v-flex v-if="this.$store.state.email" sm2 order-xs1 class="scrollable"  ref="scrollable">
        <ul class="messages">
          <li
            :class="getClassNames(message)"
            :key="index"
            v-for="(message, index) in this.$store.state.chat.messages"
          >
            <message
              :timestamp="message.created_at"
              :sameUser="isSameUser(message)"
              :username="message.sent_by"
              :content="message.content"></message>
          </li>
        </ul>
      </v-flex>
    </v-layout>
    <v-snackbar
      :timeout="timeout"
      bottom
      v-model="snackbar"
    >
      {{ toast }}
      <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import Message from './../includes/Message'

export default {
  computed: {
    toast () {
      return `${this.loggedOut} disconnected.`
    },
    loggedOut () {
      return this.$store.state.logout
    },
    snackbar () {
      console.log(this.loggedOut)
      return this.loggedOut ? true : false
    }
  },
  components: {
    message: Message
  },
  data () {
    return {
      typed: '',
      timeout: 6000
    }
  },
  methods: {
    send () {
      if (this.typed) {
        this.$socket.emit('message', {
          content: this.typed,
          sent_by: this.$store.state.email,
          created_at: new Date().toString()
        })
        this.$refs.message.reset()
      }
    },
    scrollToBottom () {
      const {scrollable} = this.$refs
      scrollable.scrollTop = scrollable.scrollHeight
    },
    isSameUser(message) {
      return this.$store.state.email === message.sent_by
    },
    getClassNames (message) {
      return `message
      text-sm-${this.isSameUser(message) ? 'right': 'left'}`
    }
  }
};
</script>

<style>
.scrollable {
  overflow-y: scroll;
  height: 70vh;
}

.messages {
  list-style: none;
}
</style>
