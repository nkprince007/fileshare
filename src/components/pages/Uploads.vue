<template>
  <v-container class="uploads-container" row align-center wrap>
    <v-layout row align-center wrap>
      <v-flex>
        <vue-dropzone
          ref="dropzone"
          id="dropzone"
          :options="dropzoneOptions"
          @vdropzone-success="this.success"
        ></vue-dropzone>
      </v-flex>
    </v-layout>
    <v-snackbar
      :timeout="timeout"
      top
      v-model="snackbar"
    >{{notification}}
    <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.css";

export default {
  components: {
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
      notification: '',
      snackbar: false,
      timeout: 6000,
      dropzoneOptions: {
        url: "/upload",
        thumbnailWidth: 150,
        maxFilesize: 500,
        addRemoveLinks: true
      }
    }
  },
  methods: {
    success (file) {
      this.$store.dispatch('getUserFiles')
      this.notification = `${file.name} uploaded successfully`
      this.snackbar = true
    }
  }
};
</script>

<style>
.uploads-container {
  margin-top: auto !important;
}

#dropzone {
  width: 100%;
}

#dropzone .dz-message {
  align-self: center;
  font-size: 3rem;
}
</style>
