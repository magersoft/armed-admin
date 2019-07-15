export const state = () => ({
  currentUser: {}
})

export const getters = {
  currentUser: state => state.currentUser
}

export const mutations = {
  setUser(state, payload) {
    state.currentUser = payload
  }
}

export const actions = {
  async get({ commit }) {
    try {
      const { user } = await this.$axios.$get(`api/user/get/?token=${this.getters['auth/token']}`)
      commit('setUser', user)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  }
}
