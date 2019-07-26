<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout column>
    <draggable
      :list="items"
      class="layout row wrap"
      @start="dragging = true"
      @end="draggindEnd">
      <v-flex
        v-for="item in items"
        :key="item.id"
        xs3
      >
        <v-card
          class="ma-1 mt-2 hovered"
          flat
          height="100%">
          <div style="cursor: move; z-index: 1">
            <file-upload
              :files="[item]"
              :multiple="false"
              :removed="false"
              folder="/products/"
              @fileUpload="changeImage"/>
          </div>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                class="remove-icon"
                icon
                absolute
                top
                right
                @click="remove(item.id)"
                v-on="on">
                <v-icon color="red darken-2">delete</v-icon>
              </v-btn>
            </template>
            <span>Удалить преимущество</span>
          </v-tooltip>
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
    <v-dialog v-model="dialog" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">
          Подтвердите действие
        </v-card-title>
        <v-card-text>Вы хотите удалить это преимущество.<br> Вы уверены?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" flat :disabled="loading" @click="dialog = false">
            Отмена
          </v-btn>
          <v-btn color="green darken-1" flat :loading="loading" :disabled="loading" @click="remove(deleted)">
            Принять
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
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
    items: [],
    title: '',
    description: '',
    addedImage: false,
    file: null,
    loading: false,
    draggable: false,
    form: false,
    hover: false,
    dialog: false,
    deleted: null
  }),
  created() {
    this.items = this.data
  },
  mounted() {
    const hovered = document.querySelectorAll('.hovered')
    Array.from(hovered).forEach(hover => {
      hover.onmouseover = () => {
        hover.querySelector('.remove-icon').classList.add('active')
      }
      hover.onmouseleave = () => {
        hover.querySelector('.remove-icon').classList.remove('active')
      }
    })
  },
  methods: {
    newImageUpload(file) {
      this.file = file
      this.addedImage = true
    },
    changeImage(file) {
      console.log(file)
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
            this.items.push(advantage)
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
    async remove(id) {
      if (!this.dialog) {
        this.dialog = true
        this.deleted = id
        return
      }
      this.loading = true
      try {
        await this.$store.dispatch('product/removeAdvantage', id)
        this.items = this.items.filter(item => item.id !== id)
      } catch (e) {}
      this.loading = false
      this.dialog = false
    },
    async draggindEnd() {
      this.loading = true
      this.$store.dispatch('clearMessage')
      try {
        await this.$store.dispatch('product/updateMediaSort', this.items)
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
    font-size: 18px;
    margin: 10px 0;
  }
}
.new-block {
  .v-card__actions {
    justify-content: flex-end;
  }
}
.remove-icon {
  opacity: 0;
  visibility: hidden;
  transition: .3s;
  top: 20px;
  right: 20px;
  &.active {
    opacity: 1;
    visibility: visible;
  }
}
</style>