<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x
  >
    <template #activator="{ on: menu }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn icon v-on="{ ...tooltip, ...menu }">
            <v-icon
              color="green"
            >
              more_vert
            </v-icon>
          </v-btn>
        </template>
        <span>Вариации товара</span>
      </v-tooltip>
    </template>

    <v-card>
      <v-list>
        <v-list-tile>

          <v-list-tile-content>
            <v-list-tile-title>Опубликованные вариации</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action></v-list-tile-action>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-tile v-for="variation in variations" :key="variation.id">
          <v-list-tile-action>
            <v-switch v-model="model[variation.id]" color="purple"></v-switch>
          </v-list-tile-action>
          <v-list-tile-title>{{ variation.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="cancel()">Отменить</v-btn>
        <v-btn color="primary" :disabled="loading || disable || disableSave" :loading="loading" flat @click="save()">{{ saveText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    variations: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    model: {},
    temp: {},
    menu: false,
    loading: false,
    disable: false,
    saveText: 'Сохранить'
  }),
  computed: {
    disableSave() {
      return _.isEqual(this.model, this.temp)
    }
  },
  created() {
    const variations = {}
    this.variations.forEach(variation => {
      variations[variation.id] = variation.status === 2
      this.temp[variation.id] = variation.status === 2
    })
    this.model = variations
  },
  methods: {
    async save() {
      this.loading = true
      this.disable = true
      try {
        this.temp = await this.$store.dispatch('product/changeStatusVariation', this.model)
        this.saveText = 'Сохранено'
        this.loading = false
        setTimeout(() => {
          this.saveText = 'Сохранить'
          this.disable = false
        }, 1000)
      } catch (e) { this.loading = false }
    },
    cancel() {
      this.menu = false
    }
  }
}
</script>
