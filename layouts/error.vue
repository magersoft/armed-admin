<template>
  <div class="error-page">
    <div class="wrapper">
      <h1 v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </h1>
      <h1 v-else>
        {{ otherError }}
      </h1>
      <NuxtLink to="/">
        Home page
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 20px;
}
.wrapper {
  background-color: rgba(0,0,0,.1);
  border-radius: 10px;
  padding: 4rem;
  max-width: 800px;
  margin: 0 auto;
}
</style>
