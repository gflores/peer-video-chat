<template lang="pug">
  .play-layout
    router-link(to="/test") Home
    br
    br
    component(v-bind:is="page")
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
