<template lang="pug">
  .portal
    cPortal(:socketRoomId="store.mainRoom.socketRoomId")

</template>

<script>

import cPortal from "./c-portal.vue";

export default {
  components: {cPortal}
}
</script>

<style>
  .portal {
    height: 100%;
    width: 100%;
    max-width: 500px;
  }

</style>