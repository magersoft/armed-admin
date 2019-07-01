<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-card class="mb2" v-if="data.filters">
      <v-card-title class="filters-title">
        <h3>Фильтры</h3>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" @click.prevent="filterShow = !filterShow"><v-icon :class="{ active: !filterShow }">unfold_more</v-icon></v-btn>
          </template>
          <span>{{ filterShow ? 'Скрыть' : 'Показать' }} фильтры</span>
        </v-tooltip>
      </v-card-title>
      <v-divider></v-divider>
      <v-slide-y-transition>
        <v-container v-show="filterShow">
        <v-form ref="filter">
          <v-layout row wrap>
            <v-flex v-for="(filter, idx) in data.filters" :key="idx" xs12 md2>
              <v-text-field
                v-if="filter.type === 'text'"
                v-model="model[idx]"
                :name="filter.model"
                :label="filter.label"></v-text-field>
              <v-select
                v-if="filter.type === 'select'"
                v-model="model[idx]"
                :items="filter.items"
                :name="filter.model"
                :label="filter.label"></v-select>
              <v-checkbox
                v-if="filter.type === 'checkbox'"
                v-model="model[idx]"
                :name="filter.model"
                color="primary"
                :label="filter.label"></v-checkbox>
              <v-radio-group v-if="filter.type === 'radio'">
                <v-radio
                  v-for="(item, idx) in filter.items"
                  :key="idx"
                  color="primary"
                  :label="item.label"
                  :value="item.value"></v-radio>
              </v-radio-group>
            </v-flex>
          </v-layout>
          <div class="buttons">
            <v-btn
              type="submit"
              color="primary"
              :loading="loading"
              :disabled="loading"
              @click.prevent="filterHandler">
              Применить
            </v-btn>
            <v-btn @click.prevent="filterClear">Сбросить</v-btn>
          </div>
        </v-form>
      </v-container>
      </v-slide-y-transition>
    </v-card>
    <v-data-table
      :headers="data.headers"
      :items="data.body"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td v-for="item in props.item" :key="item.id">
          {{ item }}
        </td>
        <td class="layout px-0">
          <v-btn icon>
            <v-icon
                    color="blue darken-2"
                    @click="deleteItem(props.item.id)"
            >
              visibility
            </v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon
              color="orange darken-2"
              @click="editItem(props.item.id)"
            >
              edit
            </v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon
              color="red darken-2"
              @click="deleteItem(props.item.id)"
            >
              delete
            </v-icon>
          </v-btn>
          <app-action-button :item="props.item" />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import AppActionButton from '@/components/ActionButton'

export default {
  components: {
    AppActionButton
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    filterShow: true,
    model: {},
    loading: false,
    colors: {
      '0': 'red',
      '1': 'primary',
      '2': 'green'
    },
    status: ''
  }),
  methods: {
    async filterHandler() {
      this.loading = true
      const formData = new FormData(this.$refs.filter.$el)
      try {
        this.data = await this.$store.dispatch('product/filterProduct', formData)
      } catch (e) {}
      this.loading = false
    },
    filterClear() {
      this.model = {}
    },
    editItem(id) {
      this.$router.push(`product/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.v-input {
    padding: 10px;
}
.buttons {
    display: flex;
    justify-content: flex-end;
}
.filters-title {
    display: flex;
    justify-content: space-between;
    button {
        margin: 0;
        i {
            &.active {
              color: #1976d2;
            }
        }
    }
    .v-tooltip--top {
        display: none;
    }
}
</style>
