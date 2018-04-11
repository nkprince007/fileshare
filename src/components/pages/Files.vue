<template>
  <v-flex>
    <v-dialog max-width="50%" v-model="shareDialog" class="electation-2">
      <v-card>
        <v-card-title>
          <h2>Share with Others</h2>
          <p>{{shareError}}</p>
        </v-card-title>
        <v-form v-model="valid" ref="shareForm" class="container">
          <v-select
            label="Select file to share"
            name="files"
            :items="allFiles"
            v-model="files"
            item-text="name"
            multiple
            max-height="400"
            autocomplete
            :rules="[() => files.length > 0 || 'You must choose at least one']"
            hint="Pick file to share"
            persistent-hint
          ></v-select>
          <v-select
            label="Select users to share file with"
            name="users"
            :items="otherUsers"
            v-model="users"
            multiple
            max-height="400"
            autocomplete
            :rules="[() => users.length > 0 || 'You must choose at least one']"
            hint="Pick users to share with"
            persistent-hint
          ></v-select>
          <v-btn @click="sendShareRequest" :disabled="!valid">submit</v-btn>
          <v-btn @click="clear">clear</v-btn>
        </v-form>
      </v-card>
    </v-dialog>
    <v-container :v-if="show(key)" style="width: 60%" :key="key" v-for="(items, key) in this.$store.state.files">
      <h2 class="mb-3" style="text-transform: capitalize;">
        {{key}} Files
      </h2>
      <v-data-table
        :key="key"
        :items="items"
        hide-headers
        class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="text-md-left">{{ props.item.name }}</td>
          <td class="text-md-left">{{ props.item.owner }}</td>
          <td class="text-md-right">
            <span class="group">
              <v-icon
                v-if="key === 'owned'"
                class="pa-2 icon"
                v-ripple
                @click="share(props.item)"
              >share</v-icon>
              <a
                v-ripple
                target="_blank"
                :href="'/download?path=' + encodeURI(props.item.path)"
              ><v-icon class="pa-2 icon">file_download</v-icon></a>
            </span>
          </td>
        </template>
      </v-data-table>
    </v-container>
  </v-flex>
</template>

<script>
import axios from 'axios'

export default {
  computed: {
    otherUsers () {
      return this.$store.getters.otherUsers.map(user => user.email)
    },
    allFiles () {
      return this.$store.getters.allFiles
    }
  },
  data () {
    return {
      valid: false,
      users: [],
      files: [],
      shareError: '',
      shareDialog: false
    }
  },
  methods: {
    sendShareRequest() {
      if (this.$refs.shareForm.validate()) {
        const data = {
          files: this.files,
          users: this.users
        }
        console.log(data)
        axios.post('/files', data).then(async (resp) => {
          if (resp.data.error) {
            this.shareError = resp.data.error
          } else {
            this.$store.dispatch('getUserFiles')
            this.shareDialog = false
          }
        })
      }
    },
    show (key) {
      return key !== 'public' ? this.$store.state.email.length > 0 : true
    },
    clear () {
      this.$refs.shareForm.reset()
    },
    share (file) {
      this.shareDialog = true
      this.files = [file]
    },
  }
}
</script>

<style scoped>
.icon {
  border-radius: 50%;
  cursor: pointer;
}
</style>
