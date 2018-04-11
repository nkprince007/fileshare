<template>
  <v-navigation-drawer app permanent>
    <v-list dense class="pt-0">
      <v-list-tile v-for="item in items" :key="item.title" @click="">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {title: 'Home', icon: 'Dashboard'},
        {title: 'Home1', icon: 'Dashboard'},
        {title: 'Home2', icon: 'Dashboard'},
        {title: 'Home3', icon: 'Dashboard'},
        {title: 'Home4', icon: 'Dashboard'},
        {title: 'Home5', icon: 'Dashboard'}
      ]
    }
  }
}
</script>

<style>

</style>
