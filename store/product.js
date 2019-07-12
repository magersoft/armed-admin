export const actions = {
  async changeStatusVariation({ commit }, data) {
    try {
      return await this.$axios.$post('/api/product/change-status-variation/', data)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
    }
  }
}
