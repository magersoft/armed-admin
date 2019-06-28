<template>
  <div>
    <app-crud :data="products" />
  </div>
</template>

<script>
import AppCrud from '@/components/CRUD'
export default {
  components: {
    AppCrud
  },
  async asyncData({ store }) {
    try {
      const products = await store.dispatch('product/getAll')
      return { products }
    } catch (e) {}
  }
}
</script>

<style scoped>

</style>
