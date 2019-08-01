<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      width="300"
      fixed
      app
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-item avatar>
            <v-list-item-avatar>
              <img src="/img/user.png">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="username">
                {{ user.surname }} {{ user.name }}
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="logout">
                      <v-icon>exit_to_app</v-icon>
                    </v-btn>
                  </template>
                  <span>Выйти из системы</span>
                </v-tooltip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider />
        <v-progress-circular
          v-if="!menu"
          indeterminate
          color="primary"
          class="wait-menu"
        />
        <div
          v-for="(items, group) in menu"
          v-else
          :key="group"
        >
          <h4 v-if="!miniVariant" class="group-title">
            {{ group }}
          </h4>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-tooltip right :disabled="!miniVariant">
              <template v-slot:activator="{ on }">
                <v-list-item-action v-on="on">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
          <v-divider />
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>{{ `chevron_${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>menu</v-icon>
      </v-btn>
    </v-app-bar>
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
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              compare_arrows
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      fixed
      app
      class="pa-0"
    >
      <span>&copy; 2019</span>
      <v-switch
        v-model="$vuetify.theme.dark"
        label="Темная тема"
      />
    </v-footer>
    <v-snackbar
      v-if="message"
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
    message() {
      return this.$store.getters.message
    },
    menu() {
      return this.$store.getters.menu
    },
    user() {
      return this.$store.getters['user/currentUser']
    }
  },
  watch: {
    message({ color, text, timeout, state }) {
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
      this.$store.dispatch('clearMessage')
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
