<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-chip :color="statusColor" text-color="white" @click="changeStatus" v-on="on">
        <v-avatar left>
          <v-icon>{{ statusIcon }}</v-icon>
        </v-avatar>
        {{ statusText }}
      </v-chip>
    </template>
    <span>Сменить статус?</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    status: {
      type: Number,
      required: true
    },
    statuses: {
      type: Object,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    variation: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  data: () => ({
    value: null
  }),
  computed: {
    statusText() {
      return this.statuses.labels[this.value]
    },
    statusColor() {
      return this.statuses.colors[this.value]
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
  created() {
    this.value = this.status
  },
  methods: {
    async changeStatus() {
      try {
        if (this.variation) {
          const status = {}
          status[this.id] = this.value !== 2
          this.value = await this.$store.dispatch('product/changeStatusVariation', status)
        } else {
          this.value = await this.$store.dispatch('crud/changeStatus', { 'status': this.value === 2 ? 0 : 2, 'items': [this.id] })
        }
      } catch (e) {}
    }
  }
}
</script>
