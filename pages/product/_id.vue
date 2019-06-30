<template>
  <div>
    edit product
  </div>
</template>

<script>
export default {
  validate({ params }) {
    return Boolean(params.id)
  },
  middleware: ['auth'],
  async asyncData({ store, params }) {
    try {
      const post = await store.dispatch('product/getOne', params.id)
      return { post }
    } catch (e) {}
  }
}
</script>
