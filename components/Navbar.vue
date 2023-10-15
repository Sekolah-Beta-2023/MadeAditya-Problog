<template>
  <div>
    <nav
      class="bg-white flex justify-between items-center px-6 sm:px-12 lg:px-24 py-4 border-b fixed top-0 left-0 right-0 z-30">
      <div class="flex gap-4">
        <button class="sm:hidden" @click="navbarShow = true"><fa-icon icon="fa-solid fa-bars" size="lg" /></button>
        <NuxtLink to="/" class="text-3xl sm:text-4xl font-semibold">Problog</NuxtLink>
      </div>
      <div
        class="navbar-nav sm:flex fixed top-0 left-0 bottom-0 sm:static sm:gap-4 lg:gap-12 bg-white z-40 w-[250px] sm:w-auto shadow-xl sm:shadow-none py-6 px-6 sm:p-0 transition-all duration-200"
        :class="{ 'ml-0': navbarShow, 'ml-[-250px] sm:ml-0': !navbarShow }">
        <NuxtLink to="/" class="block sm:hidden text-3xl sm:text-4xl font-semibold mb-6">Problog</NuxtLink>
        <NuxtLink to="/posts" class="block text-lg px-4 py-2 mb-3 sm:text-base sm:mb-0 rounded-lg hover:bg-gray-50">
          <fa-icon icon="fa-regular fa-newspaper" size="lg" class="mr-3 sm:hidden" />Posts
        </NuxtLink>
        <!-- <NuxtLink to="/explore" class="block text-lg px-4 py-2 mb-3 sm:text-base sm:mb-0 rounded-lg hover:bg-gray-50">
          <fa-icon icon="fa-regular fa-compass" size="lg" class="mr-3 sm:hidden" />Explore
        </NuxtLink> -->
        <NuxtLink to="/tags" class="block text-lg px-4 py-2 mb-3 sm:text-base sm:mb-0 rounded-lg hover:bg-gray-50">
          <fa-icon icon="fa-solid fa-tags" size="lg" class="mr-3 sm:hidden" />Tags
        </NuxtLink>
        <NuxtLink to="/writers" class="block text-lg px-4 py-2 mb-3 sm:text-base sm:mb-0 rounded-lg hover:bg-gray-50">
          <fa-icon icon="fa-solid fa-user-pen" size="lg" class="mr-3 sm:hidden" />Writers
        </NuxtLink>
      </div>
      <div class="flex gap-4" v-if="!$auth.loggedIn">
        <NuxtLink to="/auth/register"
          class="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700"><fa-icon
            icon="fa-solid fa-pen" class="mr-1"></fa-icon> Write</NuxtLink>
        <NuxtLink to="/auth"
          class="hidden lg:block px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-200">Log
          In</NuxtLink>
      </div>

      <button class="flex gap-3 items-center" v-if="$auth.loggedIn" @click="showPopover = !showPopover" ref="userMenu">
        <img :src="$auth.user.picture" alt="profile" class="w-12 h-12 rounded-full">
        <!-- <div class="text-lg hidden lg:block">mdadityaa</div> -->
      </button>
      <div class="absolute top-[calc(100%-0.5rem)] right-2 lg:w-64 bg-white z-20 border rounded-md" ref="userPopover"
        v-if="showPopover && $auth.loggedIn">
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
        <!-- <NuxtLink to="/dashboard/profile" class="block px-4 py-3 text-gray-600 hover:bg-gray-100"><fa-icon
            icon="fa-solid fa-user-gear" class="mr-3" />Profile Settings</NuxtLink> -->
        <NuxtLink to="/bookmarks" class="block px-4 py-3 text-gray-600 hover:bg-gray-100"><fa-icon
            icon="fa-solid fa-book-bookmark" class="mr-3" />Bookmark</NuxtLink>
        <hr>
        <button @click="confirmLogout = true" class="block w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-100">
          <fa-icon icon="fa-solid fa-arrow-right-from-bracket" class="mr-3" />Logout
        </button>
      </div>

      <!-- <img :src="$auth.user.picture" alt="Profile" class="w-14 h-14 rounded-full" v-if="$auth.loggedIn"> -->
      <div v-if="navbarShow" @click="navbarShow = false"
        class="overlay sm:hidden fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,0.5)] z-20"></div>
    </nav>
    <Transition ansition name="modal" appear>
      <div class="fixed inset-0 bg-[rgba(0,0,0,0.5)] py-20 px-8 z-[100]" v-if="confirmLogout">
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
  <!-- <ModalBox title="Logout" :title-center="true" :height-fit="true" v-if="confirmLogout && $auth.loggedIn"
    @close-modal="confirmLogout = false">
    <fa-icon icon="fa-solid fa-circle-exclamation" class="text-6xl mt-6 block mx-auto text-red-500" />
    <div class="my-8 text-center text-3xl font-medium">Are you sure want to logout?</div>
    <div class="flex justify-center items-center gap-4 mb-6">
      <Link href="/auth/logout" as="button" class="px-3 py-2 w-[8rem] text-white bg-red-500 hover:bg-red-600 rounded-md"
        method="post">Logout
      </Link>
      <button class="px-3 py-2 w-[8rem] border bg-gray-50 hover:bg-gray-100 rounded-md"
        @click="confirmLogout = false">Cancel
      </button>
    </div>
  </ModalBox> -->
</template>
<script>
export default {
  data() {
    return {
      navbarShow: false,
      userPopover: null,
      showPopover: false,
      showNavbar: false,
      confirmLogout: false,
    }
  },
  methods: {
    openPopover() {
      this.showPopover = !this.showPopover
    },
    async logout() {
      await this.$auth.logout('local')
    }
  }
}
</script>