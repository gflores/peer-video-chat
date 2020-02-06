<template lang="pug">
  .login
    .text Welcome back !
    form(@submit.prevent="submit")
      input(v-model="email" id="email")
      label(for="email") Email
      input(v-model="password" type="password" id="password")
      label(for="password") Password
      button(type="submit") Login
      .error(v-if="errorMsg != null") {{errorMsg}}
</template>

<script>
import { apiRequest } from '~/src/lib/api.js';
import store from "store";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMsg: null
    }
  },
  methods: {
    async submit() {
      if (this.password == "" || this.email == "") {
        console.log("invalid");
        return ;
      }
      try {
        let {authToken} = await apiRequest("login", {
          email: this.email,
          password: this.password
        });

        console.log("authToken: ", authToken);
        store.set('authToken', authToken);
        this.$router.push("/");
      } catch (e) {
        this.errorMsg = "Invalid email/password combination"
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    width: 250px;
    flex-direction: column;
  }
  .text {
    margin-bottom: 30px;
  }
  input {
    width: 100%;
    background: transparent;
    border: 0;
    border-bottom: 2px solid #fff;
    height: 24px;
    margin-bottom: 4px;
  }
  label {
    display: block;
    margin-bottom: 16px;
  }

  button {
    width: 100%;
    background: #08a608;
    color: white;
    border: 0;
    height: 50px;
    font-weight: bold;
    font-size: 22px;
    margin-top: 20px;
    border-radius: 4px;
  }
  .error {
    margin-top: 10px;
    color: hsla(0, 100%, 95%, 1);
    font-size: 20px;
  }
</style>