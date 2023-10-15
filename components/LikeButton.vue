<script>

export default {
  data() {
    return {
      liked: this.isLiked,
      delayId: null,
      likes: this.likesCount,
      likeAnimation: false,
    }
  },
  props: ['postId', 'likesCount', 'isLiked', 'type'],
  computed: {
    rawLikes() {
      return this.likes
    }
  },
  methods: {
    like() {
      if (!this.$auth.loggedIn) return this.$router.push('/auth')
      this.liked = !this.liked
      this.liked ? this.likes++ : this.likes--
      this.likeAnimation = this.liked
      if (this.delayId) {
        clearTimeout(this.delayId)
      }
      this.delayId = setTimeout(() => {
        if (this.type == 'post') {
          console.log(this.liked)
          this.$axios.$post(`/api/posts/${this.postId}/likes`, {
            like: this.liked,
            userId: this.$auth.user?.id
          }, { progress: false }).then(res => {
            this.delayId = null
            // console.log(res)
          })
          this.$emit('changeLike')
        }
      }, 500)
    },
  }
}
</script>
<template>
  <div>
    <fa-icon :icon="`fa-${liked ? 'solid' : 'regular'} fa-heart`"
      class="like-icon cursor-pointer transition-all duration-200"
      :class="{ 'liked': likeAnimation, 'text-red-600': liked }" @click="like()" />
    <a href="#" class="hover:underline ml-1.5" @click.prevent="$emit('show-likes', { type });" v-if="likes > 0">{{
      likes
    }}</a>
  </div>
</template>
<style scoped>
.liked {
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