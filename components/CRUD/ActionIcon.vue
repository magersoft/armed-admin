<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon
            color="blue darken-2"
            @click="deleteItem(item.id)"
          >
            visibility
          </v-icon>
        </v-btn>
      </template>
      <span>Посмотреть</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon
            color="orange darken-2"
            @click="editItem(item.id)"
          >
            edit
          </v-icon>
        </v-btn>
      </template>
      <span>Редактировать</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon
            color="red darken-2"
            @click="deleteItem(item.id)"
          >
            delete
          </v-icon>
        </v-btn>
      </template>
      <span>Удалить</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    editItem(id) {
      this.$router.push(`product/${id}`)
    }
  }
}
</script>
