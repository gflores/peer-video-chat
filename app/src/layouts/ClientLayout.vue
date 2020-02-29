<template lang="pug">
  .client-layout(v-if="isDataReady")
    //- .header
    //-   .team-name {{store.team.name}}
    //-   .user-name Hi, {{store.user.firstName}}

    .nav-bar
      .top-section
        .team-name {{store.team.name}}
      router-link(to="/").nav-item(@click="logout") Portal
      router-link(to="/setup").nav-item(@click="logout") Install
      router-link(to="/account").nav-item(@click="logout") Account
      //- .nav-item.last(@click="logout") Log out
    .content
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

<style lang="scss" scoped>
  @font-face {
      font-family: 'PantonBlack';
      src: url(/fonts/PantonBlack.otf)
  }
  .client-layout {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  // .header {
  //   position: relative;
  //   display: flex;
  //   align-items: center;
  //   height: 32px;
  //   box-sizing: border-box;
  //   padding: 0px 16px;
  //   background: #26292c;
  //   color: hsla(210, 4%, 90%, 1);

  //   @media only screen and (min-width: 768px) {
  //     padding: 0px 48px;
  //   }

  //   .team-name {
  //     font-family: 'PantonBlack';
  //     font-size: 18px;
  //     text-align: center;
  //   }

  //   .user-name {
  //     position: absolute;
  //     right: 16px;
  //     @media only screen and (min-width: 768px) {
  //       right: 48px;
  //     }
  //   }
  // }

  .nav-bar {
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 5px 30px 0px, rgba(0, 0, 0, 0.05) 0px 3px 3px 0px;
    z-index: 9999;

    position: absolute;
    bottom: 0;
    width: 100%;
    height: 48px;

    display: flex;
    justify-content: space-between;

    box-sizing: border-box;
    // padding: 0 16px;
    // background: hsla(210, 4%, 90%, 1);
    background: hsl(210, 16%, 28%);
    color: hsla(210, 4%, 90%, 1); 

    @media only screen and (min-width: 768px) {
      width: 160px;
      height: 100%;
      flex-direction: column;
      justify-content: inherit;
    }

    .top-section {
      display: none;

      @media only screen and (min-width: 768px) {
        display: inherit;
        margin: 20px 0px 25px;
        padding-left: 15px;
        .team-name {
          font-family: 'PantonBlack';
          font-size: 16px;
          line-height: 1.1em;
        }
      }
    }

    .nav-item {
      color: hsla(210, 4%, 90%, 1);       
      font-size: 16px;
      cursor: pointer;
      // padding: 0 16px;
      // height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;

      @media only screen and (min-width: 768px) {
        // padding: 0px 48px;
        flex-grow: inherit;
        justify-content: inherit;
        padding-left: 15px;
        height: 40px;
        margin-top: 5px;
      }

      &:hover {
        color: white;
      }
      &.router-link-exact-active {
        background: hsla(210, 20%, 40%, 1);
        color: white;
      }
      // &.last {
      //   position: absolute;
      //   right: 0;//16px;
      //   font-size: 16px;
      // }
    }
  }
  .content {
    position: absolute;
    height: calc(100% - 48px);
    width: 100%;
    display: flex;
    justify-content: center;
    background: white;

    @media only screen and (min-width: 768px) {
      left: 160px;
      width: calc(100% - 160px);
      height: 100%;
    }
  }
  a {
    color: #26292c;
    text-decoration: none;
  }
</style>