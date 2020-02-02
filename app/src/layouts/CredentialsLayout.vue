<template lang="pug">
  .credentials-layout
    .top
      .logo Silverchat
      .content
        component(v-bind:is="page")
    .bottom
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

<style lang="scss" scoped>
  @font-face {
      font-family: 'PantonBlack';
      src: url(/fonts/PantonBlack.otf)
  }
  .credentials-layout {
    position: absolute;
    width: 100%;
    height: 100%;
    color: white;
  }
  .top {
    background-image: linear-gradient(158deg, hsl(120, 91%, 34%), hsla(150, 67%, 49%, 1));
    height: 70.41485%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .logo {
      margin-top: 80px;
      font-family: 'PantonBlack';
      font-size: 45px;
    }
    .content {
      margin-top: 50px;
    }
  }
  .bottom {
    background: black;
    height: 29.58515%;
  }
</style>
