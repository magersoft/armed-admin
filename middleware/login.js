export default async function ({ store, redirect }) {
  await store.dispatch('auth/autoLogin')
  if (store.getters['auth/isAuth']) {
    redirect('/?message=login')
  }
}
