<template lang="pug">
  .verify(v-if="isDataReady")
    .text
      | <b>{{user.firstName}}</b>, you are invited to join <b>{{team != null ? team.name : "Silverchat Admin"}}</b>
      br
      span(v-if="user.role != null") Role: {{user.role}} <br/>
    .text Please create your password
    form(@submit.prevent="submit")
      input(v-model="password" type="password" id="password")
      label(for="password") Password
      input(v-model="repeatPassword" type="password" id="repeatPassword")
      label(for="repeatPassword") Repeat Password
      button(type="submit") Submit
  .error(v-else-if="errorMessage != null") {{errorMessage}}
</template>

<script>
import { apiRequest } from '~/src/lib/api.js';
import store from "store";

export default {
  data() {
    return {
      user: null,
      team: null,
      isDataReady: false,
      password: "",
      repeatPassword: "",
      errorMessage: null
    }
  },
  async created() {
    try {
      let {user, team} = await apiRequest("get-info-from-verif-token", {
        verificationToken: this.$route.params.verificationToken
      });
      this.user = user;
      this.team = team;

      this.isDataReady = true;
    } catch (e) {
      this.errorMessage = e.response.data;
    }
  },
  methods: {
    async submit() {
      if (this.password != this.repeatPassword || this.password == null) {
        return ;
      }

      await apiRequest("verify", {
        verificationToken: this.$route.params.verificationToken,
        password: this.password
      });

      let {authToken} = await apiRequest("login", {
        email: this.user.email,
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
  .Verify {
    width: 250px;
    flex-direction: column;
  }
  .text {
    margin-bottom: 30px;
    color: hsla(0, 0%, 90%, 1)
  }
  input {
    width: 100%;
    background: transparent;
    border: 0;
    border-bottom: 2px solid #fff;
    height: 24px;
    margin-bottom: 4px;
    color: white;
  }
  label {
    display: block;
    margin-bottom: 16px;
  }

  button {
    width: 100%;
    background: white;
    color: hsla(0, 0%, 10%, 1);
    border: 0;
    height: 50px;
    font-weight: bold;
    font-size: 22px;
    margin-top: 20px;
    border-radius: 4px;
  }

</style>