<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <app-filters v-if="data.filters.length" :data="data" />
    <v-card>
      <v-card-title>
        <h5>{{ data.name }}</h5>
        <v-spacer />
        <app-status-button v-if="actions.update" :statuses="statuses" :items="selected" />
        <app-delete-button v-if="actions.delete" :items="selected" @deleted="deleted" />
      </v-card-title>
      <no-ssr>
        <v-data-table
          v-model="selected"
          :headers="data.headers"
          :items="data.body"
          :items-per-page-options="[10, 25, 50]"
          :server-items-length="data.total"
          :loading="loading"
          :options.sync="options"
          show-select
          item-key="id"
          class="elevation-1"
        >
          <template v-if="!loading" v-slot:no-data>
            <v-alert :value="true" color="error" icon="warning">
              Ничего не найдено :(
            </v-alert>
          </template>
          <template v-slot:header="props">
            <tr>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable', options.descending ? 'desc' : 'asc', header.value === options.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
              >
                <v-icon small>
                  arrow_upward
                </v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template v-slot:item="props">
            <tr>
              <td>
                <v-checkbox
                  :input-value="props.selected"
                  color="purple"
                  @change="props.selected = !props.selected"
                ></v-checkbox>
              </td>
              <td class="status">
                <app-status-icon :id="props.item.id" :statuses="statuses" :status="props.item.status" />
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
                      <v-list-item v-for="(stock, key) in props.item[row].data" :key="key" class="stock-menu">
                        <v-list-item-title class="stock-item">
                          <div class="stock-title">
                            {{ stock.title }}
                          </div>
                          <div>{{ stock.count }} шт.</div>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <div v-else-if="row === 'sku'">
                  <div v-if="Array.isArray(props.item[row])">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <div v-on="on">
                          {{ props.item[row][0] }} <v-icon small>
                            help
                          </v-icon>
                        </div>
                      </template>
                      <span>{{ props.item[row].join(', ') }}</span>
                    </v-tooltip>
                  </div>
                  <div v-else>
                    {{ props.item[row] }}
                  </div>
                </div>
                <div v-else v-html="props.item[row.split(':')[0]]"></div>
              </td>
              <td class="layout px-0 text-xs-right">
                <app-action-icon :item="props.item" :actions="actions" @deleted="deleted" />
              </td>
            </tr>
          </template>
        </v-data-table>
      </no-ssr>
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

export default {
  components: {
    AppStatusButton, AppActionIcon, AppFilters, AppInlineEditor, AppStatusIcon, AppDeleteButton
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
    options: {},
    loading: false
  }),
  computed: {
    statuses() {
      return Object.assign({}, this.data.statuses)
    }
  },
  watch: {
    options: {
      async handler() {
        this.loading = true
        const { sortBy, descending, page, itemsPerPage } = this.options
        const params = {
          page,
          itemsPerPage
        }
        try {
          const { body, total } = await this.$store.dispatch('crud/getAll', params)
          this.data.body = body
          this.data.total = total

          if (this.options.sortBy) {
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
      if (this.options.sortBy === column) {
        this.options.descending = !this.options.descending
      } else {
        this.options.sortBy = column
        this.options.descending = false
      }
    },
    gridChange(state) {
      this.grid = state
    },
    async deleted(ids) {
      this.loading = true
      const { page, itemsPerPage } = this.options
      const params = {
        page,
        itemsPerPage
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
