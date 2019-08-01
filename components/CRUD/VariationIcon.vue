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
        <v-progress-linear v-if="loading" :indeterminate="true" />
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Вариации товара</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action />
        </v-list-item>
      </v-list>

      <v-divider />
      <small class="ma-4">Чтобы редактировать вариацию нажмите на нее</small>
      <v-list>
        <v-list-item v-for="variation in variations" :key="variation.id">
          <v-list-item-action>
            <v-switch v-model="model[variation.id]" color="purple" />
          </v-list-item-action>
          <v-list-item-title class="edit-variation" @click="goVariation({ productId: variation.product_id, variationId: variation.id })">
            {{ variation.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cancel()">
          Отменить
        </v-btn>
        <v-btn color="primary" :disabled="loading || disable || disableSave" :loading="loading" text @click="save()">
          {{ saveText }}
        </v-btn>
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
    },
    goVariation(ids) {
      this.$emit('go', ids)
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-variation {
  cursor: pointer;
}
.v-progress-linear {
  margin: 0;
  margin-top: -8px;
  height: 4px!important;
  position: absolute;
}
</style>
