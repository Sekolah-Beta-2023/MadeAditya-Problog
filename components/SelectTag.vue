<script>
export default {
  data() {
    return {
      tech: '',
      searchTech: null,
      delayId: null,
    }
  },
  props: ['value', 'customClass', 'placeholder'],
  emits: ['input'],
  computed: {
    tags: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    async tech(val) {
      console.log(this.value)
      if (!val) return
      if (val.length < 2 && val !== '') {
        this.searchTech = null
      } else {
        if (this.delayId) {
          clearTimeout(this.delayId)
        }
        console.log(val)
        this.searchTech = (await this.$axios.$get('/api/tags?q=' + val)).data
        console.log(this.searchTech)
        // this.$axios.$get('/api/tags', { query: { search: val } }).then((res) => {
        //   this.searchTech = res.data
        //   console.log(this.searchTech)
        // })
      }
    }
  },
  methods: {
    addTech(topic) {
      console.log(this.tags)
      if (!this.tags?.some(t => t.slug == topic.slug)) this.tags.push(topic)
      this.searchTech = null
      this.tech = ''
    }
  },
}
</script>
<template>
  <div class="relative" :class="customClass">
    <div class="absolute top-20 left-0 w-full bg-white shadow-xl z-10" v-if="searchTech">
      <a href="#" class="block px-4 py-2 hover:bg-gray-100" v-for="tech in searchTech" @click.prevent="addTech(tech)">{{
        tech.tag }}</a>
    </div>
    <label class="font-medium" for="technologies">Select Tags</label>
    <input class="block w-full mt-2 px-3 py-2 rounded-md border focus:outline-none focus:border-blue-600"
      id="technologies" :placeholder="placeholder" v-model="tech">
    <div class="mt-3 flex gap-2 flex-wrap">
      <a href="#" @click.prevent="" class="px-2 py-1.5 rounded-md border border-blue-600 text-blue-600 text-sm"
        v-for="topic in value">{{ topic.tag }}<fa-icon icon="fa-solid fa-xmark" class="ml-1.5" size="lg"
          @click="tags.splice(tags.indexOf(topic), 1);" /></a>
    </div>
  </div>
</template>