<template>
  <div class="text-xs-center">
    <v-btn color="error" :loading="loading" :disabled="!items.length || loading" @click.prevent="deleteItems">
      Удалить
    </v-btn>
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
    loading: false
  }),
  methods: {
    async deleteItems() {
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
</script>
