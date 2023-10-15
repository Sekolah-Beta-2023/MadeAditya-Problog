<template>
  <div class="py-6 sm:py-10 px-5 sm:px-16">
    <div class="flex justify-between gap-3 gap-y-5 items-center relative flex-wrap-reverse">
      <button v-show="!loadingImage" class="px-2 py-1.5 rounded-md hover:bg-gray-100 addCoverBtn mb-4"
        @click="coverTab = coverTab ? null : 'upload'"><fa-icon icon="fa-regular fa-image" class="mr-2" />Edit
        Cover</button>
      <span v-show="loadingImage" class="inline-block px-2 py-1.5 mb-4"><fa-icon icon="fa-solid fa-arrows-rotate"
          class="mr-2 animate-spin" />Processing</span>
      <div class="flex gap-2 sm:gap-4">
        <button class="px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white" @click="publish = true">Update
          Article</button>
      </div>
      <div v-show="coverTab" ref="coverMenu"
        class="w-[45rem] max-w-full rounded-md bg-white border shadow-md absolute top-full mt-3 z-10">
        <div class="px-5 py-3 border-b flex gap-2 justify-between items-center">
          <div class="flex gap-5">
            <a href="#" class="hover:text-blue-500" :class="{ 'text-blue-500': coverTab == 'upload' }"
              @click.prevent="coverTab = 'upload'">Upload</a>
            <a href="#" class="hover:text-blue-500" :class="{ 'text-blue-500': coverTab == 'unsplash' }"
              @click.prevent="coverTab = 'unsplash'">Unsplash</a>
          </div>
          <button @click="coverTab = null"
            class="w-8 h-8 rounded-md hover:bg-gray-100 flex justify-center items-center -m-1.5"><fa-icon
              icon="fa-solid fa-xmark" class="text-xl" /></button>
        </div>
        <div class="p-5 max-h-[16rem] overflow-y-auto">
          <!-- Upload image cover -->
          <div v-show="coverTab == 'upload'" ref="dropZoneRef"
            class="rounded-md border w-full h-[10rem] flex justify-center items-center">
            <div class="text-center">
              <button class="px-3 py-1.5 rounded-md border hover:bg-gray-100" @click="uploadCover()"><fa-icon
                  icon="fa-solid fa-upload" class="mr-2" />Upload image</button>
              <input type="file" class="hidden cover-file-input" accept="image/*"
                @change="form.imageCoverFile = $event.target.files[0]">
              <!-- <p class="text-gray-600 mt-2">Or drop your image here</p> -->
            </div>
          </div>
          <!-- Unsplash image -->
          <div v-show="coverTab == 'unsplash'">
            <form @submit.prevent="searchUnsplash()" class="flex gap-3 mb-3">
              <input type="text"
                class="flex-grow block px-3 py-1.5 rounded-md border focus:outline-none focus:border-blue-600"
                ref="searchImagesInput" placeholder="Search images" v-model="searchImagesInput">
              <button class="px-3 py-1.5 rounded-md bg-blue-600 text-white">Search</button>
            </form>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="img in unsplash.data?.results">
                <img :src="img.urls.thumb" @click="chooseUnsplash(img)" :alt="img.description"
                  class="w-full rounded-md h-[8rem] border hover:border-blue-500 cursor-pointer">
                <div class="mt-0.5">by <strong>{{ img.user.name }}</strong></div>
              </div>
            </div>
            <div class="loadMoreImage"></div>
          </div>
        </div>
      </div>
    </div>
    <button v-if="form.imageCover" v-show="!loadingImage" @click="showCover = !showCover" type="button"
      class="px-2 py-1.5 rounded-md hover:bg-gray-100"><fa-icon
        :icon="['fa-regular', (showCover ? 'fa-eye' : 'fa-eye-slash')]" class="mr-2" />{{ showCover ? 'Hide' : 'Show'
        }}
      cover</button>
    <div class="relative mt-2" v-show="form.imageCover && showCover && !loadingImage">
      <img v-if="form.imageCover" :src="form.imageCover" @load="loadingImage = false" alt=""
        class="image-cover w-full h-[15rem] md:h-[25rem] object-cover object-center rounded-md">
      <div v-if="choosedUnsplash" class="absolute bottom-5 left-5 px-5 py-3 inline-block rounded-md bg-gray-200">Photo
        by <a :href="choosedUnsplash.user.links.html" target="_blank" class="underline">{{ choosedUnsplash.user.name
        }}</a> on
        <a href="https://unsplash.com" target="_blank" class="underline">Unsplash</a>
      </div>
      <button
        class="absolute top-5 right-5 w-10 h-10 rounded-md bg-gray-400 bg-opacity-50 flex justify-center items-center text-2xl"
        title="Remove cover" @click="form.imageCoverFile = null; form.imageCover = null"><fa-icon
          icon="fa-solid fa-xmark" /></button>
    </div>
    <input type="text" id="title" class="text-4xl font-semibold block mt-10 mb-7 w-full focus:outline-none"
      placeholder="Article title..." v-model="form.title">
    <!-- <textarea name="body" id="body" rows="16" class="block w-full text-xl focus:outline-none"
          placeholder="Start writing..."></textarea> -->
    <ckeditor-nuxt v-model="form.body" :config="editorConfig" row="12" />

    <div class="fixed w-[30rem] top-0 bottom-0 right-0 bg-white shadow-xl z-30" v-if="publish">
      <div class="flex p-5 border-b justify-between items-center">
        <button @click="publish = false"
          class="w-9 h-9 rounded-md hover:bg-gray-100 flex justify-center items-center -m-1.5"><fa-icon
            icon="fa-solid fa-xmark" class="text-2xl" /></button>
        <button class="px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600" v-if="!form.processing"
          @click="submitArticle()">Update</button>
        <button class="px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          v-if="form.processing">Processing...</button>
      </div>
      <div class="p-5">
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Article Stats</h3>
          <p>{{ stats.characters }} characters, {{ stats.words }} words</p>
        </div>
        <div class="mb-6">
          <label class="text-lg font-medium">Slug</label>
          <input type="text" class="px-3 py-2 rounded-md border mt-2 mb-1.5 block w-full" v-model="form.slug">
          <small class="text-gray-600" v-if="form.slug">Article link: https://problog.com/posts/{{ form.slug }}</small>
        </div>
        <SelectTag v-model="form.tags" placeholder="Search tags" />
      </div>
    </div>
  </div>
</template>
<script>
import SelectTag from '~/components/SelectTag.vue'
export default {
  components: {
    'ckeditor-nuxt': () => { if (process.client) { return import('@blowstack/ckeditor-nuxt') } },
    SelectTag
  },
  middleware: 'auth',
  layout: 'dashboard',
  data() {
    return {
      publish: false,
      showCover: true,
      coverMenu: null,
      coverTab: null,
      unsplash: {
        query: 'programming',
        page: 1,
        data: null
      },
      searchImagesInput: null,
      choosedUnsplash: null,
      loadingImage: false,
      submitConfirm: null,
      stats: null,
      editorConfig: {
        removePlugins: ['Title',],
        placeholder: 'Start write something...',
        wordCount: {
          onUpdate: this.updateStats
        },
        simpleUpload: {
          uploadUrl: 'http://127.0.0.1:8000/api/dashboard/image',
          withCredentials: true,
          headers: {
            // 'X-CSRF-TOKEN': page.props.csrf_token,
            Authorization: this.$auth.$storage._state['_token.local']
          }
        }
      }
    };
  },
  async asyncData({ params, $axios }) {
    const post = await $axios.$get('/api/dashboard/posts/' + params.id)
    return {
      post, form: {
        title: post.title,
        body: post.body,
        imageCover: post.image_cover,
        imageCoverFile: null,
        tags: post.tags,
        slug: post.slug,
        processing: false
      },
    }
  },
  computed: {
    currentTitle() {
      return this.form.title
    },
    currentCover() {
      return this.form.imageCoverFile
    }
  },
  watch: {
    currentTitle(title) {
      this.form.slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
    },
    currentCover(newFile) {
      URL.revokeObjectURL(this.form.imageCover)
      this.form.imageCover = newFile ? URL.createObjectURL(newFile) : null
      this.coverTab = null
      this.loadingImage = !!newFile
      if (newFile) this.choosedUnsplash = null
    },
    async coverTab(tab) {
      Object.assign(this.unsplash, { query: 'programming', page: 1, data: {} })
      this.searchImagesInput = ''
      if (tab == 'unsplash') {
        this.unsplash.data = await this.fetchUnsplash()
      }
    },
  },
  methods: {
    async fetchUnsplash() {
      return (await this.$axios.$get(`https://api.unsplash.com/search/photos/?client_id=EtewKfdVqjLFqhcr3-4A5Y5Nld7nUByq9wlRuJOLlwQ&query=${this.unsplash.query}&page=${this.unsplash.page}`))
    },
    async searchUnsplash() {
      this.unsplash.page = 1
      this.unsplash.query = this.searchImagesInput
      this.unsplash.data = await this.fetchUnsplash()
    },
    chooseUnsplash(img) {
      this.choosedUnsplash = img
      this.form.imageCover = img.urls.full
      this.loadingImage = true
      this.coverTab = null
    },
    uploadCover() {
      document.querySelector('.cover-file-input').click()
    },
    updateStats(data) {
      this.stats = data
    },
    async submitArticle() {
      const emptyField = !this.form.title ? 'title' : (!this.form.body ? 'content' : (!this.form.tags.length ? 'tags' : null))
      if (confirm(!this.form.tags.length
        ? 'Are you sure to publish this article without tags? You can add relevant tags to your article to help reader to find your article in choosed topics (If you click ok, it will published without tags)'
        : 'Are you sure want to publish this article?')) {
        this.$axios.$get('/sanctum/csrf-cookie').then(() => {
          this.$axios.$put(`/api/dashboard/posts/${this.post.id}`, {
            ...this.form,
          }).then(res => {
            this.$router.push('/posts/' + res.post.slug)
          }).catch(err => err)
        })
      }
    },
  },
  mounted() {
    const observer = new IntersectionObserver(entries => entries.forEach(async entry => {
      if (entry.isIntersecting && this.unsplash.data) {
        if ((this.unsplash.page + 1) <= this.unsplash.data.total_pages) {
          this.unsplash.page++
          const data = await this.fetchUnsplash()
          const images = [...this.unsplash.data.results, ...data.results]
          this.unsplash.data = data
          this.unsplash.data.results = images
        }
      }
    }), {
      rootMargin: "-150px 0px 0px 0px"
    })
    observer.observe(document.querySelector('.loadMoreImage'))
  },
}
</script>