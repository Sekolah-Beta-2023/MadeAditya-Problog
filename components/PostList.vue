<template>
  <div>
    <div class="posts w-full rounded-md border" :class="{ 'lg:w-[60%] xl:w-[65%]': !fullWidth }">
      <div class="px-6 py-3 flex justify-between items-center border-b">
        <h2 class="text-xl font-semibold">{{ title ?? 'My Feed' }}</h2>
      </div>
      <div class="p-6 border-t first:border-t-0" v-for=" post  in posts.data" :key="post.id">
        <NuxtLink :to="'/@' + post.user.username" class="user inline-flex gap-4 items-center">
          <img :src="post.user.picture" alt="" class="w-14 h-14 rounded-full" loading="lazy">
          <div>
            <h4 class="font-medium">{{ post.user.name }}</h4>
            <p class="text-gray-600">@{{ post.user.username }}</p>
          </div>
        </NuxtLink>
        <div class="content grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
          <div class="md:col-span-7">
            <NuxtLink :to="'/posts/' + post.slug" class="text-2xl font-semibold hover:underline">{{ post.title }}
            </NuxtLink>
            <p class="my-1 text-gray-600"><fa-icon icon="fa-solid fa-clock-rotate-left" class="mr-2" />{{
              $moment(post.created_at).fromNow() }}</p>
            <NuxtLink :to="'/posts/' + post.slug" class="text-gray-600" v-html="post.body">
            </NuxtLink>
          </div>
          <NuxtLink :to="'/posts/' + post.slug" class="md:col-span-5 h-fit">
            <img v-if="post.image" :src="post.image" alt="" class="w-full h-40 object-cover object-center rounded-lg"
              loading="lazy">
          </NuxtLink>
          <div class="md:col-span-7 flex justify-between items-center text-lg mt-2 md:pr-3">
            <div class="flex gap-6 items-center">
              <div>
                <LikeButton type="post" :post-id="post.id" :is-liked="post.liked" :likes-count="post.likes_count"
                  @show-likes="openLikes(`/api/posts/${post.id}/likes`)" @change-like="resetLikes = true" />
              </div>
              <BookmarkButton :post-id="post.id" :isBookmarked="post.bookmarked" />
            </div>
          </div>
        </div>
      </div>
      <div class="loader mx-auto mt-4 mb-6" v-if="$fetchState.pending"></div>
    </div>
    <span class="loadMoreIntersect"></span>
    <Modal v-show="showLikes" :show="showLikes" @close-modal="showLikes = false" :type="modalType" :link="modalLink"
      @change-like="(data) => allPosts.find((post) => post.id == data.postId).likes = data.likes" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      initialUrl: this.initialLink,
      posts: {},
      showLikes: false,
      postId: null,
      resetLikes: false,
      modalType: 'likes',
      modalLink: '',

      // Share button
      sharePostId: null,

      loading: false,
    }
  },
  props: ['initialLink', 'fullWidth', 'title', 'process'],
  methods: {
    openLikes(link) {
      this.modalLink = link
      this.modalType = 'likes'
      this.showLikes = true
    },
    loadMorePosts() {
      if (this.posts.links?.next) this.$fetch()
    }
  },
  async fetch() {
    if (!this.posts.links?.next) {
      if (this.initialLink) {
        this.posts = await this.$axios.$get(this.initialUrl)
        this.posts.data = this.posts.data.map(post => ({
          ...post,
          likes_count: post.likes.length,
          liked: !!(post.likes.find(like => this.$auth.user?.id == like.user_id)),
          bookmarked: this.$route.path == '/bookmarks' ? true : post.bookmarked
        }))
        this.initialUrl = null
      }
      return
    }
    const posts = await this.$axios.$get(this.posts.links.next)
    posts.data = posts.data.map(post => ({
      ...post,
      likes_count: post.likes.length,
      liked: !!(post.likes.find(like => this.$auth.user?.id == like.user_id))
    }))
    this.posts.data = [...this.posts.data, ...posts.data]
    this.posts.links = posts.links
    this.posts.meta = posts.meta
  },
  fetchOnServer: false,
  fetchKey: 'load-posts',
  mounted() {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting && !this.$fetchState.pending) this.loadMorePosts()
    }), {
      rootMargin: "-150px 0px 0px 0px"
    })
    observer.observe(document.querySelector('.loadMoreIntersect'))
  }
}
</script>