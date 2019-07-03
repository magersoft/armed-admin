<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <app-filters :data="data" />
    <v-data-table
      v-model="selected"
      :headers="data.headers"
      :items="data.body"
      :rows-per-page-items="[10, 25, 50]"
      :total-items="data.total"
      :loading="loading"
      :pagination.sync="pagination"
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
            ></v-checkbox>
          </th>
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
            @click="changeSort(header.value)"
          >
            <v-icon small>arrow_upward</v-icon>
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
              hide-details
            ></v-checkbox>
          </td>
          <td v-for="(item, idx) in props.item" :key="idx">
            {{ item }}
          </td>
          <td class="layout px-0 text-xs-right">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon>
                  <v-icon
                          color="blue darken-2"
                          @click="deleteItem(props.item.id)"
                  >
                    visibility
                  </v-icon>
                </v-btn>
              </template>
              <span>Посмотреть</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon>
                  <v-icon
                          color="orange darken-2"
                          @click="editItem(props.item.id)"
                  >
                    edit
                  </v-icon>
                </v-btn>
              </template>
              <span>Редактировать</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon>
                  <v-icon
                          color="red darken-2"
                          @click="deleteItem(props.item.id)"
                  >
                    delete
                  </v-icon>
                </v-btn>
              </template>
              <span>Удалить</span>
            </v-tooltip>
            <app-action-button :item="props.item" />
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import AppActionButton from '@/components/CRUD/ActionButton'
import AppFilters from '@/components/CRUD/Filters'

export default {
  components: {
    AppActionButton, AppFilters
  },
  props: {
    data: {
      type: Object,
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
        console.log(page)
        console.log(rowsPerPage)
        console.log(descending)
        console.log(sortBy)
        try {
          const { body, total } = await this.$store.dispatch('product/getAll', params)
          this.data.body = body
          this.data.total = total
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
    editItem(id) {
      this.$router.push(`product/${id}`)
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
