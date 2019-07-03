import Cookie from 'cookie'
import Cookies from 'js-cookie'

export const state = () => ({
  token: null
})

export const getters = {
  isAuth: state => Boolean(state.token),
  token: state => state.token
}

export const mutations = {
  setToken(state, token) {
    this.$axios.setToken(token, 'Bearer')
    state.token = token
  },
  clearToken(state) {
    this.$axios.setToken(false)
    state.token = null
  }
}

export const actions = {
  async login({ commit, dispatch }, formData) {
    try {
      const { token, password, login, forbidden } = await this.$axios.$post('api/login/', formData)
      if (!token) {
        throw new Error(login || password || forbidden)
      }
      dispatch('setToken', token)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  async logout({ commit }) {
    await this.$axios.setToken(false)
    commit('clearToken')
    Cookies.remove('auth-token')
  },
  autoLogin({ dispatch }) {
    const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie
    const cookies = Cookie.parse(cookieStr || '') || {}
    const token = cookies['auth-token']
    if (token) {
      dispatch('setToken', token)
    } else {
      dispatch('logout')
    }
  },
  setToken({ commit }, token) {
    commit('setToken', token)
    Cookies.set('auth-token', token)
  }
}
