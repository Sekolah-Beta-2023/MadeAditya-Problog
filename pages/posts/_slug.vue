<template>
  <div class="pt-20 pb-8 md:pt-20 md:px-16 lg:px-52" v-if="post">
    <div class="flex flex-col-reverse md:flex-col gap-y-6">
      <img v-if="post.image" :src="post.image" alt="" class="w-full h-[16rem] md:h-[27rem] object-cover object-center">
      <div class="px-4">
        <h1 class="text-4xl font-semibold text-center">{{ post.title }}</h1>
        <div class="flex justify-center gap-5 mt-5 items-center flex-wrap sm:flex-nowrap">
          <a href="#" class="user flex gap-2 items-center">
            <img :src="post.user.picture" alt="" class="w-10 h-10 sm:w-14 sm:h-14 rounded-full" loading="lazy">
            <h4 class="font-medium sm:text-xl text-gray-800">{{ post.user.name }}</h4>
          </a>
          <span class="text-gray-600 text-3xl font-extralight hidden sm:block">|</span>
          <div class="text-gray-600 sm:text-xl">{{ $moment(post.created_at).fromNow() }}</div>
        </div>
      </div>
    </div>
    <div class="mt-8 text-xl leading-8 px-6" ref="header" v-html="post.body">
    </div>
    <div class="px-6">
      <div
        class="w-fit mx-auto bg-white rounded-full border border-gray-300 grid grid-cols-2 justify-center items-center my-6"
        ref="sticky">
        <div class="py-2 px-4 hover:bg-gray-300 border-r rounded-l-full flex items-center gap-2 pl-6 text-center">
          <LikeButton type="post" :post-id="post.id" :is-liked="post.liked" :likes-count="post.likes_count"
            @show-likes="openLikes(`/api/posts/${post.id}/likes`)" @change-like="resetLikes = true" />
        </div>
        <BookmarkButton :post-id="post.id" :bookmarked="post.bookmarked"
          class="py-2 px-4 hover:bg-gray-300 rounded-r-full pr-6 cursor-pointer text-center" />
      </div>
      <div class="px-12 flex gap-3 justify-center items-center flex-wrap">
        <NuxtLink :to="'/tags/' + tag.slug" v-for="tag in post.tags" :key="tag.slug"
          class="px-2 py-1.5 bg-gray-200 border border-gray-300 rounded-lg text-gray-500 font-medium">{{ tag.tag }}
        </NuxtLink>
      </div>
      <Comments v-show="showComment" :show="showComment" :post-id="post.id" @close-comment="showComment = false"
        :dataCount="post.comments" @post-comment="commentsCount++"
        @show-likes="(link) => { modalLink = link; modal = true; }" />
    </div>
    <Modal v-show="showLikes" :show="showLikes" @close-modal="showLikes = false" :type="'likes'"
      :link="`/api/posts/${post.id}/likes`" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      post: null,
      showLikes: false,
      showComment: false,
      commentsCount: 0,
    }
  },
  layout: 'main',
  methods: {
    openLikes(link) {
      this.modalLink = link
      this.modalType = 'likes'
      this.showLikes = true
    },
    openComments() {
      this.showComment = true
    }
  },
  async asyncData({ params, $axios, $auth }) {
    const post = (await $axios.$get(`/api/posts/${params.slug}`)).data
    post.likes_count = post.likes.length
    post.liked = !!(post.likes.find(like => $auth.user?.id == like.user_id))
    return { post }
  },
  mounted() {
    const stickyTop = this.$refs.sticky.offsetTop
    const headerTop = this.$refs.header.offsetTop
    window.onscroll = () => {
      if ((window.scrollY + window.innerHeight) > (headerTop + 40)) {
        this.$refs.sticky.classList.remove('translate-y-20')
      } else {
        this.$refs.sticky.classList.add('translate-y-20')
      }
      if ((window.scrollY + window.innerHeight) < (stickyTop + this.$refs.sticky.offsetHeight + 24)) {
        this.$refs.sticky.classList.add('sticky-menu')
        this.$refs.header.classList.add('mb-20')
      } else {
        this.$refs.sticky.classList.remove('sticky-menu')
        this.$refs.header.classList.remove('mb-20')
      }
    }
  }
}
</script>
<style>
.ck-editor__editable {
  min-height: 80px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter {
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.sticky-menu {
  @apply fixed bottom-4 w-fit inset-x-0 mx-auto shadow-md transition-all duration-300;
}

figure.image img {
  margin: auto;
}
</style>