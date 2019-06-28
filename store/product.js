export const actions = {
  async getAll({ commit }) {
    try {
      return await this.$axios.$get('/mock-data/products.json')
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  async filterProduct({ commit }, formData) {
    try {
      await this.$axios.$post('/', formData)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  }
}
