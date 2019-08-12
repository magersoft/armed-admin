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
        :key="item.id"
        md2
        xs12
      >
        <v-card
          class="ma-1 mt-2"
          flat
          height="100%"
        >
          <div class="handle">
            <v-img v-if="item.path" :src="`http://i1.ytimg.com/vi/${item.path}/mqdefault.jpg`"></v-img>
          </div>
          <v-text-field
            v-model="items[idx].path"
            solo
            hide-details
            label="Ссылка на Youtube"
            append-icon="play_circle_filled"
            class="mt-2"
            @change="getPreview"
            @click:append="getVideo"
          ></v-text-field>
        </v-card>
      </v-flex>
      <v-flex md2 xs12>
        <v-card
          class="mx-auto pa-2 mt-2 new-block"
          flat
          height="100%"
        >
          <v-btn
            fab
            dark
            color="primary"
            @click.prevent="items.push({ path: '' })"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
    </draggable>
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
    draggable: false,
    loading: false,
    form: false
  }),
  created() {
    this.items = this.data
  },
  methods: {
    getPreview() {
      this.items = this.items.map(item => {
        item.path = item.path.replace('https://youtu.be/', '').replace('https://www.youtube.com/watch?v=', '')
        return item
      })
    },
    getVideo() {
      console.log('video')
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
</style>
