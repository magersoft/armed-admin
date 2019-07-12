<template>
  <file-pond
    ref="pond"
    name="test"
    label-idle="Drop files here..."
    allow-multiple="true"
    accepted-file-types="image/jpeg, image/png"
    :server="server"
    :files="files"
    @init="handleFilePondInit"/>
</template>

<script>
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'

// plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)

export default {
  components: {
    FilePond
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    server: {},
    files: []
  }),
  methods: {
    async handleFilePondInit() {
      // FilePond instance methods are available on `this.$refs.pond`
      console.log(this.$refs.pond)

      this.server = {
        url: process.env.BASE_URL,
        process: './process',
        revert: './revert',
        restore: './restore/',
        load: './load/',
        fetch: './fetch/'
      }
      // this.$refs.pond.labelIdle = 'Нажмите или перетащите файл сюда...'

      try {
        this.files = await this.$store.dispatch('product/getThumb', this.id)
      } catch (e) {}
    }
  }
}
</script>

<style>
.filepond--wrapper {
  width: 100%;
}
</style>
