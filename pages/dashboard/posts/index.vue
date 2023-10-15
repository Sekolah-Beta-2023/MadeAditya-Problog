<template>
  <div>
    <div class="p-10" v-if="!$fetchState.pending">
      <div class="flex gap-3 items-center justify-between mb-6 flex-wrap sm:pr-6">
        <h2 class="font-semibold text-2xl sm:text-4xl">Your Articles ({{ posts.data.length }})
        </h2>
        <NuxtLink to="/dashboard/posts/create" class="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white">
          <fa-icon icon="fa-solid fa-plus" class="mr-2" />Write an article
        </NuxtLink>
      </div>
      <div>
        <h3 class="mt-8 text-center text-2xl font-semibold" v-if="!posts?.data?.length">You don't
          have
          any articles</h3>
        <div class="py-6 flex justify-between gap-2 items-center border-b flex-wrap" v-for="post in posts.data">
          <div>
            <h3 class="text-xl sm:text-2xl font-semibold">{{ post.title }}</h3>
            <p class="text-gray-600">Published on {{ $moment(post.created_at).format('DD MMMM, YYYY') }}</p>
          </div>
          <div class="flex gap-3 sm:pr-6">
            <NuxtLink :to="`/dashboard/posts/${post.id}/edit`"
              class="px-3 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600">
              <fa-icon icon="fa-solid fa-pencil" class="mr-2" />Edit
            </NuxtLink>
            <button @click="() => confirmDelete(post.id)"
              class="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white">
              <fa-icon icon="fa-solid fa-trash" class="mr-2" />Delete
            </button>
          </div>
        </div>
      </div>
      <span class="loadMoreIntersect"></span>
    </div>
    <div class="loader mx-auto mt-8 mb-6" v-if="$fetchState.pending"></div>
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  layout: 'dashboard',
  data() {
    return {
      posts: {}
    };
  },
  methods: {
    async confirmDelete(postId) {
      if (window.confirm('Are you sure want to delete this post?')) {
        await this.$axios.$delete('/api/dashboard/posts/' + postId);
        this.posts.data = this.posts.data.filter(post => post.id != postId)
      }
    }
  },
  async fetch() {
    this.posts = await this.$axios.$get('/api/dashboard/posts')
  },
}
</script>