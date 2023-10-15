<template>
  <div class="px-6 md:px-16 xl:px-28 mt-28 mb-10">
    <h1 class="text-4xl font-semibold mb-6">All Articles</h1>
    <PostList initial-link="/api/posts" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      posts: {}
    }
  },
  layout: 'main',
  async fetch() {
    this.posts = (await this.$axios.$get('/api/posts'))
  },
}
</script>