export const actions = {
  async changeStatusVariation({ commit }, data) {
    try {
      return await this.$axios.$post('/api/product/change-status-variation/', data)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
      throw e
    }
  },
  async getThumb({ commit }, id) {
    try {
      return await this.$axios.$get(`/api/product/get-thumb/?id=${id}`)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
      throw e
    }
  },
  async updateAdvantageTitle({ commit }, data) {
    try {
      await this.$axios.$post('/api/product/update-advantage-title/', data)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
      throw e
    }
  },
  async updateAdvantageDescription({ commit }, data) {
    try {
      await this.$axios.$post('/api/product/update-advantage-description/', data)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
      throw e
    }
  },
  async updateAdvantageImage({ commit }, data) {
    try {
      await this.$axios.$post('/api/product/update-advantage-image/', data)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
      throw e
    }
  },
  async addAdvantage({ commit }, data) {
    try {
      console.log(data)
      return await this.$axios.$post('/api/product/add-advantage/', data)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
      throw e
    }
  },
  async removeMedia({ commit }, id) {
    try {
      await this.$axios.$delete(`/api/product/remove-media/?id=${id}`)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
      throw e
    }
  },
  async updateMediaSort({ commit }, array) {
    try {
      await this.$axios.$post('/api/product/update-media-sort/', array)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
      throw e
    }
  },
  async save({ commit }, data) {
    try {
      await this.$axios.$post('/api/product/save/', data)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
      throw e
    }
  }
}
