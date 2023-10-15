<template>
  <!-- <Tutorial /> -->
  <div class="px-8 sm:px-36 py-8">
    <div class="flex gap-16 px-1 flex-wrap sm:flex-nowrap">
      <div>
        <h1 class="text-4xl sm:text-5xl my-8 font-semibold leading-normal">Write and share your stories in Problog</h1>
        <NuxtLink :to="$auth.loggedIn ? '/dashboard/posts/create' : '/auth'"
          class="px-5 py-2 rounded-full text-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
          <fa-icon icon="fa-solid fa-pen" class="mr-1"></fa-icon> Start Writing
        </NuxtLink>
      </div>
      <img src="~/assets/img/header.png" class="w-full sm:w-[60%]" alt="">
    </div>

    <div class="mt-12 flex gap-6">
      <div class="w-full lg:w-[70%] xl:w-[60%]">
        <div class="flex gap-10 items-center mb-4">
          <h2 class="text-3xl font-semibold">Recent Posts</h2>
          <NuxtLink to="/posts" class="px-5 py-1.5 rounded-full border hover:bg-gray-50 hidden xl:block">See all articles
          </NuxtLink>
        </div>
        <div class="rounded-md border">
          <div class="p-6 border-t first:border-t-0" v-for=" post in posts.data" :key="post.id">
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
                      @show-likes="openLikes(`/ api / posts / ${post.id} /likes`)" @change-like="resetLikes = true" />
                  </div>
                  <!-- <NuxtLink :to="'/posts/' + post.slug">
                    <fa-icon icon="fa-regular fa-comment" class="cursor-pointer" />
                    <span class="hover:underline ml-1.5" v-if="post.comments">{{ post.comments }}
                    </span>
                  </NuxtLink> -->
                  <BookmarkButton :post-id="post.id" :isBookmarked="post.bookmarked" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="trending hidden lg:block w-[40%]">
        <h2 class="text-3xl font-semibold mb-4">Trending</h2>
        <div class="rounded-md border">
          <div class="py-3">
            <div class="flex justify-between items-center px-5 mb-3">
              <h3 class="text-lg font-medium">Trending tags <fa-icon icon="fa-solid fa-tags" class="ml-1" /></h3>
              <NuxtLink to="/tags" class="px-5 py-1.5 rounded-full border hover:bg-gray-50 hidden xl:block">See all
              </NuxtLink>
            </div>
            <NuxtLink :to="'/tags/' + tag.slug" :key="tag.id"
              class="px-5 py-1.5 flex justify-between items-center hover:bg-gray-200" v-for="tag in tags">
              <span>{{ tag.tag }}</span>
              <span class="px-4 py-1.5 text-sm rounded-full bg-gray-100 border border-gray-200">+{{ tag.posts_count
              }}</span>
            </NuxtLink>
          </div>
          <div class="px-5 py-3 border-t">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-medium">Popular writers <fa-icon icon="fa-solid fa-user-pen" class="ml-1" /></h3>
              <NuxtLink to="/writers" class="px-5 py-1.5 rounded-full border hover:bg-gray-50 hidden xl:block">See all
              </NuxtLink>
            </div>
            <div class="flex justify-between items-center mt-3 flex-wrap gap-y-2" v-for="writer in writers">
              <div class="user flex gap-2 items-center">
                <img :src="writer.picture" alt="" class="w-12 h-12 rounded-full" loading="lazy">
                <div>
                  <h4 class="font-medium">{{ writer.name }}</h4>
                  <p class="text-gray-600 text-sm">@{{ writer.username }}</p>
                </div>
              </div>
              <div>
                <!-- <FollowButton class="w-[90px] text-center px-2 py-1.5 rounded-md border hover:bg-gray-100"
                  :data-id="writer.id" :isFollowed="writer.followed" type="user" v-if="writer.id != $auth.user?.id">
                  <template #default>Follow</template>
                  <template #followed>Followed</template>
                </FollowButton> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'main',
  data() {
    return {
      // posts: null
    }
  },
  async asyncData({ $axios }) {
    const posts = (await $axios.$get('/api/posts?sort=time'))
    const tags = (await $axios.$get('/api/tags-popular'))
    const writers = (await $axios.$get('/api/users/popular'))
    return { posts, tags, writers }
  }
}
</script>
