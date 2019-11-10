<template>
  <div class="play-layout">
    <component v-bind:is="page"></component>
  </div>
</template>

<script>

export default {
  props: ["page"],
  data() {
    return {
      show: true
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>
