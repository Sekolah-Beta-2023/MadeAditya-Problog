<script>
export default {
  data() {
    return {
      data: null,
      loading: true,
      modalType: this.type,
      id: null,
      no_result: false,
    }
  },
  props: ['type', 'show', 'link'],
  async updated() {
    this.$fetch()
    // if (props.link && props.show) {
    //   type.value = props.type
    //   console.log(props.link)
    //   loading.value = true
    //   data.value = (await axios.get(props.link)).data
    //   console.log(data.value)
    //   loading.value = false
    //   no_result.value = data.value.length < 1
    // }
  },
  watch: {
    show(val) {
      // console.log(this.tyoe, this.link)
      if (!val) return
      this.$fetch()
    }
  },
  async fetch() {
    if (this.link && this.show) {
      // type.value = props.type
      // loading.value = true
      this.data = await this.$axios.$get(this.link)
      console.log(this.data)
      // loading.value = false
      this.no_result = this.data.length < 1
    }
  },
  fetchOnServer: false
}
</script>
<template>
  <Transition name="modal" appear>
    <div class="modal fixed inset-0 bg-[rgba(0,0,0,0.5)] py-20 px-8 z-[100]" @click="$emit('close-modal')">
      <div
        class="w-[35rem] modal-box bg-white max-w-full mx-auto rounded-md border border-gray-300 transition duration-300 h-full overflow-y-hidden"
        @click.stop="">
        <div class="modal-header py-3 px-5 relative">
          <!-- <slot name="modal-header"></slot> -->
          <h2 class="text-2xl font-medium text-center">{{ type.charAt(0).toUpperCase() + type.slice(1) }}</h2>
          <div
            class="close-btn w-9 h-9 p-1.5 rounded cursor-pointer hover:bg-gray-100 text-center absolute top-[50%] right-4 translate-y-[-50%]"
            @click="$emit('close-modal')">
            <fa-icon icon="fa-solid fa-xmark" size="xl" />
          </div>
        </div>
        <div class="modal-content p-5 border-t border-gray-300 h-[calc(100%-1.75rem*2)] overflow-y-auto">
          <div v-if="!$fetchState.pending">
            <div>
              <div class="flex justify-between items-center mt-3 first:mt-0 flex-wrap gap-y-2" v-for="like in data">
                <Link :href="'/@' + like.user.username" class="user flex gap-2 items-center">
                <img :src="like.user.picture" alt="" class="w-12 h-12 rounded-full" loading="lazy">
                <div>
                  <h4 class="font-medium">{{ like.user.name }}</h4>
                  <p class="text-gray-600 text-sm">@{{ like.user.username }}</p>
                </div>
                </Link>
                <div>
                  <!-- <FollowButton @follow="(followed) => $emit('followed', { id: like.user.id, followed })"
                    class="w-[92px] text-center px-2 py-1.5 rounded-md border hover:bg-gray-100" :data-id="like.user.id"
                    :followed="like.followed" v-if="like.user.id != page.props.user.id" type="user">
                    <template #default>Follow</template>
                    <template #followed>Followed</template>
                  </FollowButton> -->
                </div>
              </div>
            </div>
          </div>
          <div class="loader my-5 mx-auto" v-if="$fetchState.pending"></div>
          <div class="my-5 text-center text-lg font-medium" v-if="!$fetchState.pending && no_result">No {{ type }} yet
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
<style>
.modal-enter-active,
.modal-leave-active {
  transition: all 150ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.10);
}

.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition: all 150ms ease-in-out;
}
</style>