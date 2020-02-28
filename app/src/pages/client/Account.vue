<template lang="pug">
  .account
    .title Account

    .content
      button.logout(@click="logoutUser()") Logout

</template>

<script>

export default {
  data(){
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    font-size: 30px;
    font-weight: bold;
    margin: 20px 0px 40px;
    align-self: normal;
  }

  .account {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 0px 20px;
    flex-direction: column;
  }
  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button {
    outline: 0;
    width: calc(100%);
    color: white;
    font-size: 22px;
    font-weight: 700;
    background: hsla(120, 91%, 34%, 1);
    border: 0;
    border-radius: 4px;
    height: 45px;
    display: block;
    max-width: 260px;

    &.logout {
      color: white;
      background: grey;
    }

  }
</style>