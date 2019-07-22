<template>
  <v-chip :color="statusColor" text-color="white">
    <v-avatar>
      <v-icon>{{ statusIcon }}</v-icon>
    </v-avatar>
    {{ statusText }}
  </v-chip>
</template>

<script>
export default {
  props: {
    status: {
      type: Number,
      required: true
    },
    statuses: {
      type: Array,
      required: true
    }
  },
  computed: {
    statusText() {
      return this.statuses.labels[this.status]
    },
    statusColor() {
      return this.statuses.colors[this.status]
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
  }
}
</script>
