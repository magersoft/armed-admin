<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout pa-3 column>
    <v-flex v-if="loadFiles && !!loadFiles.length" xs12 style="position: relative">
      <div v-if="loading" class="text-xs-center sortable-loading">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <draggable
        v-model="loadFiles"
        :class="{ 'sortable': loadFiles.length > 1 }"
        class="layout row wrap"
        @start="dragging = true"
        @end="draggingEnd"
        >
          <v-flex
            v-for="(file) in loadFiles"
            :key="file.id"
            :class="flexGrid"
            xs12
          >
            <v-img
              :src="url + file.src"
              :lazy-src="url + file.src"
              aspect-ratio="1"
              contain
              class="elevation-1 ma-2"
            >
              <v-layout
                column
                fill-height
              >
                <v-card-title>
                  <v-spacer />

                  <v-btn icon :class="{ 'white v-btn--small': loadFiles.length > 2 }" class="mr-1">
                    <v-icon>edit</v-icon>
                  </v-btn>

                  <v-btn icon :class="{ 'white v-btn--small': loadFiles.length > 2 }" @click="deleteFile(file.src)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-card-title>
              </v-layout>
              <template v-slot:placeholder>
                <v-layout
                  fill-height
                  align-center
                  justify-center
                  ma-0
                >
                  <v-progress-circular indeterminate color="primary" />
                </v-layout>
              </template>
            </v-img>
          </v-flex>
        </draggable>
    </v-flex>
    <v-flex xs12>
      <file-pond
        ref="pond"
        name="file"
        label-idle="Нажмите или перетащите файл сюда..."
        :allow-multiple="multiple"
        accepted-file-types="image/jpeg, image/png"
        :server="server"
        :files="myFiles"
        @init="handleFilePondInit"
      />
    </v-flex>
    <v-dialog v-model="dialog" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">
          Подтвердите действие
        </v-card-title>
        <v-card-text>Вы хотите удалить это изображение.<br> Вы уверены?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" flat :disabled="loading" @click="dialog = false">
            Отмена
          </v-btn>
          <v-btn color="green darken-1" flat :loading="loading" :disabled="loading" @click="deleteFile(deleted)">
            Принять
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import vueFilePond from 'vue-filepond'
import draggable from 'vuedraggable'
import 'filepond/dist/filepond.min.css'

// plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

const FilePond = vueFilePond(FilePondPluginFileValidateType)

export default {
  components: {
    FilePond, draggable
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    files: {
      type: Array,
      required: false,
      default: () => ([])
    },
    folder: {
      type: String,
      required: false,
      default: '/'
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    url: '',
    loadFiles: [],
    dialog: false,
    loading: false,
    server: {},
    myFiles: [],
    deleted: null,
    dragging: false
  }),
  computed: {
    flexGrid() {
      if (this.files.length === 1) {
        return 'md12'
      } else if (this.files.length === 2) {
        return 'md6'
      } else if (this.files.length === 3) {
        return 'md4'
      } else if (this.files.length > 3) {
        return 'md2'
      } else {
        return 'md12'
      }
    }
  },
  created() {
    this.url = process.env.fileURL
    this.loadFiles = this.files.map(file => {
      return {
        id: file.id,
        src: file.src
      }
    })
  },
  methods: {
    handleFilePondInit() {
      // FilePond instance methods are available on `this.$refs.pond`
      this.server = {
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          const formData = new FormData()
          formData.append(fieldName, file, file.name)
          formData.append('folder', this.folder)

          const request = new XMLHttpRequest()
          request.withCredentials = true
          request.open('POST', 'http://dobrota.yii/api/file/upload/')

          request.upload.onprogress = e => {
            progress(e.lengthComputable, e.loaded, e.total)
          }

          request.onload = () => {
            if (request.status >= 200 && request.status < 300) {
              load(request.responseText)
              try {
                const loadFile = JSON.parse(request.responseText)
                if (this.multiple) {
                  this.loadFiles.push(loadFile)
                } else {
                  this.loadFiles = [loadFile]
                }
                this.$emit('fileUpload', loadFile)
              } catch (e) {
                alert('Validate error')
              }
            } else {
              error('error')
              alert('status error')
            }
          }

          request.send(formData)

          return {
            abort: () => {
              request.abort()
              abort()
            }
          }
        },
        load: (source, load, error, progress, abort, headers) => {
          const myRequest = new Request(source)
          fetch(myRequest).then(function (response) {
            response.blob().then(function (myBlob) {
              load(myBlob)
            })
          })
        },
        revert: async (uniqueFileId, load, error) => {
          try {
            const file = JSON.parse(uniqueFileId).src
            await this.deleteFile(file)
          } catch (e) {
            error(e)
          }
        },
        remove: async (source, load, error) => {
          try {
            await this.$store.dispatch('file/delete', source)
            this.loadFiles = this.loadFiles.filter(e => e.src !== source)
            this.$emit('fileRemove', source)
            load()
          } catch (e) {
            error(e)
          }
        }
      }
    },
    async deleteFile(src) {
      this.loading = true
      try {
        await this.$store.dispatch('file/delete', src)
        this.loadFiles = this.loadFiles.filter(e => e.src !== src)
        this.$emit('fileRemove', src)
      } catch (e) {}
      this.loading = false
      this.dialog = false
    },
    async draggingEnd() {
      this.loading = true
      this.$store.dispatch('clearMessage')
      try {
        await this.$store.dispatch('product/updateImagesSort', this.loadFiles)
        this.$store.dispatch('getMessage', { text: 'Сортировка обновлена', color: 'green', timeout: 2000 })
      } catch (e) {}
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.filepond--wrapper {
  width: 100%;
}
.sortable {
  .flex {
    cursor: move;
  }
  &-loading {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    background-color: rgba(255,255,255,.1);
  }
}
</style>
