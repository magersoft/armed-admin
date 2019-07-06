<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <app-filters v-if="data.filters.length" :data="data" />
    <v-card>
      <v-card-title>
        <h3>{{ data.name }}</h3>
        <v-spacer />
        <app-status-button v-if="actions.update" :statuses="statuses" :items="selected"/>
        <app-delete-button v-if="actions.delete" :items="selected" @deleted="deleted" />
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
          <tr :active="props.selected" @click="props.selected = !props.selected">
            <td class="status">
              <v-checkbox
                :input-value="props.selected"
                color="primary"
                hide-details></v-checkbox>
              <app-status-icon :id="props.item.id" :statuses="statuses" :status="props.item.status" @deleted="deleted" />
            </td>
            <td v-for="row in rows" :key="row">
              <app-inline-editor v-if="row === 'title:editable'" :item="props.item" />
              <div v-else-if="row === 'prices'">{{ props.item[row.split(':')[0]] | currency }}</div>
              <div v-else>{{ props.item[row.split(':')[0]] }}</div>
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
    pagination: {},
    filterShow: true,
    model: {},
    loading: false
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
</style>
