export const state = () => ({
  error: {},
  menu: null
})

export const getters = {
  error: state => state.error,
  menu: state => state.menu
}

export const mutations = {
  setError(state, error) {
    state.error = {
      state: true,
      text: error.text,
      color: error.color || 'red',
      timeout: error.timeout || 0
    }
  },
  clearError(state) {
    state.error = {}
  },
  setMenu(state, payload) {
    state.menu = payload
  }
}

export const actions = {
  getError({ commit }, error) {
    commit('setError', error)
  },
  clearError({ commit }) {
    commit('clearError')
  },
  async getMenu({ commit, dispatch }) {
    try {
      const menu = await this.$axios.$get('/mock-data/menu.json', this.getters['user/currentUser'].id)
      commit('setMenu', menu)
    } catch (e) {
      commit('setError', { text: e })
      throw e
    }
  }
}
