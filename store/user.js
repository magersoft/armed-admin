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
      const { data } = await this.$axios.get('https://jsonplaceholder.typicode.com/users/1')
      commit('setUser', data)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  }
}
