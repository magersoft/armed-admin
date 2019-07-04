export const state = () => ({
  crud: null
})

export const getters = {
  crud: state => state.crud
}

export const mutations = {
  set(state, payload) {
    state.crud = payload
  }
}

export const actions = {
  async getAll({ commit }, params = null) {
    const crud = this.getters['crud/crud']
    const page = params ? `?page=${params.page}` : ''
    const pageSize = params ? `&size=${params.rowsPerPage}` : ''
    try {
      return await this.$axios.$get(`http://dobrota.yii/api/${crud}/all/${page}${pageSize}`)
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
    const crud = this.getters['crud/crud']
    try {
      await this.$axios.$post(`api/${crud}/change-status/`, formData)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  async changeTitle({ commit }, formData) {
    try {
      const crud = this.getters['crud/crud']
      await this.$axios.$post(`api/${crud}/change-title/`, formData)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  }
}
