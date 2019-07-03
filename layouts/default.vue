<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
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
              <img src="/img/user.png">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title class="username">
                {{ user.surname }} {{ user.name }}
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="logout"><v-icon>exit_to_app</v-icon></v-btn>
                  </template>
                  <span>Выйти из системы</span>
                </v-tooltip>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-progress-circular
          v-if="!menu"
          indeterminate
          color="primary"
          class="wait-menu"
        ></v-progress-circular>
        <div
          v-for="(items, group) in menu"
          v-else
          :key="group">
          <h4 class="group-title" v-if="!miniVariant">{{ group }}</h4>
          <v-list-tile
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact>
            <v-tooltip right :disabled="!miniVariant">
              <template v-slot:activator="{ on }">
                <v-list-tile-action v-on="on">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
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
      <app-action-button />
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
import AppActionButton from '@/components/layouts/ActionButton'

export default {
  components: {
    AppActionButton
  },
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
      return this.$store.getters['user/currentUser']
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
    },
    async logout() {
      await this.$store.dispatch('auth/logout')
      this.$router.push('/login?message=logout')
    }
  }
}
</script>

<style lang="scss" scoped>
  .username {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 38px;
    span.v-tooltip--bottom {
      display: none;
    }
    i:hover {
      color: #1976d2;
    }
  }
  .wait-menu {
    display: flex;
    margin: 0 auto;
    margin-top: 2rem;
  }
</style>
