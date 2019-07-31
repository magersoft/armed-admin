<template>
  <div>
    <variation-icon v-if="crud" :variations="variations" @go="goVariation" />
    <v-layout v-else-if="!query" row wrap mt-2>
      <v-flex
        v-for="variation in variations"
        :key="variation.id"
        md2
        xs12
        ma-1
      >
        <v-hover>
          <v-card
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`"
            class="card"
            height="400px"
          >
            <v-img
              :src="url + variation.thumbnail"
              :lazy-src="url + variation.thumbnail">
              <v-expand-transition>
                <div
                  v-if="hover"
                  class="d-flex justify-center align-center transition-fast-in-fast-out v-card--reveal white--text"
                  style="height: 100%; font-size: 20px; cursor: pointer; background: rgba(97,97,97,.5)"
                  @click="getVariation(variation.id)"
                >
                  <v-progress-circular
                    v-if="loading"
                    indeterminate
                    color="primary"
                    :size="50"
                  ></v-progress-circular>
                  <span style="text-align: center;" v-else>Редактировать</span>
                </div>
              </v-expand-transition>
            </v-img>
            <v-layout row justify-space-between align-center ml-2 mr-2>
              <status-chips :status="variation.status" :statuses="statuses" />
              <div>{{ variation.stock }} шт.</div>
            </v-layout>
            <v-card-actions>
              <div>
                <v-layout fill-height>
                  <v-flex class="card-title" xs12 align-end flexbox>
                    <span class="black--text" v-text="variation.title" />
                  </v-flex>
                </v-layout>
                <v-divider class="mt-1 mb-2"></v-divider>
                <span>{{ variation.price_individual | currency }}</span>
              </div>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
    <div v-else>
      {{ query }}
    </div>
  </div>
</template>

<script>
import VariationIcon from '@/components/CRUD/VariationIcon'
import StatusChips from '@/components/StatusChips.vue'
export default {
  components: {
    VariationIcon, StatusChips
  },
  props: {
    variations: {
      type: [Array, Object],
      required: true
    },
    crud: {
      type: Boolean,
      required: false,
      default: false
    },
    statuses: {
      type: [Array, Object],
      required: false,
      default: () => []
    }
  },
  data: () => ({
    dialog: false,
    url: '',
    query: null,
    loading: false,
    variation: null
  }),
  created() {
    this.url = process.env.fileURL
  },
  mounted() {
    this.query = window.location.search
    if (this.query) {
      this.$emit('selectTab')
    }
  },
  methods: {
    async getVariation(id) {
      const currentState = this.$store.getters['crud/crud']
      this.$store.commit('crud/set', 'variation')
      this.loading = true
      try {
        this.variation = await this.$store.dispatch('crud/getOne', id)
        window.history.pushState(null, null, `?variation=${id}`)
        this.query = window.location.search
      } catch (e) {}
      this.loading = false
      this.$store.commit('crud/set', currentState)
    },
    goVariation({ productId, variationId }) {
      this.$router.push(`/product/${productId}?variation=${variationId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.card-title {
  height: 60px;
  overflow: hidden;
}
</style>
