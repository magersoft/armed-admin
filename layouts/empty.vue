<template>
  <v-app app>
    <v-content>
      <div class="bg">
        <v-container>
          <nuxt />
        </v-container>
      </div>
    </v-content>
    <v-snackbar
      v-if="message"
      v-model="snackbar.state"
      :color="snackbar.color"
      top="top"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <v-btn
        dark
        text
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
    message() {
      return this.$store.getters.message
    }
  },
  watch: {
    message({ color, text, timeout, state }) {
      this.snackbar.state = state
      this.snackbar.color = color
      this.snackbar.text = text
      this.snackbar.timeout = timeout
    }
  },
  created() {
    this.$vuetify.theme.dark = true
  },
  methods: {
    closeSnackbar() {
      this.snackbar.state = false
      this.$store.dispatch('clearMessage')
    }
  }
}
</script>

<style lang="scss" scoped>
.bg {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-image: url('/img/bg.jpg');
  background-size: cover;
}
</style>
