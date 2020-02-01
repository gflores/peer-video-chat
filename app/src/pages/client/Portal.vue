<template lang="pug">
  portal(:socketRoomId="store.room.socketRoomId")

</template>

<script>

import portal from "./c-portal.vue";

export default {
  components: {portal}
}
</script>

<style>

</style>