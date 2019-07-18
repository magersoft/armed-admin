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
            <v-list-tile
              v-for="(item, idx) in menu"
              :key="idx"
              :class="{ 'primary--text v-list__tile--active': tab === idx }"
              @click="menuTabs(idx)"
            >
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <div class="flex justify-space-between mt2">
              <v-btn flat>
                Назад
              </v-btn>
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="green darken-1"
                flat
                @click="save"
              >
                Сохранить
              </v-btn>
            </div>
          </v-list>
        </v-navigation-drawer>
        <v-layout column>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>{{ data.title }}</v-toolbar-title>
            <v-spacer />

            <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn>

            <v-btn icon>
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
          <v-container>
            <v-form>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-card flat>
                    <v-layout row wrap>
                      <v-flex md8 xs12>
                        <v-layout pa-3>
                          <v-flex md12>
                            <v-layout row wrap justify-start align-content-start>
                              <v-flex xs12 md6>
                                <v-text-field
                                  v-model="controls.title"
                                  v-validate="'required'"
                                  :error-messages="errors.collect('scope0.title')"
                                  data-vv-name="title"
                                  data-vv-scope="scope0"
                                  label="Название"
                                  required></v-text-field>
                              </v-flex>
                              <v-flex xs12 md6>
                                <v-text-field
                                  v-model="controls.menutitle"
                                  v-validate="'required'"
                                  :error-messages="errors.collect('scope0.menutitle')"
                                  data-vv-name="menutitle"
                                  data-vv-scope="scope0"
                                  label="Заголовок в меню"
                                  required></v-text-field>
                              </v-flex>
                              <v-flex xs12 md6>
                                <v-text-field
                                  v-model="controls.typeprefix"
                                  data-vv-name="typeprefix"
                                  data-vv-scope="scope0"
                                  label="Тип товара"></v-text-field>
                              </v-flex>
                              <v-flex xs12 md6>
                                <v-text-field
                                  v-model="controls.model"
                                  v-validate="'required'"
                                  :error-messages="errors.collect('scope0.model')"
                                  data-vv-name="model"
                                  data-vv-scope="scope0"
                                  label="Модель"
                                  required></v-text-field>
                              </v-flex>
                              <v-flex xs12 md6>
                                <v-select
                                  v-model="controls.category_id"
                                  :items="categories"
                                  label="Категория"
                                ></v-select>
                              </v-flex>
                              <v-flex xs12 md6>
                                <v-select
                                  v-model="controls.manufacturer_id"
                                  :items="manufacturers"
                                  label="Производитель"
                                ></v-select>
                              </v-flex>
                              <v-flex xs12 md6>
                                <v-text-field
                                  v-model="controls.warranty"
                                  v-validate="`min_value:1`"
                                  :error-messages="errors.collect('scope0.warranty')"
                                  data-vv-name="warranty"
                                  data-vv-scope="scope0"
                                  label="Гарантия (месяцев)"></v-text-field>
                              </v-flex>
                              <v-flex xs12 md6>
                                <multi-input />
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex md4 xs12>
                        <file-upload
                          :id="data.id"
                          :files="data.thumbnail"
                          :multiple="false"
                          folder="/products/"
                          @fileUpload="thumbnailUpload"
                          @fileRemove="thumbnailRemove"
                        />
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-text-field
                      v-model="controls.test"
                      v-validate="'required'"
                      :error-messages="errors.collect('scope1.test')"
                      data-vv-name="test"
                      data-vv-scope="scope1"
                      label="Тест"
                      required
                    />
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>3</v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>4</v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>5</v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text><h2>Галерея товара</h2></v-card-text>
                    <v-layout>
                      <v-flex xs12>
                        <file-upload
                          :id="data.id"
                          :files="controls.files.gallery"
                          grid="md2"
                          multiple
                          folder="/products/"
                          @fileUpload="imageUpload"
                          @fileRemove="imageRemove"
                        />
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>7</v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>8</v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>9</v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-form>
          </v-container>
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
          <v-btn color="dark" flat :disabled="loading" @click="dialog = false">
            Отменить
          </v-btn>
          <v-btn color="green darken-1" flat :loading="loading" :disabled="loading" @click="save">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import fileUpload from '@/components/UploadFiles'
import multiInput from '@/components/MultiInput'

export default {
  validate({ params }) {
    return Boolean(params.id)
  },
  middleware: ['auth'],
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    fileUpload, multiInput
  },
  data: () => ({
    tab: null,
    needTab: null,
    loading: false,
    dialog: false,
    fileDirty: false,
    notSave: false,
    notSaveText: null,
    categories: [],
    manufacturers: [],
    controls: {
      id: null,
      title: '',
      menutitle: '',
      typeprefix: '',
      model: '',
      warranty: '',
      test: '1',
      category_id: null,
      manufacturer_id: null,
      files: {
        thumbnail: null,
        gallery: []
      }
    },
    menu: [
      { title: 'Основное', icon: 'dashboard' },
      { title: 'Аналоги', icon: 'dashboard' },
      { title: 'Преимущества', icon: 'dashboard' },
      { title: 'Сопутка', icon: 'dashboard' },
      { title: 'Характеристики', icon: 'dashboard' },
      { title: 'Изображения', icon: 'dashboard' },
      { title: 'Видео', icon: 'dashboard' },
      { title: 'SEO', icon: 'dashboard' },
      { title: 'Отзывы', icon: 'dashboard' }
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
    for (const name in this.data) {
      if (this.data.hasOwnProperty(name)) {
        if (this.controls.hasOwnProperty(name)) {
          this.controls[name] = this.data[name]
        }
      }
    }
    this.controls.files.thumbnail = this.data.thumbnail
    this.controls.files.gallery = this.data.images.map(image => ({ id: image.id, src: image.path }))
    this.categories = this.data.categories
    this.manufacturers = this.data.manufacturers
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
      const promise = new Promise(resolve => {
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
            await this.$store.dispatch('product/save', this.controls)
            this.loading = false
            this.$validator.reset()
            if (this.dialog) {
              this.menuTabs(this.needTab)
            }
            this.dialog = false
            this.notSave = false
            this.$store.dispatch('getMessage', { text: 'Изменения успешно сохранены', color: 'green', timeout: 3600 })
          } catch (e) {}
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
}
.v-input {
  padding: 10px;
}
</style>
