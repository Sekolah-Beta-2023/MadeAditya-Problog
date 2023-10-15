<template>
  <div class="w-[60rem] max-w-full mx-auto pt-20 pb-8 px-4">
    <div class="p-5 rounded-md border mb-4">
      <h2 class="text-2xl font-semibold text-center">{{ tag.tag }}</h2>
      <p class="text-gray-600 text-center">#{{ tag.slug }}</p>
      <div class="flex justify-center gap-6 mt-5">
        <FollowButton class="px-3 py-1.5 rounded-full bg-white border border-blue-600 text-blue-600" :data-id="tag.id"
          :isFollowed="tag.followed" type="tag"
          @follow="(follow) => follow ? tag.followers_count++ : tag.followers_count--">
          <template #default>
            <fa-icon icon="fa-solid fa-plus" class="mr-2" />Follow Tag
          </template>
          <template #followed>
            <fa-icon icon="fa-solid fa-check" class="mr-2" />Followed
          </template>
        </FollowButton>
      </div>
      <div class="flex justify-center gap-6 mt-5 text-gray-600">
        <p><fa-icon icon="fa-solid fa-users" class="mr-2" />{{
          tag.followers_count }} Followers</p>
        <span><fa-icon icon="fa-regular fa-newspaper" class="mr-2" />{{ tag.posts_count }} Articles</span>
      </div>
    </div>
    <PostList :initial-link="`/api/tags/${tag.slug}/posts`" fullWidth="true" title="Articles" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      tag: {}
    }
  },
  layout: 'main',
  async asyncData({ params, $axios }) {
    const tag = (await $axios.$get('/api/tags/' + params.slug)).data
    return { tag }
  }
}
</script>