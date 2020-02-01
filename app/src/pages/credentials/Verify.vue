<template lang="pug">
  .verify(v-if="isDataReady")
    p(v-if="team != null") Invited to {{team.name}}
    p role: {{user.role}}
    p Welcome {{user.firstName}}, please enter your password
    input(v-model="password" type="password" placeholder="password")
    input(v-model="repeatPassword" type="password" placeholder="confirm password")
    button(@click="submit") Submit
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

</style>