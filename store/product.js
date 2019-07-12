export const actions = {
  async changeStatusVariation({ commit }, data) {
    try {
      return await this.$axios.$post('/api/product/change-status-variation/', data)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
    }
  },
  async getThumb({ commit }, id) {
    try {
      return await this.$axios.$get(`/api/product/get-thumb/?id=${id}`)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
    }
  }
}
