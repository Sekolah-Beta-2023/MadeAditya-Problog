<script>
export default {
  data() {
    return {
      bookmarked: this.isBookmarked,
      delayId: null,
      bookmarkAnimation: false,
    }
  },
  methods: {
    bookmark() {
      if (!this.$auth.loggedIn) return this.$router.push('/auth')
      this.bookmarked = !this.bookmarked
      this.bookmarkAnimation = this.bookmarked
      if (this.delayId) {
        clearTimeout(this.delayId)
      }
      this.delayId = setTimeout(() => {
        const formData = new FormData()
        formData.append('bookmark', this.bookmarked)
        this.$axios.$post(`/api/posts/${this.postId}/bookmarks`, {
          bookmark: this.bookmarked
        }, { progress: false }).then(res => this.delayId = null)
        // emit('changebookmark')
      }, 500)
    }
  },
  props: ['postId', 'isBookmarked', 'customClass']
}
</script>
<template>
  <div class="relative" :class="customClass" @click="bookmark()">
    <fa-icon :icon="`fa-${bookmarked ? 'solid' : 'regular'} fa-bookmark`"
      class="bookmark-icon cursor-pointer transition-all duration-200" :class="{ 'bookmarked': bookmarkAnimation }" />
    <!-- <Transition>
      <div
        class="px-2 py-1.5 absolute top-full bg-white border w-[150px] text-center text-sm rounded-md -translate-x-1/2 left-1/2"
        v-if="bookmarkAnimation">
        Post
        bookmarked
      </div>
    </Transition> -->
  </div>
</template>
<style scoped>
.bookmarked {
  animation: like 0.5s ease;
}

@keyframes like {
  0% {
    transform: scale(1);
  }

  90% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1.1);
  }
}
</style>