<template>
  <div>
    <variation-icon v-if="crud" :variations="variations" @go="goVariation" />
    <v-layout v-else-if="!query" class="mt-2">
      <v-flex
        v-for="variation in variations"
        :key="variation.id"
        ma-1
        md2
        xs12
      >
        <v-hover>
          <v-card
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`"
            class="card"
            height="450px"
          >
            <v-img
              :src="url + variation.thumbnail"
              :lazy-src="url + variation.thumbnail"
            >
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
                  />
                  <span v-else style="text-align: center;">Редактировать</span>
                </div>
              </v-expand-transition>
            </v-img>
            <v-layout class="ma-2" justify-space-between align-center>
              <status-chips :status="variation.status" :statuses="statuses" />
              <div>{{ variation.stock }} шт.</div>
            </v-layout>
            <v-card-actions>
              <div>
                <v-layout class="fill-height">
                  <v-flex class="card-title align-end flexbox" xs12>
                    <span class="black--text" v-text="variation.title"></span>
                  </v-flex>
                </v-layout>
                <v-divider class="mt-1 mb-2" />
                <span>{{ variation.price_individual | currency }}</span>
              </div>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
    <div v-else>
      <div class="back-button">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon small v-on="on" @click="back">
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </template>
          <span>Вернуться назад</span>
        </v-tooltip>
        <h2>{{ variation.title }}</h2>
      </div>
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
    if (window.location.search) {
      const id = +window.location.search.replace('?variation=', '')
      this.getVariation(id)
    }
  },
  methods: {
    async getVariation(id) {
      const currentState = this.$store.getters['crud/crud']
      this.$store.commit('crud/set', 'variation')
      this.loading = true
      try {
        this.variation = await this.$store.dispatch('crud/getOne', id)
        if (!window.location.search) {
          window.history.pushState(null, null, `?variation=${id}`)
        }
        this.query = window.location.search
      } catch (e) {
        console.error(e)
      }
      this.loading = false
      this.$store.commit('crud/set', currentState)
    },
    goVariation({ productId, variationId }) {
      this.$router.push(`/product/${productId}?variation=${variationId}`)
    },
    back() {
      window.history.replaceState(null, null, this.variation.product_id)
      this.query = ''
      this.variation = null
    }
  }
}
</script>

<style lang="scss" scoped>
.card-title {
  height: 80px;
  overflow: hidden;
}
</style>
