<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon :color="statusColor" v-on="on">
        {{ statusIcon }}
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
      type: Object,
      required: true
    },
    statuses: {
      type: Object,
      required: true
    }
  },
  computed: {
    statusText() {
      return this.statuses.labels[this.status.value]
    },
    statusColor() {
      return this.statuses.colors[this.status.value]
    },
    statusIcon() {
      if (this.statusColor === 'green') {
        return 'check_circle'
      } else if (this.statusColor === 'red') {
        return 'cancel'
      } else {
        return 'error'
      }
    }
  },
  mounted() {
    this.$root.$on(`crud:selectedItem-${this.id}`, value => {
      this.status.value = value
    })
  },
  methods: {}
}
</script>
