<template lang="pug">
  .verify
    p Login
    input(v-model="email" placeholder="email")
    input(v-model="password" type="password" placeholder="password")
    button(@click="submit") Login
</template>

<script>
import { apiRequest } from '~/src/lib/api.js';
import store from "store";

export default {
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    async submit() {
      if (this.password == "" || this.email == "") {
        console.log("invalid");
        return ;
      }
      let {authToken} = await apiRequest("login", {
        email: this.email,
        password: this.password
      });

      console.log("authToken: ", authToken);
      store.set('authToken', authToken);
      this.$router.push("/");
    }
  }
}
</script>

<style lang="scss" scoped>

</style>