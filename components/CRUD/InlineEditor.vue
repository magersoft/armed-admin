<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-edit-dialog
    :return-value.sync="item"
    large
    lazy
    persistent
    @save="save"
    @cancel="cancel"
    @open="open"
    @close="close"
  >
    <div>{{ item }}</div>
    <template v-slot:input>
      <div class="mt-3 title">
        Обновить название
      </div>
    </template>
    <template v-slot:input>
      <v-text-field
        v-model="item"
        label="Редактировать"
        single-line
        counter
        autofocus></v-text-field>
    </template>
    <v-snackbar v-model="snack" :timeout="3600" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">
        Закрыть
      </v-btn>
    </v-snackbar>
  </v-edit-dialog>
</template>

<script>
export default {
  props: {
    item: {
      type: String,
      required: true
    }
  },
  data: () => ({
    snack: false,
    snackColor: '',
    snackText: ''
  }),
  methods: {
    save() {
      this.snack = true
      this.snackColor = 'green'
      this.snackText = 'Сохранено'
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
