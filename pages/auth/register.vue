<script>
export default {
  data() {
    return {
      email: null,
      username: null,
      name: null,
      password: null,
    }
  },
  methods: {
    async register() {
      const res = await this.$axios.$post('/api/register', {
        email: this.email,
        username: this.username,
        name: this.name,
        password: this.password,
      })
      console.log(res)
      this.$router.push('/auth')
    }
  }
}
</script>
<template>
  <div class="flex px-4 lg:px-12 py-4 lg:py-10">
    <div class="hidden md:block w-[50%]">
      <img src="~/assets/img/signup_image.png" alt="">
    </div>
    <form @submit.prevent="register" class="w-full md:w-[50%] px-4 lg:px-20 pt-6">
      <h1 class="text-3xl md:text-4xl font-semibold mb-8">Register New Account</h1>
      <div class="mb-4">
        <label for="email">Email</label>
        <input type="email" class="block w-full mt-2 px-3 py-2 rounded-md border focus:outline-none focus:border-blue-600"
          placeholder="Enter your email" id="email" v-model="email">
      </div>
      <div class="mb-4">
        <label for="username">Username</label>
        <input type="text" class="block w-full mt-2 px-3 py-2 rounded-md border focus:outline-none focus:border-blue-600"
          placeholder="Enter your username" id="username" v-model="username">
      </div>
      <div class="mb-4">
        <label for="name">Name</label>
        <input type="text" class="block w-full mt-2 px-3 py-2 rounded-md border focus:outline-none focus:border-blue-600"
          placeholder="Enter your name" id="name" v-model="name">
      </div>
      <div class="mb-4">
        <label for="password">New Password</label>
        <PasswordInput name="password" placeholder="Enter new password" v-model="password" />
      </div>
      <button class="px-3 py-2 rounded-md bg-blue-600 text-white mb-2">Sign Up</button>
      <NuxtLink to="/auth" class="text-blue-600 hover:underline block w-fit mt-3">Already have account?</NuxtLink>
    </form>
  </div>
</template>