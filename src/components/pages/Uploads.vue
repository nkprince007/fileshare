<template>
  <v-container class="uploads-container" row align-center wrap>
    <v-layout row align-center wrap>
      <v-flex>
        <vue-dropzone
          ref="dropzone"
          id="dropzone"
          :options="dropzoneOptions"
          @vdropzone-complete="this.success"
        ></vue-dropzone>
      </v-flex>
    </v-layout>
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
      dropzoneOptions: {
        url: "/upload",
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        addRemoveLinks: true
      }
    }
  },
  methods: {
    success () {
      this.$store.dispatch('getUserFiles')
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
