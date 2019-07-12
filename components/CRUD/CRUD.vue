<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <app-filters v-if="data.filters.length" :data="data" />
    <v-card>
      <v-card-title>
        <h3>{{ data.name }}</h3>
        <v-spacer />
        <app-status-button v-if="actions.update" :statuses="statuses" :items="selected" />
        <app-delete-button v-if="actions.delete" :items="selected" @deleted="deleted" />
        <app-grid-button @grid="gridChange" />
      </v-card-title>
      <v-data-table
        v-if="!grid"
        v-model="selected"
        :headers="data.headers"
        :items="data.body"
        :rows-per-page-items="[10, 25, 50]"
        :total-items="data.total"
        :loading="loading"
        :pagination.sync="pagination"
        rows-per-page-text="Записей на странице:"
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
                @click.stop="toggleAll"
              />
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
          <tr :active="props.selected">
            <td class="status">
              <v-checkbox
                :input-value="props.selected"
                color="primary"
                hide-details
                @change="props.selected = !props.selected"
              />
              <app-status-icon :id="props.item.id" :statuses="statuses" :status="props.item.status" @deleted="deleted" />
            </td>
            <td v-for="row in rows" :key="row">
              <app-inline-editor v-if="row === 'title:editable'" :item="props.item" />
              <div v-else-if="row === 'prices'">
                {{ props.item[row.split(':')[0]] | currency }}
              </div>
              <div v-else-if="row === 'created_at' || row === 'updated_at' || row === 'date'">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <div v-on="on">
                      {{ props.item[row] | date('date') }}
                    </div>
                  </template>
                  <span>{{ props.item[row] | date('time') }}</span>
                </v-tooltip>
              </div>
              <div v-else-if="row === 'stock'" class="stock">
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <span :class="{ 'stock-value': props.item[row].value > 0 }" v-on="on">
                      {{ typeof props.item[row].value !== 'object' ? props.item[row].value : Object.values(props.item[row].value).reduce((a, b) => a + b) }} шт.
                    </span>
                  </template>
                  <v-list v-if="props.item[row].value > 0" class="stock-list">
                    <v-list-tile v-for="(stock, key) in props.item[row].data" :key="key" class="stock-menu">
                      <v-list-tile-title class="stock-item">
                        <div class="stock-title">
                          {{ stock.title }}
                        </div>
                        <div>{{ stock.count }} шт.</div>
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </div>
              <div v-else-if="row === 'sku'">
                <div v-if="Array.isArray(props.item[row])">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">{{ props.item[row][0] }} <v-icon small>help</v-icon></div>
                    </template>
                    <span>{{ props.item[row].join(', ') }}</span>
                  </v-tooltip>
                </div>
                <div v-else>{{ props.item[row] }}</div>
              </div>
              <div v-else v-html="props.item[row.split(':')[0]]"></div>
            </td>
            <td class="layout px-0 text-xs-right">
              <app-action-icon :item="props.item" :actions="actions" @deleted="deleted" />
            </td>
          </tr>
        </template>
        <template v-slot:pageText="props">
          {{ props.pageStart }} - {{ props.pageStop }} из {{ props.itemsLength }}
        </template>
      </v-data-table>
      <div v-else>
        <v-container
          fluid
          grid-list-md
        >
          <v-layout row wrap>
            <v-flex
              v-for="item in data.body"
              :key="item.id"
              xs3
            >
              <app-card :item="item" :actions="actions" />
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-card>
  </div>
</template>

<script>
import AppStatusButton from '@/components/CRUD/StatusButton'
import AppDeleteButton from '@/components/CRUD/DeleteButton'
import AppActionIcon from '@/components/CRUD/ActionIcon'
import AppStatusIcon from '@/components/CRUD/StatusIcon'
import AppFilters from '@/components/CRUD/Filters'
import AppInlineEditor from '@/components/CRUD/InlineEditor'
import AppGridButton from '@/components/CRUD/GridButton'
import AppCard from '@/components/CRUD/Card'

export default {
  components: {
    AppStatusButton, AppActionIcon, AppFilters, AppInlineEditor, AppStatusIcon, AppDeleteButton, AppGridButton, AppCard
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    rows: {
      type: Array,
      required: true
    },
    actions: {
      type: Object,
      required: false,
      default: () => ({ view: true, update: true, delete: true })
    }
  },
  data: () => ({
    selected: [],
    pagination: {},
    loading: false,
    grid: false
  }),
  computed: {
    statuses() {
      return Object.assign({}, this.data.statuses)
    }
  },
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
          const { body, total } = await this.$store.dispatch('crud/getAll', params)
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
    toggleAll() {
      if (this.selected.length) {
        this.selected = []
      } else {
        this.selected = this.data.body.slice()
      }
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    gridChange(state) {
      this.grid = state
    },
    async deleted(ids) {
      this.loading = true
      const { page, rowsPerPage } = this.pagination
      const params = {
        page,
        rowsPerPage
      }
      try {
        this.data.body = this.data.body.filter(item => !ids.includes(item.id))
        const { body, total } = await this.$store.dispatch('crud/getAll', params)
        this.data.body = body
        this.data.total = total
      } catch (e) {}
      this.loading = false
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
.status {
  display: flex;
  justify-content: center;
  align-items: center;
}
.stock {
  &-value {
    cursor: pointer;
    border-bottom: 1px dotted;
    color: #1976d2;
    text-decoration: none;
  }
  &-item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
  &-title {
    margin-right: 30px;
  }
  &-list {
    padding: 0;
  }
}
</style>
