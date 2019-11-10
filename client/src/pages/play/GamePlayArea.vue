<template lang="pug">
  .gameplay-area
    .finished(v-if="store.isGameEnded") End of Game
    PlayerSide
</template>

<script>
import PlayerSide from "./PlayerSide";

export default {
  components: {
    PlayerSide
  }
}
</script>

<style>

</style>
