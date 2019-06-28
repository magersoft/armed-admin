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
      <v-container v-if="filterShow">
        <v-form ref="filter">
          <v-layout>
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
                :label="`label`"></v-checkbox>
              <v-radio-group v-if="filter.type === 'radio'">
                <v-radio
                  v-for="n in 3"
                  :key="n"
                  color="primary"
                  :label="`Radio ${n}`"
                  :value="n"></v-radio>
              </v-radio-group>
            </v-flex>
          </v-layout>
            {{ model }}
          <div class="buttons">
            <v-btn color="primary" @click.prevent="filterHandler">
              Применить
            </v-btn>
            <v-btn>Сбросить</v-btn>
          </div>
        </v-form>
      </v-container>
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
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    filterShow: true,
    model: {}
  }),
  methods: {
    async filterHandler() {
      const formData = new FormData(this.$refs.filter.$el)
      try {
        await this.$store.dispatch('product/filterProduct', formData)
      } catch (e) {}
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
