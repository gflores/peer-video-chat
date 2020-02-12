<template lang="pug">
  .admin-layout(v-if="isDataReady")
    div
      router-link(to="/admin") Admin Space 
      | - Welcome {{store.user.firstName}}
      .nav-item(@click="logout") Logout
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

    if (this.store.user == null || this.store.user.isAdmin != true) {
      this.$router.push("/login");
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
  .admin-layout {
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