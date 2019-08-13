<template>
  <v-layout column>
    <draggable
      :list="items"
      class="layout row wrap"
      handle=".handle"
      @start="draggable = true"
      @end="draggingEnd"
    >
      <v-flex
        v-for="(item, idx) in items"
        :key="idx"
        md2
        xs12
      >
        <v-card
          class="ma-1 mt-2 hovered"
          flat
          height="100%"
        >
          <div class="handle">
            <v-img v-if="item.path" :src="`http://i1.ytimg.com/vi/${item.path}/mqdefault.jpg`"></v-img>
          </div>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                class="remove-icon white"
                icon
                absolute
                small
                @click="remove(item.id, idx)"
                v-on="on"
              >
                <v-icon color="red darken-2">
                  delete
                </v-icon>
              </v-btn>
            </template>
            <span>Удалить видео</span>
          </v-tooltip>
          <v-text-field
            v-model="items[idx].path"
            solo
            hide-details
            label="Ссылка на Youtube"
            class="mt-2"
            @change.native="getPreview($event, idx)"
            @click:append="getVideo"
          ></v-text-field>
        </v-card>
      </v-flex>
      <v-flex md2 xs12>
        <v-card
          class="mx-auto pa-2 mt-2 new-block elevation-1"
          flat
          height="194px"
        >
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                color="primary"
                @click.prevent="items.push({ path: '' })"
                v-on="on"
              >
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Добавить видео</span>
          </v-tooltip>
        </v-card>
      </v-flex>
    </draggable>
    <v-dialog v-model="dialog" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">
          Подтвердите действие
        </v-card-title>
        <v-card-text>Вы хотите удалить это видео.<br> Вы уверены?</v-card-text>
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

export default {
  components: {
    draggable
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    value: {
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
    draggable: false,
    loading: false,
    form: false,
    dialog: false,
    deleted: null
  }),
  created() {
    this.items = this.value
  },
  mounted() {
    this.hovered()
  },
  methods: {
    getPreview($event, idx) {
      this.items[idx].path = $event.target.value.replace('https://youtu.be/', '').replace('https://www.youtube.com/watch?v=', '')
      setTimeout(() => {
        this.hovered()
      })
    },
    getVideo() {
      console.log('video')
    },
    async remove(id, idx) {
      if (!id) {
        this.items.splice(idx, 1)
        return false
      }
      if (!this.dialog) {
        this.dialog = true
        this.deleted = { id, idx }
        return
      }
      this.loading = true
      try {
        await this.$store.dispatch('product/removeMedia', this.deleted.id)
        this.items.splice(this.deleted.idx, 1)
      } catch (e) {}
      this.loading = false
      this.dialog = false
    },
    async draggingEnd() {
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
.new-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.added-header {
  text-transform: uppercase;
  color: #7f828b;
  font-size: 18px;
  margin: 10px 0;
}
.remove-icon {
  opacity: 0;
  visibility: hidden;
  transition: .3s;
  top: 10px;
  right: 10px;
  &.active {
    opacity: 1;
    visibility: visible;
  }
}
</style>
