<template>
  <div class="w-[44rem] max-w-full mx-auto pt-20 pb-8 px-4">
    <div class="flex">
      <div class="relative w-full">
        <input type="text" v-model="search"
          class="peer block w-full py-3 pl-11 pr-5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-gray-600"
          placeholder="Search for users">
        <fa-icon icon="fa-solid fa-magnifying-glass" class="absolute left-4 top-[calc(50%-9px)] w-4 h-4 text-gray-400" />
      </div>
    </div>
    <div class="w-full border rounded-md mt-8" v-if="!$fetchState.pending && !this.searched">
      <div class="px-6 py-4">
        <h2 class="text-2xl font-semibold">Popular Writers</h2>
        <div class="px-5 py-3 bg-gray-100 border rounded-md flex justify-between sm:items-center mt-3"
          v-for="writer in trendingWriters">
          <div class="user inline-flex gap-x-4 gap-y-2 sm:items-center flex-col sm:flex-row">
            <img :src="writer.picture" alt="" class="w-14 h-14 rounded-full" loading="lazy">
            <div>
              <h4 class="font-medium sm:text-lg">{{ writer.name }}</h4>
              <p class="text-gray-600 text-sm sm:text-base">@{{ writer.username }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-6 border-b flex justify-between sm:items-center" v-for="user in searchUsers" v-if="searched">
      <div class="user inline-flex gap-x-4 gap-y-2 sm:items-center flex-col sm:flex-row">
        <img :src="user.picture" alt="" class="w-14 h-14 rounded-full" loading="lazy">
        <div>
          <h4 class="font-medium sm:text-lg">{{ user.name }}</h4>
          <p class="text-gray-600 text-sm sm:text-base">@{{ user.username }}</p>
        </div>
      </div>
    </div>

    <div class="loader mx-auto mt-5" v-if="$fetchState.pending"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      search: '',
      searched: false,
      trendingWriters: null,
      searchUsers: null
    }
  },
  layout: 'main',
  async fetch() {
    if (this.$route.query.search) {
      this.search = this.$route.query.search
      this.searched = true
      this.searchUsers = (await this.$axios.$get(`/api/users?q=${this.$route.query.search}`))
      return
    }
    if (!this.searched && !this.trendingWriters) {
      return this.trendingWriters = (await this.$axios.$get('/api/users/popular'))
    }
  },
  watch: {
    search(q) {
      if (q.trim() == '') {
        this.$router.replace('/writers').catch(() => { })
        return this.searched = false
      }
      const url = `/writers?search=${q}`
      this.$router.replace(url).catch(() => { })
      console.log(q)
    },
    '$route.query': '$fetch'
  },
}
</script>