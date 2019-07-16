export const state = () => ({
  message: {},
  menu: null
})

export const getters = {
  message: state => state.message,
  menu: state => state.menu
}

export const mutations = {
  setMessage(state, message) {
    state.message = {
      state: true,
      text: message.text,
      color: message.color || 'red',
      timeout: message.timeout || 0
    }
  },
  clearMessage(state) {
    state.message = {}
  },
  setMenu(state, payload) {
    state.menu = payload
  }
}

export const actions = {
  getMessage({ commit }, message) {
    commit('setMessage', message)
  },
  clearMessage({ commit }) {
    commit('clearMessage')
  },
  async getMenu({ commit, dispatch }) {
    try {
      const menu = await this.$axios.$get(`api/menu/?user_id=${this.getters['user/currentUser'].user_id}`)
      commit('setMenu', menu)
    } catch (e) {
      commit('setMessage', { text: e })
      throw e
    }
  }
}
