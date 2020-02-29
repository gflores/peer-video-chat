<template lang="pug">
  .portal
    .title Portal
    cPortal.content(:socketRoomId="store.mainRoom.socketRoomId")

</template>

<script>

import cPortal from "./c-portal.vue";

export default {
  components: {cPortal}
}
</script>

<style lang="scss" scoped>
  .portal {
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .title {
    font-size: 30px;
    font-weight: 600;
    margin: 20px 20px 40px;
    align-self: normal;

    @media only screen and (min-width: 768px) {
      margin: 30px 30px 45px;
    }

  }

  .content {
    max-width: 500px;
  }
</style>