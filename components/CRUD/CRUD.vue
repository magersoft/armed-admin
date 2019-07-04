<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <app-filters :data="data" />
    <v-card>
      <v-card-title>
        <h3>Товары</h3>
        <v-spacer />
        <v-btn small flat>
          Кнопка
        </v-btn>
      </v-card-title>
      <v-data-table
        v-model="selected"
        :headers="data.headers"
        :items="data.body"
        :rows-per-page-items="[10, 25, 50]"
        :total-items="data.total"
        :loading="loading"
        :pagination.sync="pagination"
        rows-per-page-text="Показать"
        select-all
        item-key="id"
        class="elevation-1"
      >
        <template v-if="!loading" v-slot:no-data>
          <v-alert :value="true" color="error" icon="warning">
            Ничего не найдено :(
          </v-alert>
        </template>
        <template v-slot:headers="props">
          <tr>
            <th>
              <v-checkbox
                :input-value="props.all"
                :indeterminate="props.indeterminate"
                primary
                hide-details
                @click.stop="toggleAll"></v-checkbox>
            </th>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)"
            >
              <v-icon small>
                arrow_upward
              </v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template v-slot:items="props">
          <tr>
            <td>
              <v-checkbox
                :input-value="props.selected"
                color="primary"
                hide-details></v-checkbox>
            </td>
            <td v-for="row in rows" :key="row">
              <app-inline-editor v-if="row === 'title'" :item="props.item.title" />
              <div v-else>{{ props.item[row] }}</div>
            </td>
            <td class="layout px-0 text-xs-right">
              <app-action-icon :item="props.item" />
              <app-action-button :item="props.item" />
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import AppActionButton from '@/components/CRUD/ActionButton'
import AppActionIcon from '@/components/CRUD/ActionIcon'
import AppFilters from '@/components/CRUD/Filters'
import AppInlineEditor from '@/components/CRUD/InlineEditor'

export default {
  components: {
    AppActionButton, AppActionIcon, AppFilters, AppInlineEditor
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    rows: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    selected: [],
    pagination: {},
    filterShow: true,
    model: {},
    loading: false
  }),
  watch: {
    pagination: {
      async handler() {
        this.loading = true
        const { sortBy, descending, page, rowsPerPage } = this.pagination
        const params = {
          page,
          rowsPerPage
        }
        try {
          const { body, total } = await this.$store.dispatch('product/getAll', params)
          this.data.body = body
          this.data.total = total

          if (this.pagination.sortBy) {
            this.data.body = this.data.body.sort((a, b) => {
              const sortA = a[sortBy]
              const sortB = b[sortBy]

              if (descending) {
                if (sortA < sortB) return 1
                if (sortA > sortB) return -1
                return 0
              } else {
                if (sortA < sortB) return -1
                if (sortA > sortB) return 1
                return 0
              }
            })
          }
        } catch (e) {}
        this.loading = false
      },
      deep: true
    }
  },
  methods: {
    async filterHandler() {
      this.loading = true
      const formData = new FormData(this.$refs.filter.$el)
      try {
        this.data = await this.$store.dispatch('product/filterProduct', formData)
      } catch (e) {}
      this.loading = false
    },
    toggleAll() {
      if (this.selected.length) {
        this.selected = []
      } else {
        this.selected = this.data.body.slice()
      }
    },
    filterClear() {
      this.model = {}
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
table.v-table {
  .column {
    padding: 0 10px;
    text-align: left;
  }
}
</style>
