<template>
  <div class="text-xs-center mx-1">
    <v-btn color="error" :loading="loading" :disabled="!items.length || loading" @click.prevent="deleteItems">
      Удалить
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">
          Подтвердите действие
        </v-card-title>
        <v-card-text>Вы хотите удалить <b>{{ items.length | decimals(['запись', 'записи', 'записей']) }}</b>.<br> Вы уверены?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" text :disabled="loading" @click="dialog = false">
            Отмена
          </v-btn>
          <v-btn color="green darken-1" text :loading="loading" :disabled="loading" @click="deleteItems">
            Принять
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    loading: false,
    dialog: false
  }),
  methods: {
    async deleteItems() {
      if (!this.dialog) {
        this.dialog = true
      } else {
        this.loading = true
        try {
          const ids = this.items.map(i => i.id)
          await this.$store.dispatch('crud/delete', { items: ids })
          this.$emit('deleted', ids)
        } catch (e) {}
        this.loading = false
      }
    }
  }
}
</script>
