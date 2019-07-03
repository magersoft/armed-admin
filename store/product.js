export const actions = {
  async getAll({ commit }, params = null) {
    const page = params ? `?page=${params.page}` : ''
    const pageSize = params ? `&size=${params.rowsPerPage}` : ''
    try {
      return await this.$axios.$get(`http://dobrota.yii/api/products/${page}${pageSize}`)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  async getOne({ commit }, id) {
    try {
      return await this.$axios.$get(`/mock-data/product.json?id=${id}`)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  async filterProduct({ commit }, formData) {
    try {
      return await this.$axios.$post('/', formData)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  async changeStatus({ commit }, formData) {
    try {
      await this.$axios.$post('http://dobrota.yii/api/change-status/', formData)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
    }
  }
}
