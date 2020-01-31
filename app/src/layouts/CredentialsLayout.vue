<template>
  <component v-bind:is="page"></component>
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
