<template>
  <v-hover>
    <v-card
      slot-scope="{ hover }"
      :class="`elevation-${hover ? 12 : 2}`"
      class="card"
      @click="go"
    >
      <v-img
        :src="url + item.thumb"
        :lazy-src="url + item.thumb"
      />
      <v-card-actions>
        <div>
          <v-row class="fill-height">
            <v-col class="align-end flexbox" cols="12">
              <span class="card-title black--text" v-text="item.title" />
            </v-col>
          </v-row>
        </div>
        <v-spacer />
        <app-action-icon v-if="actions" :item="item" :actions="actions" />
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import AppActionIcon from '@/components/CRUD/ActionIcon'

export default {
  components: {
    AppActionIcon
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    actions: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data: () => ({
    url: ''
  }),
  created() {
    this.url = process.env.fileURL
  },
  methods: {
    go() {
      this.$router.push(`/product/${this.item.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card__actions {
    height: 52px;
}
.card-title {
    display: block;
    overflow: hidden;
    height: 22px;
}
.card {
  cursor: pointer;
}
</style>
