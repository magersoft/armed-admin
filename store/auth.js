export const state = () => ({
  token: false
})

export const getters = {
  isAuth: state => Boolean(state.token),
  token: state => state.token
}

export const mutations = {
  setToken(state, token) {
    state.token = token
  },
  clearToken(state) {
    state.token = null
  }
}

export const actions = {
  async login({ commit, dispatch }, formData) {
    try {
      const { data } = await new Promise((resolve, reject) => {
        setTimeout(() => resolve({
          data: {
            token: 'mock-token',
            user: {
              id: 1
            }
          }
        }), 1000)
      })
      dispatch('setToken', data.token)
      commit('user/setId', data.user.id, { root: true })
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  logout({ commit }) {
    commit('clearToken')
  },
  setToken({ commit }, token) {
    commit('setToken', token)
  }
}
