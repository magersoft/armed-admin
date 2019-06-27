export const state = () => ({
  userId: null,
  currentUser: {}
})

export const getters = {
  userId: state => state.userId,
  currentUser: state => state.currentUser
}

export const mutations = {
  setId(state, id) {
    state.userId = id
  },
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
    }
  }
}
