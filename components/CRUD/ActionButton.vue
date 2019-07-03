<template>
  <v-menu
    :key="item.id"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :color="colorsComputed"
        flat
        v-on="on"
      >
        {{ textComputed }}
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="/img/user.png" alt="John">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>John Leider</v-list-tile-title>
            <v-list-tile-sub-title>Founder of Vuetify.js</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn
              :class="fav ? 'red--text' : ''"
              icon
              @click="fav = !fav"
            >
              <v-icon>favorite</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

      <v-divider />

      <v-list>
        <v-list-tile>
          <v-list-tile-action>
            <v-switch v-model="hide" color="primary"></v-switch>
          </v-list-tile-action>
          <v-list-tile-title>{{ hide ? text['1'] : 'В архив' }}</v-list-tile-title>
        </v-list-tile>

        <v-list-tile>
          <v-list-tile-action>
            <v-switch v-model="status" color="primary"></v-switch>
          </v-list-tile-action>
          <v-list-tile-title>{{ status ? text['2'] : text['0'] }}</v-list-tile-title>
        </v-list-tile>
      </v-list>

      <v-card-actions>
        <v-spacer />

        <v-btn flat :disabled="loading" @click="cancel">
          Отмена
        </v-btn>
        <v-btn :loading="loading" :disabled="loading || saveText.value" color="primary" flat @click.prevent="save">
          {{ saveText.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    fav: true,
    menu: false,
    hide: false,
    status: true,
    loading: false,
    temp: {
      status: null,
      hide: null
    },
    colors: {
      '0': 'red',
      '1': 'primary',
      '2': 'green'
    },
    text: ['Не опубликовано', 'В архиве', 'Опубликовано'],
    saveText: {
      text: 'Сохранить',
      value: false
    }
  }),
  computed: {
    statusText() {
      return this.status ? this.text['2'] : this.text['0']
    },
    hideText() {
      return this.hide ? this.text['1'] : this.statusText
    },
    statusColor() {
      return this.status ? this.colors['2'] : this.colors['0']
    },
    hideColor() {
      return this.hide ? this.colors['1'] : this.statusColor
    },
    colorsComputed() {
      return this.hide ? this.hideColor : this.statusColor
    },
    textComputed() {
      return this.hide ? this.hideText : this.statusText
    }
  },
  watch: {
    statusText() {
      if (this.status) {
        this.hide = false
      }
    },
    hideText() {
      if (this.hide) {
        this.status = false
      }
    }
  },
  mounted() {
    this.status = +this.item.status === 2
    this.hide = +this.item.status === 1
    this.temp.status = +this.item.status === 2
    this.temp.hide = +this.item.status === 1
  },
  methods: {
    async save() {
      this.loading = true
      try {
        const formData = {
          id: this.item.id,
          status: this.hide ? 1
            : this.status ? 2 : 0
        }
        await this.$store.dispatch('product/changeStatus', formData)
      } catch (e) {
        this.loading = false
        throw e
      }
      this.loading = false
      this.saveText.value = true
      this.saveText.text = 'Сохранено'
      setTimeout(() => {
        this.saveText.text = 'Сохранить'
        this.saveText.value = false
      }, 1500)
      this.temp.status = this.status
      this.temp.hide = this.hide
    },
    cancel() {
      this.status = this.temp.status
      this.hide = this.temp.hide
      this.menu = false
    }
  }
}
</script>
