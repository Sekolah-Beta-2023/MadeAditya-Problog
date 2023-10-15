<script>
export default {
  data() {
    return {
      show: false
    }
  },
  props: ['name', 'placeholder', 'value', 'error'],
  emits: ['input']
}
</script>
<template>
  <div class="relative">
    <input :type="show ? 'text' : 'password'" :name="name" :id="name" :placeholder="placeholder" :value="value"
      @input="$emit('input', $event.target.value)" :class="{ 'border-red-600': error }"
      class="block w-full mt-2 pl-3 pr-11 py-2 rounded-md border focus:outline-none focus:border-blue-600">
    <fa-icon :icon="'fa-regular ' + (show ? 'fa-eye' : 'fa-eye-slash')"
      class="absolute right-3 top-[calc(50%-10px)] w-5 h-5 cursor-pointer" :class="{ 'top-[calc(50%-24px)]': error }"
      @click="show = !show" />
    <div class="text-red-600 mt-1" v-if="error">{{ error }}</div>
  </div>
</template>