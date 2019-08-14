<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="action-icons">
    <v-tooltip v-if="actions.view" top>
      <template v-slot:activator="{ on }">
        <v-btn small icon v-on="on">
          <v-icon
            color="blue darken-2"
            @click="editItem(item.id)"
          >
            visibility
          </v-icon>
        </v-btn>
      </template>
      <span>Посмотреть</span>
    </v-tooltip>
    <v-tooltip v-if="actions.update" top>
      <template v-slot:activator="{ on }">
        <v-btn small icon v-on="on">
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
        />
        <v-btn small v-show="!loading" :disabled="loading" icon v-on="on">
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
    <app-variation-editor v-if="item.variations" crud :variations="item.variations" />
    <v-dialog v-model="dialog" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">
          Подтвердите действие
        </v-card-title>
        <v-card-text>Вы хотите удалить запись "<b>{{ item.title }}</b>".<br> Вы уверены?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" text :disabled="loading" @click="dialog = false">
            Отмена
          </v-btn>
          <v-btn color="green darken-1" text :loading="loading" :disabled="loading" @click="deleteItem(item.id)">
            Принять
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AppVariationEditor from '@/components/VariationEditor'

export default {
  components: {
    AppVariationEditor
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    actions: {
      type: Object,
      required: false
    },
    page: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: () => ({
    loading: false,
    dialog: false
  }),
  methods: {
    editItem(id) {
      this.$store.dispatch('crud/savePage', this.page)
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
          this.$store.dispatch('getMessage', { text: 'Удалено', color: 'green', timeout: 3600 })
        } catch (e) {}
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.action-icons {
  display: flex;
  justify-content:center;
  align-items: center;
}
.loading {
  margin: 0 7px
}
</style>
