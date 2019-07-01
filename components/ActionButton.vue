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
        :color="statusColor"
        flat
        v-on="on"
      >
        {{ statusText }}
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
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
          <v-list-tile-title>{{ hide ? 'Скрыто' : 'Скрыть' }}</v-list-tile-title>
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

        <v-btn flat @click="menu = false">
          Отмена
        </v-btn>
        <v-btn color="primary" flat @click="menu = false">
          Сохранить
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
    colors: {
      '0': 'red',
      '1': 'primary',
      '2': 'green'
    },
    text: ['Не опубликовано', 'Скрыто', 'Опубликовано']
  }),
  computed: {
    statusText() {
      if (+this.item.status === 1) {
        return this.text['1']
      }
      return this.status ? this.text['2'] : this.text['0']
    },
    statusColor() {
      if (+this.item.status === 1) {
        return this.colors['1']
      }
      return this.status ? this.colors['2'] : this.colors['0']
    }
  },
  watch: {
    statusText() {
      this.hide = !this.status
    }
  },
  mounted() {
    this.status = +this.item.status === 2
    this.hide = +this.item.status === 1
  }
}
</script>
