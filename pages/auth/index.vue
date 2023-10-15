<template>
  <div class="flex px-4 lg:px-12 py-4 lg:py-16">
    <div class="hidden md:block w-[50%]">
      <img src="~/assets/img/login_image.png" alt="">
    </div>
    <form class="w-full md:w-[50%] px-4 lg:px-20 pt-6" @submit.prevent="login">
      <h1 class="text-3xl md:text-4xl font-semibold mb-8 md:mb-12">Log in to Problog</h1>
      <div class="mb-4">
        <label for="email">Email</label>
        <input type="email" class="block w-full mt-2 px-3 py-2 rounded-md border focus:outline-none focus:border-blue-600"
          placeholder="Enter your email" id="email" v-model="email">
      </div>
      <div class="mb-4">
        <label for="email">Password</label>
        <PasswordInput name="password" placeholder="Enter new password" v-model="password" />
      </div>
      <button class="px-3 py-2 rounded-md bg-blue-600 text-white mb-2">Log In</button>
      <NuxtLink to="/auth/register" class="text-blue-600 hover:underline block w-fit mt-3">Don't have account?
      </NuxtLink>
    </form>
  </div>
</template>
<script>
export default {
  middleware: 'guest',
  // auth: 'guest',

  data: () => ({
    errors: [],
    email: '',
    password: '',
    remember: false
  }),

  async mounted() {
    await this.$axios.$get('/sanctum/csrf-cookie');
    const { token } = await this.$axios.$get('/api/test', {
      data: { test: 'Hello' }
    })
    console.log(token)
    // console.log(await this.$axios.$post('/api/test', {
    //   data: { test: 'Hello' }, headers: {
    //     'X-XSRF-TOKEN': token
    //   }
    // }, {
    //   headers: {
    //     'X-XSRF-TOKEN': token
    //   }
    // }))
    // console.log(token)
  },

  head() {
    return {
      title: 'Sign In - Problog',
    }
  },

  methods: {
    async login(event) {
      this.errors = [];

      // this.$axios.$get('/sanctum/csrf-cookie').then(res => {
      //   this.$auth.loginWith('local', {
      //     data: {
      //       email: this.email,
      //       password: this.password,
      //       remember: this.remember
      //     },
      //   })
      //     .then(() => this.$router.push('/'))
      //     .catch(error => {
      //       if (error.response.status !== 422) throw error

      //       this.errors = Object.values(error.response.data.errors).flat();
      //     })
      // });
      // console.log(this.email, this.password)
      this.$axios.$get('/sanctum/csrf-cookie').then(res => {
        this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          },
        }).then(async () => {
          await this.$auth.fetchUser()
          // this.$router.push('/')
        })
      })

    },
  }
}

</script>