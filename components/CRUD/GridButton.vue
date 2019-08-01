<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn icon small @click="gridChange" v-on="on">
        <v-icon>{{ gridIcon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ gridText }}</span>
  </v-tooltip>
</template>

<script>
export default {
  data: () => ({
    grid: false
  }),
  computed: {
    gridIcon() {
      return this.grid ? 'grid_on' : 'grid_off'
    },
    gridText() {
      return this.grid ? 'Показать сеткой' : 'Показать таблицей'
    }
  },
  methods: {
    gridChange() {
      this.grid = !this.grid
      this.$emit('grid', this.grid)
    }
  }
}
</script>
