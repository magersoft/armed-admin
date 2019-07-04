<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="text-xs-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          dark
          v-on="on"
        >
          Действия
        </v-btn>
      </template>
      <v-list>
        <v-list-tile
          v-for="(status, key) in statuses.actions"
          :key="key"
          @click="changeStatus(key)"
        >
          <v-list-tile-title>{{ status }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    statuses: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    async changeStatus(key) {
      try {
        await this.$store.dispatch('crud/changeStatus', { status: key, items: this.items })
        for (const item in this.items) {
          if (this.items.hasOwnProperty(item)) {
            const id = this.items[item].id
            this.$root.$emit(`crud:selectedItem-${id}`, key)
          }
        }
      } catch (e) {}
    }
  }
}
</script>

<style scoped>

</style>
