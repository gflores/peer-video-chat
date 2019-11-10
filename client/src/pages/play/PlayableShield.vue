<template lang="pug">
  .playable-shield
    .shield(v-if="playerData.canPlayShield" @click="playShield()") shield
</template>

<script>
export default {
  props: []
}
</script>

<style lang="scss">

</style>
