<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-card>
      <div class="flex fix-extension-toolbar">
        <v-navigation-drawer
          permanent
          class="hidden-md-and-down aside"
        >
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Редактировать</v-toolbar-title>
          </v-toolbar>
          <v-list>
            <v-list-item
              v-for="(item, idx) in menu"
              :key="idx"
              :class="{ 'primary--text v-list-item--active': tab === idx }"
              @click="menuTabs(idx)"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider/>
            <div class="flex justify-space-between ma-2">
              <v-btn text @click="$router.go(-1)">
                Назад
              </v-btn>
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="green darken-1"
                text
                @click="save"
              >
                Сохранить
              </v-btn>
            </div>
          </v-list>
        </v-navigation-drawer>
        <v-layout column>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>{{ data.displaytitle }}</v-toolbar-title>
            <v-spacer />
            <status-chips :id="controls.id" :status="controls.status" :statuses="statuses" />
            <v-btn icon small>
              <v-icon>more_vert</v-icon>
            </v-btn>
            <template v-slot:extension>
              <v-tabs
                v-model="tab"
                color="primary"
                dark
                grow
                show-arrows
                class="hidden-lg-and-up"
              >
                <v-tabs-slider color="white" />

                <v-tab
                  v-for="item in menu"
                  :key="item.title"
                >
                  {{ item.title }}
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>
          <v-divider />
          <div class="container">
            <v-form>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-card flat>
                    <v-container>
                      <v-layout wrap>
                        <v-flex md8 xs12>
                          <v-layout class="pa-3">
                            <v-flex md12>
                              <v-layout wrap justify-start align-content-start>
                                <v-flex xs12 md6>
                                  <v-text-field
                                    v-model="controls.title"
                                    v-validate="'required'"
                                    :error-messages="errors.collect('scope0.title')"
                                    data-vv-name="title"
                                    data-vv-scope="scope0"
                                    label="Название"
                                    required
                                  />
                                </v-flex>
                                <v-flex xs12 md6>
                                  <v-text-field
                                    v-model="controls.menutitle"
                                    v-validate="'required'"
                                    :error-messages="errors.collect('scope0.menutitle')"
                                    data-vv-name="menutitle"
                                    data-vv-scope="scope0"
                                    label="Заголовок в меню"
                                    required
                                  />
                                </v-flex>
                                <v-flex xs12 md6>
                                  <v-text-field
                                    v-model="controls.typeprefix"
                                    data-vv-name="typeprefix"
                                    data-vv-scope="scope0"
                                    label="Тип товара"
                                  />
                                </v-flex>
                                <v-flex xs12 md6>
                                  <v-text-field
                                    v-model="controls.model"
                                    v-validate="'required'"
                                    :error-messages="errors.collect('scope0.model')"
                                    data-vv-name="model"
                                    data-vv-scope="scope0"
                                    label="Модель"
                                    required
                                  />
                                </v-flex>
                                <v-flex xs12 md6>
                                  <multi-select
                                    v-model="controls.category_id"
                                    :items="categories"
                                    label="Категория"
                                  />
                                </v-flex>
                                <v-flex xs12 md6>
                                  <multi-select
                                    v-model="controls.manufacturer_id"
                                    :items="manufacturers"
                                    clearable
                                    label="Производитель"
                                  />
                                </v-flex>
                                <v-flex xs12 md6>
                                  <multi-select
                                    v-model="controls.sizetable_id"
                                    :items="sizetables"
                                    deletable-chips
                                    clearable
                                    label="Таблица размеров"
                                  />
                                </v-flex>
                                <v-flex xs12 md6>
                                  <v-text-field
                                    v-model="controls.warranty"
                                    v-validate="`min_value:1`"
                                    :error-messages="errors.collect('scope0.warranty')"
                                    data-vv-name="warranty"
                                    data-vv-scope="scope0"
                                    label="Гарантия (месяцев)"
                                  />
                                </v-flex>
                                <v-flex xs12>
                                  <multi-select
                                    v-model="controls.additional_categories_ids"
                                    :items="additional_categories"
                                    multiple
                                    deletable-chips
                                    persistent-hint
                                    clearable
                                    label="Выбрать"
                                    hint="Дополнительные категорийные срезы"
                                  />
                                </v-flex>
                                <v-flex>
                                  <v-switch
                                    v-model="controls.is_bestseller"
                                    color="primary"
                                    label="Хит"
                                    hide-details
                                  />
                                  <v-switch
                                    v-model="controls.is_preorderable"
                                    color="primary"
                                    label="Доступен для предзаказа"
                                    hide-details
                                  />
                                  <v-switch
                                    v-model="controls.certificated_dialer"
                                    color="primary"
                                    label="Сертифицированный дилер компании Армед"
                                    hide-details
                                  />
                                </v-flex>
                                <v-flex xs12>
                                  <div class="editor mt2">
                                    <label class="v-label v-label--active theme--light">Описание товара</label>
                                    <ckeditor v-model="controls.text" type="classic" :config="{ language: 'ru' }"></ckeditor>
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
                                :files="data.thumbnail"
                                :multiple="false"
                                folder="/products/"
                                @fileUpload="thumbnailUpload"
                                @fileRemove="thumbnailRemove"
                              />
                            </v-flex>
                            <v-flex>
                              <multi-input v-model="controls.features_array" label="Особенности товара" />
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-tab-item v-if="variations">
                  <v-card flat>
                    <v-container>
                      <variation-editor v-model="controls.variation" :variations="variations" :statuses="statuses" @back="save" />
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-container>
                      <multi-select
                        v-model="controls.analogs_ids"
                        :items="allProducts"
                        multiple
                        deletable-chips
                        persistent-hint
                        clearable
                        label="Изменить аналоги"
                      />
                      <v-card-text><h2>Аналоги товара</h2></v-card-text>
                      <v-layout class="mt-2">
                        <v-flex
                          v-for="analog in analogsCard"
                          :key="analog.id"
                          class="ma-1"
                          xs2
                        >
                          <app-card :item="analog" />
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-container>
                      <v-card-text><h2>Преимущества товара</h2></v-card-text>
                      <v-flex xs12 class="mx-2">
                        <multi-block :id="controls.id" :data="advantages" />
                      </v-flex>
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-container>
                      <multi-select
                        v-model="controls.soput_ids"
                        :items="allProducts"
                        multiple
                        deletable-chips
                        persistent-hint
                        clearable
                        label="Сопутствующие товары"
                      />
                      <multi-select
                        v-model="controls.second_soput_ids"
                        :items="allProducts"
                        multiple
                        deletable-chips
                        persistent-hint
                        clearable
                        label="Рекомендации для апсейла"
                      />
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-container>
                      <v-card-text>Характеристики товара</v-card-text>
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-container>
                      <v-card-text><h2>Галерея товара</h2></v-card-text>
                      <v-layout>
                        <v-flex xs12>
                          <file-upload
                            :files="controls.files.gallery"
                            grid="md2"
                            multiple
                            draggable-files
                            folder="/products/"
                            @fileUpload="imageUpload"
                            @fileRemove="imageRemove"
                          />
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-container>
                      <v-card-text><h2>Видео товара</h2></v-card-text>
                      <multi-video :id="controls.id" v-model="controls.videos_array" />
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-container>
                      <v-card-text><h2>SEO</h2></v-card-text>
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
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-container>
                      <v-card-text>Отзывы товара</v-card-text>
                    </v-container>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-form>
          </div>
        </v-layout>
      </div>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">
          Подтвердите действие
        </v-card-title>
        <v-card-text v-if="notSave" v-html="notSaveText" />
        <v-card-text v-else>
          Были изменены некоторые поля. <br>Вы хотите сохранить изменения?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="dark" text :disabled="loading" @click="dialog = false">
            Отменить
          </v-btn>
          <v-btn color="green darken-1" text :loading="loading" :disabled="loading" @click="save">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FileUpload from '@/components/UploadFiles'
import MultiInput from '@/components/MultiInput'
import MultiSelect from '@/components/MultiSelect'
import MultiBlock from '@/components/MultiBlock'
import StatusChips from '@/components/StatusChips'
import AppCard from '@/components/CRUD/Card'
import VariationEditor from '@/components/VariationEditor'
import MultiVideo from '@/components/MultiVideo'

export default {
  validate({ params }) {
    return Boolean(params.id)
  },
  middleware: ['auth'],
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    FileUpload, MultiInput, MultiSelect, MultiBlock, StatusChips, AppCard, VariationEditor, MultiVideo
  },
  data: () => ({
    url: '/',
    tab: null,
    needTab: null,
    loading: false,
    dialog: false,
    fileDirty: false,
    notSave: false,
    notSaveText: null,
    categories: [],
    additional_categories: [],
    manufacturers: [],
    sizetables: [],
    statuses: [],
    allProducts: [],
    analogsCard: [],
    advantages: [],
    variations: null,
    price: null,
    controls: {
      id: null,
      title: '',
      menutitle: '',
      is_bestseller: false,
      is_preorderable: false,
      certificated_dialer: false,
      typeprefix: '',
      model: '',
      warranty: '',
      category_id: null,
      manufacturer_id: null,
      sizetable_id: null,
      features_array: [],
      videos_array: [],
      additional_categories_ids: [],
      text: '',
      status: null,
      analogs_ids: [],
      soput_ids: [],
      second_soput_ids: [],
      h1: null,
      seo_title: null,
      seo_description: null,
      files: {
        thumbnail: null,
        gallery: []
      },
      variation: null
    },
    menu: [
      { title: 'Основное', icon: 'dashboard', show: true },
      { title: 'Вариации', icon: 'dashboard', show: false },
      { title: 'Аналоги', icon: 'dashboard', show: true },
      { title: 'Преимущества', icon: 'dashboard', show: true },
      { title: 'Сопутка', icon: 'dashboard', show: true },
      { title: 'Характеристики', icon: 'dashboard', show: true },
      { title: 'Изображения', icon: 'dashboard', show: true },
      { title: 'Видео', icon: 'dashboard', show: true },
      { title: 'SEO', icon: 'dashboard', show: true }
      // { title: 'Отзывы', icon: 'dashboard', show: true }
    ]
  }),
  computed: {
    isDirty() {
      return Object.keys(this.fields).some(key => key.startsWith('$') ? Object.keys(this.fields[key]).some(innerKey => this.fields[key][innerKey].dirty) : this.fields[key].dirty)
    }
  },
  async asyncData({ store, params }) {
    store.commit('crud/set', 'product')
    try {
      const data = await store.dispatch('crud/getOne', params.id)
      return { data }
    } catch (e) {}
  },
  created() {
    this.url = process.env.fileURL
    for (const name in this.data) {
      if (this.data.hasOwnProperty(name)) {
        if (this.controls.hasOwnProperty(name)) {
          this.controls[name] = this.data[name] ? this.data[name] : ''
        }
      }
    }
    this.controls.files.thumbnail = this.data.thumbnail
    this.controls.files.gallery = this.data.images.map(image => ({ id: image.id, src: image.path }))
    this.controls.features_array = this.data.features.split('||')
    this.controls.status = this.data.status
    this.variations = this.data.variations
    this.categories = this.data.categories
    this.additional_categories = this.data.additional_categories
    this.manufacturers = this.data.manufacturers
    this.sizetables = this.data.sizetables
    this.statuses = this.data.statuses
    this.allProducts = this.data.all_products
    this.analogsCard = this.data.analogs_card
    this.advantages = this.data.advantages
    this.price = this.data.price

    if (this.variations) {
      this.controls.variation = {
        id: null,
        title: null,
        text: null,
        markettitle: null,
        seo_title: null,
        seo_description: null,
        videos_array: [],
        files: {
          thumbnail: null,
          gallery: []
        }
      }
    }
  },
  mounted() {
    this.menu = this.menu.map(item => {
      if (item.title === 'Вариации') {
        item.show = this.variations
      }
      return item
    }).filter(item => !!item.show)
    if (window.location.search) {
      this.tab = 1
    }
  },
  methods: {
    menuTabs(idx) {
      this.$validator.validate(`scope${this.tab}.*`).then(valid => {
        if (!valid) {
          const msg = this.$validator.errors.items.map(item => item.msg)
          this.$store.dispatch('getMessage', { text: msg.join('\n'), timeout: 3600 })
          return false
        }
        if (this.isDirty || this.notSave) {
          this.dialog = true
          this.needTab = idx
          return false
        }
        this.tab = idx
      })
    },
    save() {
      this.loading = true
      const validateAllScope = []
      const promise = new Promise((resolve, reject) => {
        this.menu.forEach((item, idx) => {
          this.$validator.validateAll(`scope${idx}`).then(async valid => {
            await validateAllScope.push(valid)
            resolve(valid)
            if (!valid) {
              this.tab = idx
              const msg = this.$validator.errors.items.map(item => item.msg)
              this.$store.dispatch('getMessage', { text: msg.join('\n'), timeout: 7200 })
              this.loading = false
              return false
            }
          })
        })
      })
      promise.then(async () => {
        if (!validateAllScope.some(valid => !valid)) {
          try {
            try {
              await this.$store.dispatch('product/save', this.controls)
            } catch (e) {
              throw e
            }
            this.$validator.reset()
            if (this.dialog) {
              this.menuTabs(this.needTab)
            }
            this.dialog = false
            this.notSave = false
            this.$store.dispatch('getMessage', { text: 'Изменения успешно сохранены', color: 'green', timeout: 3600 })
          } catch (e) {
            this.$store.dispatch('getMessage', { text: String(Object.values(e.response.data)), color: 'red', timeout: 7200 })
          }
          this.loading = false
        }
      })
    },
    thumbnailUpload(file) {
      this.controls.files.thumbnail = file
    },
    thumbnailRemove() {
      this.controls.files.thumbnail = null
    },
    imageUpload(files) {
      this.notSave = true
      this.notSaveText = 'Были загружены новые изображения. <br>Вы хотите сохранить их?'
      this.controls.files.gallery.push(files)
    },
    imageRemove(file) {
      this.notSave = true
      this.notSaveText = 'Были удалены изображения с сервера. <br>Сохраните изменения!'
      this.controls.files.gallery = this.controls.files.gallery.filter(img => img.src !== file)
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.aside {
  z-index: 1;
  flex-shrink: 0;
}
.v-input {
  padding: 10px;
}
.editor {
  height: 350px;
}
.v-toolbar {
  flex: none;
}
</style>
