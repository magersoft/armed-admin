<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="text-xs-center mx-1">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          :disabled="!items.length"
          v-on="on"
        >
          Сменить статус
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(status, key) in statuses.actions"
          :key="key"
          @click="changeStatus(key)"
        >
          <v-list-item-title>{{ status }}</v-list-item-title>
        </v-list-item>
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
        await this.$store.dispatch('crud/changeStatus', { status: +key, items: this.items.map(i => i.id) })
        for (const item in this.items) {
          if (this.items.hasOwnProperty(item)) {
            const id = this.items[item].id
            this.$root.$emit(`crud:selectedItem-${id}`, +key)
          }
        }
      } catch (e) {}
    }
  }
}
</script>

<style scoped>

</style>
