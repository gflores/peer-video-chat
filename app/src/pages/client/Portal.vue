<template lang="pug">
  .portal
    portal(:socketRoomId="store.room.socketRoomId")

</template>

<script>

import portal from "./c-portal.vue";

export default {
  components: {portal}
}
</script>

<style>
  .portal {
    height: 100%;
    width: 100%;
    max-width: 500px;
  }

</style>