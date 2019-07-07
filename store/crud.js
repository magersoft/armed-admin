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
      return await this.$axios.$get(`api/${crud}/all/${page}${pageSize}`)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  async getOne({ commit }, id) {
    const crud = this.getters['crud/crud']
    try {
      return await this.$axios.$get(`api/${crud}/one/?id=${id}`)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  async filter({ commit }, data) {
    try {
      const crud = this.getters['crud/crud']
      return await this.$axios.$post(`api/${crud}/filtered/`, data)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  async changeStatus({ commit }, { status, items }) {
    const crud = this.getters['crud/crud']
    try {
      await this.$axios.$post(`api/${crud}/change-status/`, { status, items })
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  async changeTitle({ commit }, data) {
    try {
      const crud = this.getters['crud/crud']
      await this.$axios.$post(`api/${crud}/change-title/`, data)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  },
  async delete({ commit }, data) {
    try {
      const crud = this.getters['crud/crud']
      await this.$axios.$post(`api/${crud}/delete/`, data)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
      throw e
    }
  }
}
