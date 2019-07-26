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
  async updateMediaSort({ commit }, array) {
    try {
      await this.$axios.$post('/api/product/update-media-sort/', array)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
    }
  },
  async updateAdvantagesTitle({ commit }, data) {
    try {
      await this.$axios.$post('/api/product/update-advantages-title/', data)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
    }
  },
  async updateAdvantagesDescription({ commit }, data) {
    try {
      await this.$axios.$post('/api/product/update-advantages-description/', data)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
    }
  },
  async addAdvantage({ commit }, data) {
    try {
      return await this.$axios.$post('/api/product/add-advantage/', data)
    } catch (e) {
      commit('setMessage', { text: e }, { root: true })
    }
  },
  async advantagesUpdateSort({ commit }, data) {
    try {
      await this.$axios.$post('/api/product/update-advantages-sort', data)
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
