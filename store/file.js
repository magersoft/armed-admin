export const actions = {
  async get() {},
  async upload({ commit }, file) {
    try {
      return await this.$axios.$post('/api/file/upload/', file)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
    }
  },
  async delete({ commit }, file) {
    try {
      await this.$axios.$delete(`/api/file/delete/?file=${file}`)
    } catch (e) {
      commit('setError', { text: e }, { root: true })
    }
  }
}
