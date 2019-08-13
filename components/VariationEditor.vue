<template>
  <div>
    <variation-icon v-if="crud" :variations="variations" @go="goVariation" />
    <v-layout v-else-if="!query && !variation" wrap class="mt-2">
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
              v-if="variation.thumbnail"
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
            <div
              v-else
              class="d-flex justify-center align-center transition-fast-in-fast-out v-card--reveal white--text"
              style="height: 260px; font-size: 20px; cursor: pointer; background: rgba(97,97,97,.5)"
              @click="getVariation(variation.id)"
            >
              <v-progress-circular
                v-if="loading && hover"
                indeterminate
                color="primary"
                :size="50"
              />
              <span v-else style="text-align: center;">Редактировать</span>
            </div>
            <v-layout class="ma-2" justify-space-between align-center>
              <status-chips :status="variation.status" :statuses="statuses" />
              <div>{{ variation.stock }} шт.</div>
            </v-layout>
            <v-card-actions>
              <div>
                <v-layout class="fill-height">
                  <v-flex class="card-title align-end flexbox" xs12>
                    <span class="black--text" v-text="variation.title" />
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
      <v-tabs
        v-model="currentItem"
        background-color="transparent"
        fixed-tabs
        slider-color="primary"
      >
        <v-tab
          v-for="item in items"
          :key="item"
        >
          {{ item }}
        </v-tab>
      </v-tabs>
      <div class="title mt-2">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon small class="mr-2" v-on="on" @click="back">
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </template>
          <span>Вернуться назад</span>
        </v-tooltip>
        <h4>{{ variation.title }}</h4>
      </div>
      <v-tabs-items v-model="currentItem">
        <v-tab-item>
          <v-card flat>
            <v-layout>
              <v-flex md8 xs12>
                <v-layout class="pa-3">
                  <v-flex md12>
                    <v-layout wrap justify-start align-content-start>
                      <v-flex xs12>
                        <v-text-field
                          v-model="controls.title"
                          class="pa-2"
                          label="Название"
                          required
                        />
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          v-model="controls.markettitle"
                          class="pa-2"
                          label="Заголовок для Яндекс.Маркета"
                        />
                      </v-flex>
                      <v-flex xs12 class="mb-4">
                        <ckeditor v-model="controls.text" type="classic" :config="{ language: 'ru' }"></ckeditor>
                      </v-flex>
                      <v-flex xs12>
                        <h5>Свойства вариации</h5>
                        <div v-for="property in variation.variableProperties" :key="property.id">
                          <v-layout row wrap align-center>
                            <v-flex xs12 md4>
                              <v-select
                                v-model="property.value"
                                :items="property.values"
                                filled
                                hide-details
                                :label="property.title"
                                class="pa-2"
                              />
                            </v-flex>
                            <v-flex xs12 md4>
                              <v-select
                                v-model="property.dimension"
                                :items="property.dimensions"
                                filled
                                hide-details
                                label="Единица измерения"
                                class="pa-2"
                              />
                            </v-flex>
                            <v-flex xs12 md4>
                              <v-layout column class="px-2">
                                <v-checkbox v-model="property.is_selectable" color="primary" hide-details label="Выбираемый" class="mt-0" />
                                <v-checkbox v-model="property.ignore" color="primary" hide-details label="Игнорировать вариацию" class="mt-0" />
                              </v-layout>
                            </v-flex>
                          </v-layout>
                          <v-divider class="ma-2" />
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex md4 xs12>
                <v-layout column>
                  <v-flex>
                    <file-upload
                      :files="variation.thumbnail"
                      :multiple="false"
                      folder="/products/"
                      @fileUpload="thumbnailUpload"
                      @fileRemove="thumbnailRemove"
                    />
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-flex xs12 class="mx-2">
            <MultiBlock :id="variation.product_id" :variation-id="variation.id" :data="variation.advantages" />
          </v-flex>
        </v-tab-item>
        <v-tab-item>
          <file-upload
            :files="controls.files.gallery"
            grid="md2"
            multiple
            draggable-files
            folder="/products/"
            @fileUpload="imageUpload"
            @fileRemove="imageRemove"
          />
        </v-tab-item>
        <v-tab-item>
          <multi-video :id="variation.product_id" v-model="variation.videos_array" :variation-id="variation.id" />
        </v-tab-item>
        <v-tab-item>
          <v-layout column wrap>
            <v-text-field
              v-model="controls.seo_title"
              label="SEO заголовок"
              counter
              maxlength="65"
            ></v-text-field>
            <v-text-field
              v-model="controls.h1"
              label="H1 заголовок"
              counter
              maxlength="255"
            ></v-text-field>
            <v-textarea
              v-model="controls.seo_description"
              label="SEO описание"
              counter
              maxlength="255"
            ></v-textarea>
          </v-layout>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import VariationIcon from '@/components/CRUD/VariationIcon'
import StatusChips from '@/components/StatusChips.vue'
import MultiBlock from '@/components/MultiBlock.vue'
import FileUpload from '@/components/UploadFiles.vue'
import MultiVideo from '@/components/MultiVideo'

export default {
  components: {
    VariationIcon, StatusChips, MultiBlock, FileUpload, MultiVideo
  },
  props: {
    value: {
      type: Object,
      required: true
    },
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
    url: '',
    query: null,
    loading: false,
    variation: null,
    currentItem: null,
    notSave: false,
    controls: {},
    items: ['Основное', 'Преимущества', 'Изображения', 'Видео', 'SEO']
  }),
  created() {
    this.url = process.env.fileURL
    this.controls = this.value
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

        for (const name in this.variation) {
          if (this.variation.hasOwnProperty(name)) {
            if (this.controls.hasOwnProperty(name)) {
              this.controls[name] = this.variation[name] ? this.variation[name] : ''
            }
          }
        }
        this.controls.files.thumbnail = this.variation.thumbnail
        this.controls.files.gallery = this.variation.images.map(image => ({ id: image.id, src: image.path }))
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
      if (this.notSave) {
        this.$emit('back')
        this.notSave = false
      }
    },
    thumbnailUpload(file) {
      this.controls.files.thumbnail = file
      this.notSave = true
    },
    thumbnailRemove() {
      this.controls.files.thumbnail = null
      this.notSave = true
    },
    imageUpload(files) {
      this.controls.files.gallery.push(files)
      this.notSave = true
    },
    imageRemove(file) {
      this.controls.files.gallery = this.controls.files.gallery.filter(img => img.src !== file)
      this.notSave = true
    }
  }
}
</script>

<style lang="scss" scoped>
.card-title {
  height: 80px;
  overflow: hidden;
}
.title {
  display: flex;
  align-items: center;
}
</style>
