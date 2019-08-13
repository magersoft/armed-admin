<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout column>
    <draggable
      :list="items"
      class="layout row wrap"
      handle=".handle"
      @start="draggable = true"
      @end="draggindEnd"
    >
      <v-flex
        v-for="item in items"
        :key="item.id"
        md3
        xs12
      >
        <v-card
          class="ma-1 mt-2 hovered"
          flat
          height="100%"
        >
          <div style="cursor: move">
            <file-upload
              :files="[item]"
              :multiple="false"
              :removed="false"
              folder="/products/"
              @fileUpload="changeImage"
            />
          </div>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                class="remove-icon white"
                icon
                absolute
                small
                @click="remove(item.id)"
                v-on="on"
              >
                <v-icon color="red darken-2">
                  delete
                </v-icon>
              </v-btn>
            </template>
            <span>Удалить преимущество</span>
          </v-tooltip>
          <h3 class="title">
            <inline-editor :id="item.id" :text="item.title" action="updateAdvantageTitle" />
          </h3>
          <div class="description mt1">
            <inline-editor :id="item.id" :text="item.description" action="updateAdvantageDescription" textarea />
          </div>
        </v-card>
      </v-flex>
      <v-flex md3 xs12>
        <v-card
          class="mx-auto pa-2 mt-2 new-block"
          flat
          height="100%"
        >
          <div v-if="!addedImage" class="added-header">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  dark
                  color="primary"
                  :disabled="form"
                  @click.prevent="form = !form"
                  v-on="on"
                >
                  <v-icon>add</v-icon>
                </v-btn>
              </template>
              <span>Добавить преимущество</span>
            </v-tooltip>
          </div>
          <v-card-text v-if="form">
            <file-upload
              ref="newUpload"
              :file="addedImage"
              :multiple="false"
              folder="/products/"
              @fileUpload="newImageUpload"
            />
            <v-text-field
              v-model="title"
              v-validate="'required'"
              :error-messages="errors.collect('title')"
              label="Заголовок преимущества"
              data-vv-name="title"
            />
            <v-textarea
              v-model="description"
              v-validate="'required'"
              :error-messages="errors.collect('description')"
              label="Описание преимущества"
              data-vv-name="description"
            />
          </v-card-text>
          <v-card-actions v-if="form">
            <v-btn text @click.prevent="clear">
              Очистить
            </v-btn>
            <v-btn text color="green" :loading="loading" :disabled="loading" @click.prevent="addedBlock">
              Добавить
            </v-btn>
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
          <v-btn color="green darken-1" text :disabled="loading" @click="dialog = false">
            Отмена
          </v-btn>
          <v-btn color="green darken-1" text :loading="loading" :disabled="loading" @click="remove(deleted)">
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
    },
    variationId: {
      type: Number,
      required: false,
      default: () => null
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
    this.hovered()
  },
  methods: {
    newImageUpload(file) {
      this.file = file
      this.addedImage = true
    },
    async changeImage(file) {
      this.$store.dispatch('clearMessage')
      try {
        await this.$store.dispatch('product/updateAdvantageImage', file)
        this.$store.dispatch('getMessage', { text: 'Изображение обновлено', color: 'green', timeout: 2000 })
      } catch (e) {}
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
              product_id: this.id,
              variation_id: this.variationId,
              menuindex: this.items.length + 1
            })
            this.items.push(advantage)
            this.form = false
            this.clear()
            setTimeout(() => {
              this.hovered()
            })
          } catch (e) {}
          this.loading = false
        } else {
          this.$store.dispatch('getMessage', { text: 'Загрузите изображение', color: 'red', timeout: 2000 })
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
        await this.$store.dispatch('product/removeMedia', id)
        this.items = this.items.filter(item => item.id !== id)
        this.$store.dispatch('getMessage', { text: 'Преимущество удалено', color: 'green', timeout: 2000 })
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
    },
    hovered() {
      const hovered = document.querySelectorAll('.hovered')
      Array.from(hovered).forEach(hover => {
        hover.onmouseover = () => {
          hover.querySelector('.remove-icon').classList.add('active')
        }
        hover.onmouseleave = () => {
          hover.querySelector('.remove-icon').classList.remove('active')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.handle {
  cursor: move;
}
.description {
  overflow: hidden;
}
.added-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
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
