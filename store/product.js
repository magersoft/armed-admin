export const actions = {
  async changeStatusVariation({ commit }, data) {
    try {
      return await this.$axios.$post('/api/product/change-status-variation/', data)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
    }
  },
  async getThumb({ commit }, id) {
    try {
      return await this.$axios.$get(`/api/product/get-thumb/?id=${id}`)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
    }
  },
  async save({ commit }, data) {
    try {
      await this.$axios.$post('/api/product/save/', data)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
    }
  }
}
