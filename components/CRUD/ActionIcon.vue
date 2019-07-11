<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-tooltip v-if="actions.view" top>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon
            color="blue darken-2"
            @click="deleteItem(item.id)"
          >
            visibility
          </v-icon>
        </v-btn>
      </template>
      <span>Посмотреть</span>
    </v-tooltip>
    <v-tooltip v-if="actions.update" top>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon
            color="orange darken-2"
            @click="editItem(item.id)"
          >
            edit
          </v-icon>
        </v-btn>
      </template>
      <span>Редактировать</span>
    </v-tooltip>
    <v-tooltip v-if="actions.delete" top>
      <template v-slot:activator="{ on }">
        <v-progress-circular
          v-show="loading"
          indeterminate
          color="red"
          class="loading"
          width="3"
          size="24"
        ></v-progress-circular>
        <v-btn v-show="!loading" :disabled="loading" icon v-on="on">
          <v-icon
            color="red darken-2"
            @click="deleteItem(item.id)"
          >
            delete
          </v-icon>
        </v-btn>
      </template>
      <span>Удалить</span>
    </v-tooltip>

    <v-menu
      v-if="item.variations"
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
          <v-list-tile v-for="variation in item.variations" :key="variation.id">
            <v-list-tile-action>
              <v-switch v-model="model[variation.id]" color="purple"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>{{ variation.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
        {{ model }}

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat @click="menu = false">Cancel</v-btn>
          <v-btn color="primary" flat @click="menu = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <v-dialog v-model="dialog" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">Подтвердите действие</v-card-title>
        <v-card-text>Вы хотите удалить запись "<b>{{ item.title }}</b>".<br> Вы уверены?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat :disabled="loading" @click="dialog = false">Отмена</v-btn>
          <v-btn color="green darken-1" flat :loading="loading" :disabled="loading" @click="deleteItem(item.id)">Принять</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    actions: {
      type: Object,
      required: false
    }
  },
  data: () => ({
    loading: false,
    dialog: false,
    menu: false,
    model: {}
  }),
  mounted() {
    console.log(this.item.variations)
  },
  methods: {
    editItem(id) {
      this.$router.push(`product/${id}`)
    },
    async deleteItem(id) {
      if (!this.dialog) {
        this.dialog = true
      } else {
        this.loading = true
        try {
          await this.$store.dispatch('crud/delete', { items: [id] })
          this.$emit('deleted', [id])
          this.dialog = false
          this.$store.dispatch('getError', { text: 'Удалено', color: 'green', timeout: 3600 })
        } catch (e) {}
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  padding: 0 26px;
}
</style>
