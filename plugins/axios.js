export default ({ $axios, redirect, store }) => {
  // $axios.interceptors.request.use(request => {
  //   if (store.getters.csrf_token && !request.headers.common['X-CSRF-TOKEN']) {
  //     console.log(store.getters.csrf_token)
  //     request.headers.common['X-Requested-With'] = 'XMLHttpRequest'
  //     request.headers.common['X-CSRF-TOKEN'] = store.getters.csrf_token
  //   }
  //
  //   return request
  // })

  $axios.onError(error => {
    if (error.response) {
      if (error.response.status === 401) {
        redirect('/login?message=session')
        store.dispatch('auth/logout')
      }
      if (error.response.status === 403) {
        store.dispatch('auth/logout')
        redirect('/login?message=forbidden')
      }
      if (error.response.status === 500) {
        console.error('Server 500 error')
      }
    }
  })
}
