<script>
export default {
  layout: 'dashboard'
}
</script>
<template>
  <div class="px-10 py-6">
    <div class="p-6 border rounded-md mb-6">
      <h2 class="text-2xl font-semibold text-center">Bookmarks</h2>
      <p class="text-gray-600 text-center mt-3">All posts you have bookmarked.</p>
    </div>
    <PostList initialLink="/api/dashboard/bookmarks" title="Bookmarks" />
  </div>
</template>