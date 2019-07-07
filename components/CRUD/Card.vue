<template>
  <v-hover>
    <v-card
      slot-scope="{ hover }"
      :class="`elevation-${hover ? 12 : 2}`"
    >
      <v-img
        :src="item.thumb"
        :lazy-src="item.thumb"
        height="350px"
      />
      <v-card-actions>
        <div>
          <v-layout fill-height>
            <v-flex xs12 align-end flexbox>
              <span class="card-title black--text" v-text="item.title" />
            </v-flex>
          </v-layout>
        </div>
        <v-spacer />
        <app-action-icon :item="item" :actions="actions" />
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
      required: false
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
</style>
