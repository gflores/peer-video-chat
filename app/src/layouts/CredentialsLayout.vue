<template lang="pug">
  .credentials-layout
    .top
      .logo
        span.silver Silver
        span.chat chat
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
    color: #26292c;
  }
  .top {
    padding-bottom: 30px;
    box-sizing: border-box;
    background-image: white;
    min-height: 93%;
    display: flex;
    flex-direction: column;
    align-items: center;

    // @media only screen and (min-width: 720px) {
    //   height: 70.41485%;
    // }


    .logo {
      margin-top: 60px;
      font-family: 'PantonBlack';
      font-size: 45px;

      .silver {
        color: #515f6b;
      }
      .chat {
        color: #26bf26;
      }

    }
    .content {
      margin-top: 50px;
    }
  }
  .bottom {
    background: hsla(210, 14%, 6%, 1);
    height: 7%;
    // @media only screen and (min-width: 720px) {
    //   height: 29.58515%;
    // }
  }
</style>
