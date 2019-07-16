<template>
  <div class="wrapper">
    <form>
      <h1>Авторизация</h1>
      <v-text-field
        v-model="controls.email"
        v-validate="'required|email'"
        :error-messages="errors.collect('email')"
        label="E-mail"
        data-vv-name="email"
        required
      ></v-text-field>
      <v-text-field
        v-model="controls.password"
        v-validate="'required|min:6'"
        type="password"
        :error-messages="errors.collect('password')"
        label="Пароль"
        data-vv-name="password"
        required
      ></v-text-field>
      <v-checkbox
        v-model="controls.checkbox"
        value="1"
        label="Запомнить меня"
        data-vv-name="checkbox"
        type="checkbox"
      ></v-checkbox>

      <v-btn @click="submit">
        Войти в систему
      </v-btn>
    </form>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  head: {
    title: 'Авторизация'
  },
  middleware: ['login'],
  $_veeValidate: {
    validator: 'new'
  },
  data: () => ({
    controls: {
      name: '',
      email: '',
      checkbox: null
    },
    dictionary: {
      attributes: {
        email: 'E-mail Address'
        // custom attributes
      },
      custom: {
        email: {
          required: () => 'Введите E-mail',
          email: 'Введите E-Mail по формату example@mail.com'
        },
        password: {
          required: () => 'Введите пароль',
          min: `Минимальная длина пароля 6 символов`
        }
      }
    }
  }),
  mounted() {
    this.$validator.localize('en', this.dictionary)

    const { message } = this.$route.query

    switch (message) {
      case 'login':
        this.$store.dispatch('getMessage', {
          color: 'primary',
          text: 'Чтобы продолжить, войдите в систему',
          timeout: 0
        })
        break
      case 'logout':
        this.$store.dispatch('getMessage', {
          color: 'primary',
          text: 'Вы вышли из системы',
          timeout: 0
        })
        break
      case 'forbidden':
        this.$store.dispatch('getMessage', {
          color: 'error',
          text: 'Доступ запрещен',
          timeout: 0
        })
        break
    }
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(async valid => {
        if (valid) {
          try {
            const formData = {
              login: this.controls.email,
              password: this.controls.password,
              remember_me: this.controls.checkbox
            }
            await this.$store.dispatch('auth/login', formData)
            this.$router.push('/')
          } catch (e) {}
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: rgba(0,0,0,.85);
  border-radius: 10px;
  padding: 4rem;
  max-width: 800px;
  margin: 0 auto;
}
</style>
