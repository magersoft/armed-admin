<template>
  <div>
    <app-crud
      :data="data"
      :rows="['id', 'title', 'sku', 'category', 'prices', 'stock']"
      :actions="{view: true, update: true, delete: false}"
    />
  </div>
</template>

<script>
import AppCrud from '@/components/CRUD/CRUD'
export default {
  components: {
    AppCrud
  },
  middleware: ['auth'],
  async asyncData({ store }) {
    store.commit('crud/set', 'product')
    try {
      const data = await store.dispatch('crud/getAll')
      return { data }
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style scoped>

</style>
