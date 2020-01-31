<template lang="pug">
  .client-layout(v-if="isDataReady")
    div Client Space - Welcome {{store.user.firstName}}
      //- .nav-item(@click="logout") Logout
      //- component(v-bind:is="page")

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
    } else if (this.store.user.isAdmin == true) {
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
  .client-layout {
    position: relative;
  }
  .nav-item {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    padding: 5px;
    background: lightgray;
  }
</style>