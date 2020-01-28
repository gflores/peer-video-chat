<template lang="pug">
  .play-client
    .client


</template>

<script>
export default {
  mounted() {
    Silverchat.init({roomId: this.$route.params.socketRoomId, selector: ".client"});
  }
}
</script>

<style lang="scss" scoped>
</style>