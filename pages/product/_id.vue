<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-card>
      <div class="flex fix-extension-toolbar">
        <v-navigation-drawer
          permanent
          class="hidden-md-and-down"
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
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card flat>
                  <v-text-field
                    v-model="controls.title"
                    v-validate="'required'"
                    :error-messages="errors.collect('title')"
                    data-vv-name="title"
                    label="Название"
                    required
                  />
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-text-field
                    v-model="controls.test"
                    v-validate="'required'"
                    :error-messages="errors.collect('test')"
                    data-vv-name="test"
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
                  <v-card-text>6</v-card-text>
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
          </v-container>
        </v-layout>
      </div>
    </v-card>
    <v-dialog v-model="fieldsDirty" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">
          Подтвердите действие
        </v-card-title>
        <v-card-text>Были изменены поля ... Вы хотите сохранить изменения?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" flat :disabled="loading" @click="fieldsDirty = false">
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
export default {
  validate({ params }) {
    return Boolean(params.id)
  },
  middleware: ['auth'],
  $_veeValidate: {
    validator: 'new'
  },
  data: () => ({
    tab: null,
    needTab: null,
    loading: false,
    fieldsDirty: false,
    controls: {
      title: '',
      test: ''
    },
    menu: [
      { title: 'Основное', icon: 'dashboard' },
      { title: 'Аналоги', icon: 'dashboard' },
      { title: 'Преимущества', icon: 'dashboard' },
      { title: 'Сопутка', icon: 'dashboard' },
      { title: 'Характеристики', icon: 'dashboard' },
      { title: 'Фотографии', icon: 'dashboard' },
      { title: 'Видео', icon: 'dashboard' },
      { title: 'SEO', icon: 'dashboard' },
      { title: 'Отзывы', icon: 'dashboard' }
    ]
  }),
  computed: {
    isDirty() {
      return Object.keys(this.fields).some(key => this.fields[key].dirty)
    },
    isValid() {
      return Object.keys(this.fields).some(key => this.fields[key].valid)
    }
  },
  async asyncData({ store, params }) {
    store.commit('crud/set', 'product')
    try {
      const data = await store.dispatch('crud/getOne', params.id)
      return { data }
    } catch (e) {}
  },
  mounted() {
    this.controls.title = this.data.title
  },
  methods: {
    menuTabs(idx) {
      this.$validator.validateAll().then(valid => {
        if (!valid && this.isDirty) {
          const msg = this.$validator.errors.items.map(item => item.msg)
          this.$store.dispatch('getError', { text: msg.join('\n'), timeout: 3600 })
          return false
        }
        if (this.isDirty && this.isValid) {
          this.fieldsDirty = true
          this.needTab = idx
          return false
        }
        this.tab = idx
      })
    },
    save() {
      this.loading = true
      setTimeout(() => {
        this.$validator.validateAll().then(valid => {
          if (!valid) {
            const msg = this.$validator.errors.items.map(item => item.msg)
            this.$store.dispatch('getError', { text: msg.join('\n'), timeout: 7200 })
            this.loading = false
            return false
          }
          this.loading = false
          this.$validator.reset()
          if (this.fieldsDirty) {
            this.menuTabs(this.needTab)
          }
          this.fieldsDirty = false
        })
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
</style>
