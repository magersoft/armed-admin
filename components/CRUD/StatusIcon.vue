<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon :color="statusColor" v-on="on">
        home
      </v-icon>
    </template>
    <span>{{ statusText }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    status: {
      type: Number,
      required: true
    },
    statuses: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    changeStatus: null
  }),
  computed: {
    statusText() {
      return this.statuses.labels[this.changeStatus ? this.changeStatus : this.status]
    },
    statusColor() {
      return this.statuses.colors[this.changeStatus ? this.changeStatus : this.status]
    }
  },
  mounted() {
    this.$root.$on(`crud:selectedItem-${this.id}`, value => {
      this.changeStatus = value
      console.log(`id: ${this.id}`, this.changeStatus)
    })
  },
  methods: {}
}
</script>
