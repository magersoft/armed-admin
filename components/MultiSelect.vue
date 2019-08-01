<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-select
    v-model="model"
    :items="searchItems"
    :label="label"
    :multiple="multiple"
    chips
    :clearable="clearable"
    :hint="hint"
    :persistent-hint="persistentHint"
    :deletable-chips="deletableChips"
  >
    <template v-slot:prepend-item>
      <v-text-field
        v-model="search"
        solo
        :placeholder="placeholder"
        hide-details
        class="ma-2"
      />
      <v-divider />
    </template>
  </v-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, Array, String],
      required: true
    },
    items: {
      type: Array,
      required: false,
      default: () => []
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    deletableChips: {
      type: Boolean,
      required: false,
      default: false
    },
    persistentHint: {
      type: Boolean,
      required: false,
      default: false
    },
    clearable: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    hint: {
      type: String,
      required: false,
      default: ''
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Начните ввод ...'
    }
  },
  data: () => ({
    search: [],
    model: null
  }),
  computed: {
    searchItems() {
      return this.items.filter(item => {
        if (item.text.toLowerCase().indexOf(this.search) !== -1) {
          return item
        }
      })
    }
  },
  created() {
    this.model = this.value
  }
}
</script>
