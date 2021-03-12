<template>
  <div class="flex w-3/12 items-center justify-around">
    <button
      class="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md"
      @click="pageBackwards"
      v-if="page > 1"
    >
      Prev
    </button>
    <button
      v-if="showNextButton"
      class="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md"
      @click="pageForwards"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    page: Number,
    showNextButton: Boolean
  },
  methods: {
    pageForwards() {
      this.$emit("page-forwards");
    },
    pageBackwards() {
      this.$emit("page-backwards");
    }
  }
};
</script>
