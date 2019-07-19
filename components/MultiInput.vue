<template>
  <v-layout column>
    <label class="v-label v-label--active theme--light">{{ label }}</label>
    <draggable
      :list="value"
      class="layout column"
      @start="dragging = true"
      @end="dragging = false"
    >
      <v-flex v-for="(i, idx) in value" :key="idx">
        <v-layout row justify-center align-center>
          <v-btn icon>
            <v-icon class="move">
              reorder
            </v-icon>
          </v-btn>
          <v-text-field v-model="value[idx]" placeholder="Введите ..." />
          <v-btn icon @click="remove(idx)">
            <v-icon color="red darken-2">
              close
            </v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
      <v-layout row justify-space-between align-center>
        <div class="validate-input">
          <span v-if="disabled">Максимум {{ max }}</span>
        </div>
        <v-btn icon :disabled="disabled" @click="add">
          <v-icon>add</v-icon>
        </v-btn>
      </v-layout>
    </draggable>
  </v-layout>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    max: {
      type: Number,
      required: false,
      default: 5
    },
    value: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  data: () => ({
    dragging: false
  }),
  computed: {
    disabled() {
      return !(this.value.length < this.max)
    }
  },
  methods: {
    add() {
      if (this.value.length < this.max) {
        this.value.push('')
      }
    },
    remove(idx) {
      this.value.splice(idx, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .move {
    cursor: move
  }
  .validate-input {
    margin: 0 20px;
    font-size: 12px;
    color: darkred;
  }
</style>
