<template>
  <div style="height: 100%;">
    <v-container class="pt-0">
      <v-layout column>
        <v-flex v-if="!this.$store.state.email">
          <h3>Please login to continue.</h3>
          <v-btn to="/login">Login</v-btn>
        </v-flex>
        <v-flex v-if="this.$store.state.email" sm2 order-xs1>
          <ul class="messages scrollable" v-chat-scroll ref="scrollable">
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
    </v-container>
    <v-flex v-if="this.$store.state.email" xs10 class="ma-auto">
      <v-text-field
        name="message"
        ref="message"
        v-model="typed"
        label="Enter your message.."
        id="message"
        @keyup.enter="send"
      ></v-text-field>
    </v-flex>
  </div>
</template>

<script>
import Message from './../includes/Message'

export default {
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
          created_at: new Date().toUTCString()
        })
        this.$refs.message.reset()
      }
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
.ma-auto {
  margin: auto;
  background-color: #fafafa;
}
.scrollable {
  overflow-y: scroll;
  height: 70vh;
}
.messages {
  list-style: none;
  padding: 2%;
}
</style>
