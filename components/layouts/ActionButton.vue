<template>
  <v-speed-dial
    v-model="fab"
    :top="top"
    :bottom="bottom"
    :right="right"
    :left="left"
    :direction="direction"
    :open-on-hover="false"
    :transition="transition"
  >
    <template v-slot:activator>
      <v-btn
        v-model="fab"
        color="blue darken-2"
        dark
        fab
      >
        <v-icon>add</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
    </template>
    <v-btn
      fab
      dark
      small
      color="green"
    >
      <v-icon>edit</v-icon>
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="indigo"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="red"
    >
      <v-icon>delete</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'ActionButton',
  data: () => ({
    fab: false,
    tabs: null,
    top: false,
    bottom: true,
    right: true,
    left: false,
    direction: 'top',
    transition: 'slide-y-reverse-transition'
  }),
  computed: {
    activeFab() {
      switch (this.tabs) {
        case 'one': return { 'class': 'purple', icon: 'account_circle' }
        case 'two': return { 'class': 'red', icon: 'edit' }
        case 'three': return { 'class': 'green', icon: 'keyboard_arrow_up' }
        default: return {}
      }
    }
  },
  watch: {
    top(val) {
      this.bottom = !val
    },
    right(val) {
      this.left = !val
    },
    bottom(val) {
      this.top = !val
    },
    left(val) {
      this.right = !val
    }
  }
}
</script>

<style lang="scss" scoped>
.v-speed-dial {
    position: fixed;
    z-index: 7;
    bottom: 5px;
    right: 5px;
}
</style>
