<template>
  <v-app :dark="dark">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>name</v-list-tile-title>
              {{ user }}
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <div
          v-for="(items, group) in menu"
          :key="group">
          <h4 class="group-title" v-if="!miniVariant">{{ group }}</h4>
          <v-list-tile
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact>
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title" />
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-side-icon class="hidden-lg-and-up" @click="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>{{ `chevron_${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>remove</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon light>
              compare_arrows
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
      <v-switch
              v-model="dark"
              label="Темная тема">
      </v-switch>
    </v-footer>
    <v-snackbar
      v-if="error"
      v-model="snackbar.state"
      :color="snackbar.color"
      top="top"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <v-btn
        dark
        flat
        @click="closeSnackbar"
      >
        Закрыть
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  data: () => ({
    clipped: false,
    drawer: true,
    fixed: false,
    dark: false,
    miniVariant: true,
    right: true,
    rightDrawer: false,
    title: 'Админочка',
    snackbar: {
      state: false,
      color: 'red',
      text: '',
      timeout: 3600
    }
  }),
  computed: {
    // ...mapGetters(['index'])
    error() {
      return this.$store.getters.error
    },
    menu() {
      return this.$store.getters.menu
    },
    user() {
      return this.$store.getters.currentUser
    }
  },
  watch: {
    error({ color, text, timeout, state }) {
      this.snackbar.state = state
      this.snackbar.color = color
      this.snackbar.text = text
      this.snackbar.timeout = timeout
    }
  },
  async beforeCreate() {
    await this.$store.dispatch('user/get')
    await this.$store.dispatch('getMenu')
  },
  methods: {
    closeSnackbar() {
      this.snackbar.state = false
      this.$store.dispatch('clearError')
    }
  }
}
</script>
