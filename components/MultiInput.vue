<template>
  <div v-if="false">
    <v-layout column justify-start align-end>
      <v-flex v-for="i in max" :key="i">
        <v-layout row justify-center>
          <v-icon>reorder</v-icon>
          <v-text-field v-model="model"></v-text-field>
          <v-btn icon small>
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
      <v-btn icon small>
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    max: {
      type: Number,
      required: false,
      default: 5
    },
    model: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    model: {}
  })
}
</script>
