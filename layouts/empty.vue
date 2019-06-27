<template>
  <v-app dark fixed app>
    <v-content>
      <div class="bg">
        <v-container>
          <nuxt />
        </v-container>
      </div>
    </v-content>
    <v-snackbar
      v-if="error"
      v-model="snackbar.state"
      :color="snackbar.color"
      top="top"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <v-btn
        dark
        flat
        @click="closeSnackbar"
      >
        Закрыть
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    snackbar: {
      state: false,
      color: 'red',
      text: '',
      timeout: 3600
    }
  }),
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error({ color, text, timeout, state }) {
      this.snackbar.state = state
      this.snackbar.color = color
      this.snackbar.text = text
      this.snackbar.timeout = timeout
    }
  },
  methods: {
    closeSnackbar() {
      this.snackbar.state = false
      this.$store.dispatch('clearError')
    }
  }
}
</script>

<style lang="scss" scoped>
.bg {
  display: flex;
  height: 100vh;
  background-image: url('/img/bg.jpg');
  background-size: cover;
}
</style>
