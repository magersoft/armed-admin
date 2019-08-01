<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-edit-dialog
    :return-value.sync="text"
    large
    lazy
    persistent
    @save="save"
    @cancel="cancel"
    @open="open"
    @close="close"
  >
    <div class="text">
      {{ text }}
    </div>
    <template v-slot:input>
      <div class="mt-3 title">
        Обновить
      </div>
    </template>
    <template v-slot:input>
      <v-textarea
        v-if="textarea"
        v-model="text"
        label="Редактировать"
        single-line
        counter
        autofocus
      />
      <v-text-field
        v-if="!textarea"
        v-model="text"
        label="Редактировать"
        single-line
        counter
        autofocus
      />
    </template>
    <v-snackbar v-model="snack" :timeout="3600" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">
        Закрыть
      </v-btn>
    </v-snackbar>
  </v-edit-dialog>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    textarea: {
      type: Boolean,
      required: false,
      default: false
    },
    action: {
      type: String,
      required: true
    }
  },
  data: () => ({
    snack: false,
    snackColor: '',
    snackText: '',
    loading: false
  }),
  methods: {
    async save() {
      this.loading = true
      try {
        await this.$store.dispatch(`product/${this.action}`, { id: this.id, text: this.text })
        this.snack = true
        this.snackColor = 'green'
        this.snackText = 'Сохранено'
      } catch (e) {}
      this.loading = false
    },
    cancel() {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Отменено'
    },
    open() {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Быстрое редактирование'
    },
    close() {
      console.log('Dialog closed')
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
