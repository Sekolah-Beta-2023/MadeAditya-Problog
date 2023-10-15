<template>
  <div class="w-[44rem] max-w-full mx-auto pt-20 pb-8 px-4">
    <div class="flex">
      <div class="relative w-full">
        <input type="text" v-model="search"
          class="peer block w-full py-3 pl-11 pr-5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-gray-600"
          placeholder="Search for tags">
        <fa-icon icon="fa-solid fa-magnifying-glass" class="absolute left-4 top-[calc(50%-9px)] w-4 h-4 text-gray-400" />
      </div>
    </div>
    <div class="w-full border rounded-md mt-8" v-if="!$fetchState.pending && !this.searched">
      <div class="px-6 py-4">
        <h2 class="text-2xl font-semibold">Popular Tags</h2>
        <div class="grid md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4 mt-4">
          <div class="px-5 py-3 bg-blue-50 rounded-md flex items-center justify-between" v-for="tag in trendingTags">
            <div>
              <h3 class="text-xl font-medium">{{ tag.tag }}</h3>
              <p class="text-gray-600">{{ tag.posts_count }} articles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-6 border-b flex justify-between items-center" v-for="tag in searchTags?.data" v-if="searched">
      <div>
        <NuxtLink :to="'/tags/' + tag.slug" class="font-semibold text-gray-600 text-lg hover:underline">#{{ tag.slug }}
        </NuxtLink>
        <div class="flex gap-2 items-center mt-1">
          <span class="text-gray-600">{{ tag.posts_count }} Articles</span>
          <span class="h-[2px] w-[2px] rounded-full bg-gray-600"></span>
          <span class="text-gray-600">{{ tag.followers_count }} Followers</span>
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
      trendingTags: null,
      searchTags: null
    }
  },
  layout: 'main',
  async fetch() {
    if (this.$route.query.search) {
      this.search = this.$route.query.search
      this.searched = true
      return this.searchTags = (await this.$axios.$get(`/api/tags?q=${this.$route.query.search}&limit=0`))
    }
    if (!this.searched && !this.trendingTags) {
      return this.trendingTags = (await this.$axios.$get('/api/tags-popular'))
    }
  },
  watch: {
    search(q) {
      if (q.trim() == '') {
        this.$router.replace('/tags')
        return this.searched = false
      }
      const url = `/tags?search=${q}`
      this.$router.replace(url)
    },
    '$route.query': '$fetch'
  },
}
</script>