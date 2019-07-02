export const actions = {
  async getAll({ commit }) {
    try {
      return await this.$axios.$get('http://dobrota.yii/api/products/')
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
      await this.$axios.$post('/', formData)
      await new Promise(resolve => {
        setTimeout(() => {
          resolve(formData)
        }, 2000)
      })
      console.log(formData)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
    }
  }
}
