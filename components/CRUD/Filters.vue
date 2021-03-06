<template>
  <v-card v-if="data.filters" class="mb2">
    <v-card-title class="filters-title">
      <h5>Фильтры</h5>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn icon small v-on="on" @click.prevent="filterShow = !filterShow">
            <v-icon :class="{ active: !filterShow }">
              unfold_more
            </v-icon>
          </v-btn>
        </template>
        <span>{{ filterShow ? 'Скрыть' : 'Показать' }} фильтры</span>
      </v-tooltip>
    </v-card-title>
    <v-divider />
    <v-slide-y-transition>
      <v-container v-show="filterShow">
        <v-form ref="filter">
          <v-layout wrap>
            <v-flex v-for="(filter, idx) in data.filters" :key="idx" xs3 md2>
              <v-text-field
                v-if="filter.type === 'text'"
                v-model="model[idx]"
                :name="filter.model"
                :label="filter.label"
              />
              <v-select
                v-if="filter.type === 'select'"
                v-model="model[idx]"
                :items="filter.items"
                :label="filter.label"
              />
              <v-checkbox
                v-if="filter.type === 'checkbox'"
                v-model="model[idx]"
                :name="filter.model"
                color="primary"
                :label="filter.label"
              />
              <v-radio-group v-if="filter.type === 'radio'">
                <v-radio
                  v-for="(item, idx) in filter.items"
                  :key="idx"
                  color="primary"
                  :label="item.label"
                  :value="item.value"
                />
              </v-radio-group>
            </v-flex>
          </v-layout>
          <div class="buttons">
            <v-btn
              type="submit"
              color="primary"
              :loading="loading"
              :disabled="loading || filterTouch"
              @click.prevent="filterHandler"
            >
              Применить
            </v-btn>
            <v-btn @click.prevent="filterClear">
              Сбросить
            </v-btn>
          </div>
        </v-form>
      </v-container>
    </v-slide-y-transition>
  </v-card>
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
    loading: false,
    filterShow: true,
    model: {}
  }),
  computed: {
    filterTouch() {
      return !Object.keys(this.model).length
    }
  },
  methods: {
    async filterHandler() {
      this.loading = true
      const formData = new FormData(this.$refs.filter.$el)
      this.data.filters.forEach((v, k) => {
        if (v.type !== 'select') {
          return
        }
        if (this.model[k]) {
          formData.append(v.model, this.model[k])
        }
      })
      try {
        const { body, total } = await this.$store.dispatch('crud/filter', formData)
        this.data.body = body
        this.data.total = total
      } catch (e) {}
      this.loading = false
    },
    filterClear() {
      this.model = {}
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
    button {
      margin: 0 10px
    }
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
