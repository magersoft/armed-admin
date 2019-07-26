<template>
  <draggable
    :list="data"
    class="layout row wrap"
    @start="dragging = true"
    @end="draggindEnd">
    <v-flex
      v-for="item in data"
      :key="item.id"
      xs3
    >
      <v-card
        class="ma-1 mt-2"
        flat
        height="100%">
        <div style="cursor: move; z-index: 1">
          <file-upload
            :files="[item]"
            :multiple="false"
            :removed="false"
            folder="/products/"/>
        </div>
        <h3 class="title">
          <inline-editor :id="item.id" :text="item.title" action="updateAdvantagesTitle" />
        </h3>
        <div class="description mt1">
          <inline-editor :id="item.id" :text="item.description" action="updateAdvantagesDescription" textarea />
        </div>
      </v-card>
    </v-flex>
    <v-flex xs3>
      <v-card
        class="mx-auto pa-2 mt-2 new-block"
        flat
        height="100%"
      >
        <div class="added-header" v-if="!addedImage">
          <h2>Добавить новое преимущество</h2>
          <v-btn
            fab
            dark
            color="accent"
            :disabled="form"
            @click.prevent="form = !form">
            <v-icon>add</v-icon>
          </v-btn>
        </div>
        <v-card-text v-if="form">
          <file-upload
            :file="addedImage"
            :multiple="false"
            folder="/products/"
            @fileUpload="newImageUpload"
            ref="newUpload"
          ></file-upload>
          <v-text-field
            v-model="title"
            v-validate="'required'"
            :error-messages="errors.collect('title')"
            label="Заголовок преимущества"
            data-vv-name="title"
          ></v-text-field>
          <v-textarea
            v-model="description"
            v-validate="'required'"
            :error-messages="errors.collect('description')"
            label="Описание преимущества"
            data-vv-name="description"
          ></v-textarea>
        </v-card-text>
        <v-card-actions v-if="form">
          <v-btn flat @click.prevent="clear">Очистить</v-btn>
          <v-btn flat color="green" :loading="loading" :disabled="loading" @click.prevent="addedBlock">Добавить</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import FileUpload from '@/components/UploadFiles'
import InlineEditor from '@/components/InlineEditor'

export default {
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    FileUpload, InlineEditor, draggable
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    title: '',
    description: '',
    addedImage: false,
    file: null,
    loading: false,
    draggable: false,
    form: false
  }),
  methods: {
    newImageUpload(file) {
      this.file = file
      this.addedImage = true
    },
    addedBlock() {
      this.$validator.validateAll().then(async valid => {
        if (valid && this.file) {
          this.loading = true
          try {
            const advantage = await this.$store.dispatch('product/addAdvantage', {
              title: this.title,
              description: this.description,
              src: this.file.src,
              id: this.id
            })
            this.data.push(advantage)
            this.form = false
            this.clear()
          } catch (e) {}
          this.loading = false
        }
      })
    },
    clear() {
      this.title = ''
      this.description = ''
      this.addedImage = false
      this.$refs.newUpload.$refs.pond.removeFiles()
      this.$refs.newUpload.loadFiles = []
      this.$validator.reset()
    },
    async draggindEnd() {
      this.loading = true
      this.$store.dispatch('clearMessage')
      try {
        await this.$store.dispatch('product/updateMediaSort', this.data)
        this.$store.dispatch('getMessage', { text: 'Сортировка обновлена', color: 'green', timeout: 2000 })
      } catch (e) {}
      this.draggable = false
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.description {
  overflow: hidden;
}
.added-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    color: #7f828b;
    text-transform: uppercase;
    font-weight: 400;
    font-size: 19px;
    margin: 10px 0;
  }
}
.new-block {
  .v-card__actions {
    justify-content: flex-end;
  }
}
</style>
