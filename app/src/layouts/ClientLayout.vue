<template lang="pug">
  .client-layout(v-if="isDataReady")
    .header
      .team-name {{store.team.name}}
      .user-name Hi, {{store.user.firstName}} !

    .nav-bar
      .nav-item(@click="logout") Portal
      .nav-item(@click="logout") Setup
      .nav-item.last(@click="logout") Log out
    content
      component(v-bind:is="page")

</template>

<script>
export default {
  props: ["page"],
  data(){
    return {
      isDataReady: false
    };
  },
  async created() {
    await this.storeMyProfile();
    console.log("user: ", this.store.user);

    if (this.store.user == null || this.store.user.isGuest == true) {
      this.$router.push("/login");
    } else if (this.store.team == null && this.store.user.isAdmin == true) {
      this.$router.push("/admin");
    }
    this.isDataReady = true;
  },
  methods: {
    logout() {
      this.logoutUser();
    }
  }
}
</script>

<style lang="scss">
  @font-face {
      font-family: 'PantonBlack';
      src: url(/fonts/PantonBlack.otf)
  }
  .home {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .header {
    position: relative;
    display: flex;
    align-items: center;
    height: 32px;
    box-sizing: border-box;
    padding: 0px 16px;
    background: #26292c;
    color: hsla(210, 4%, 90%, 1);

    .team-name {
      font-family: 'PantonBlack';
      font-size: 18px;
      text-align: center;
    }

    .user-name {
      position: absolute;
      right: 16px;
    }

  }

  .nav-bar {
    position: relative;
    display: flex;
    align-items: center;
    height: 48px;
    box-sizing: border-box;
    // padding: 0 16px;
    background: hsla(210, 4%, 90%, 1);

    .nav-item {
      font-size: 18px;
      cursor: pointer;
      padding: 0 16px;
      height: 100%;
      display: flex;
      align-items: center;
      &:hover {
        background: lightgray;
      }

      &.last {
        position: absolute;
        right: 0;//16px;
        font-size: 16px;
      }
    }
  }
  content {
    height: calc(100% - 80px);
    width: 100%;
  }
</style>