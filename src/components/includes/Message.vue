<template>
  <div>
    <div v-if="sameUser" style="display: inline-block">{{username}}</div>
    <v-card
      :class="classnames"
      style="display: inline-block"
      >
      <b>{{content}}</b><br/>
      {{moment(timestamp)}}
    </v-card>
    <div v-if="!sameUser" style="display: inline-block">{{username}}</div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: ['content', 'username', 'sameUser', 'timestamp'],
  computed: {
    classnames () {
      return `ma-1 pa-2 ${this.sameUser ? 'lime lighten-4' : 'light-green lighten-3'}`
    }
  },
  methods: {
    moment (time) {
      return moment(time).calendar()
    }
  }
}
</script>

<style>
</style>
