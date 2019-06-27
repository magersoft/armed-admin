export default function ({ store, redirect }) {
  if (store.getters['auth/isAuth']) {
    redirect('/?message=login')
  }
}
