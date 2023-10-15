<script>
export default {
  props: ['title'],
  data() {
    return {
      userMenu: null,
      showPopover: false,
      showNavbar: false,
      confirmLogout: false,
    }
  },
  mounted() {
    document.onclick = event => {
      if (event.target != this.$refs.userPopover && !this.$refs.userPopover.contains(event.target)) {
        this.showPopover = false
      }
    }
  },
  methods: {
    closePopover() {
      this.userPopover = false
    },
    async logout() {
      await this.$auth.logout('local')
    }
  },
}
</script>
<template>
  <div>
    <nav
      class="fixed w-[260px] lg:w-[300px] top-0 left-0 bottom-0 border-r z-[99] bg-white shadow-xl transition-all duration-200"
      :class="{ 'ml-0': showNavbar, '-ml-[260px] lg:ml-0': !showNavbar }">
      <NuxtLink to="/" class="text-4xl font-semibold py-6 px-7 inline-block">Problog</NuxtLink>
      <div class="lg:mt-3">
        <NuxtLink to="/dashboard" class="block px-7 py-3 text-gray-600 hover:bg-gray-100 text-lg"><fa-icon
            icon="fa-solid fa-tachometer-alt" class="mr-3" />Dashboard</NuxtLink>
        <NuxtLink to="/dashboard/posts" class="block px-7 py-3 text-gray-600 hover:bg-gray-100 text-lg"><fa-icon
            icon="fa-regular fa-newspaper" class="mr-3" />Manage Blog</NuxtLink>
        <NuxtLink to="/bookmarks" class="block px-7 py-3 text-gray-600 hover:bg-gray-100 text-lg"><fa-icon
            icon="fa-solid fa-book-bookmark" class="mr-3" />Bookmark</NuxtLink>
        <hr class="my-2">
        <NuxtLink to="/" class="block px-7 py-3 text-gray-600 hover:bg-gray-100 text-lg"><fa-icon
            icon="fa-solid fa-arrow-left" class="mr-3" />Back to home</NuxtLink>
      </div>
    </nav>

    <div class="overlay fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50" @click="showNavbar = false" v-if="showNavbar"></div>

    <div class="px-6 py-4 border-b flex justify-between items-center lg:ml-[300px] relative">
      <button class="text-xl lg:hidden" @click="showNavbar = true"><fa-icon icon="fa-solid fa-bars" /></button>
      <h1 class="text-2xl font-semibold">{{ title }}</h1>
      <a href="#" class="flex gap-3 items-center" @click.stop="showPopover = !showPopover" id="userMenu" ref="userMenu"
        v-click-outside="closePopover">
        <img :src="$auth.user.picture" alt="profile" class="w-10 h-10 rounded-full">
        <div class="text-lg hidden lg:block">{{ $auth.user.username }}</div>
      </a>
      <div class="absolute top-[calc(100%-0.5rem)] right-2 lg:w-64 bg-white z-20 border rounded-md" ref="userPopover"
        v-show="showPopover">
        <div class="user flex gap-2 items-center p-4 hover:bg-gray-100">
          <img :src="$auth.user.picture" alt="" class="w-12 h-12 rounded-full" loading="lazy">
          <div>
            <h4 class="font-medium">{{ $auth.user.name }}</h4>
            <p class="text-gray-600 text-sm">@{{ $auth.user.username }}</p>
          </div>
        </div>
        <hr>
        <NuxtLink to="/dashboard" class="block px-4 py-3 text-gray-600 hover:bg-gray-100"><fa-icon
            icon="fa-solid fa-tachometer-alt" class="mr-3" />Dashboard</NuxtLink>
        <NuxtLink to="/bookmarks" class="block px-4 py-3 text-gray-600 hover:bg-gray-100"><fa-icon
            icon="fa-solid fa-book-bookmark" class="mr-3" />Bookmark</NuxtLink>
        <hr>
        <button @click="confirmLogout = true" class="block w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-100">
          <fa-icon icon="fa-solid fa-arrow-right-from-bracket" class="mr-3" />Logout
        </button>
      </div>
    </div>
    <div class="lg:ml-[300px]">
      <nuxt />
    </div>
    <Transition ansition name="modal" appear>
      <div class="fixed inset-0 bg-[rgba(0,0,0,0.5)] py-20 px-8 z-[100]" v-if="confirmLogout"
        @click="confirmLogout = false">
        <div
          class="modal-box bg-white max-w-full mx-auto rounded-md border border-gray-300 transition duration-300 overflow-y-hidden w-[35rem]"
          @click.stop="">
          <div class="modal-header py-3 px-5 relative">
            <h2 class="text-xl font-medium text-center">Logout</h2>
            <div
              class="close-btn w-9 h-9 p-1.5 rounded cursor-pointer hover:bg-gray-100 text-center absolute top-[50%] right-4 translate-y-[-50%]"
              @click="confirmLogout = false">
              <fa-icon icon="fa-solid fa-xmark" size="xl" />
            </div>
          </div>
          <div class="modal-content p-5 border-t border-gray-300 h-[calc(100%-1.75rem*2)] overflow-y-auto">
            <div class="flex justify-center items-center">
              <fa-icon icon="fa-solid fa-circle-exclamation" class="text-6xl mt-6 block mx-auto text-red-500" />
            </div>
            <div class="my-8 text-center text-3xl font-medium">Are you sure want to logout?</div>
            <div class="flex justify-center items-center gap-4 mb-6">
              <button class="px-3 py-2 w-[8rem] text-white bg-red-500 hover:bg-red-600 rounded-md"
                @click="logout">Logout</button>
              <button class="px-3 py-2 w-[8rem] border bg-gray-50 hover:bg-gray-100 rounded-md"
                @click="confirmLogout = false">Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>