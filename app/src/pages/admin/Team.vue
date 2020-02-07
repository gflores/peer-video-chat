<template lang="pug">
  .team(v-if="isDataReady")
    h2 {{team.name}}
    .users
      .user(v-for="user in users") <b>{{user.firstName}} {{user.lastName}}</b> {{user.email}}  ({{user.isVerified ? "" : "UNVERIFIED"}})

    h3 Invite new Member
    input(v-model="email" placeholder="email")
    input(v-model="firstName" placeholder="first name")
    input(v-model="lastName" placeholder="last name")

    br
    input(type="radio" id="member" value="member" v-model="role")
    label(for="member") Member
    br
    input(type="radio" id="manager" value="manager" v-model="role")
    label(for="manager") Manager
    br
    input(type="radio" id="owner" value="owner" v-model="role")
    label(for="owner") Owner
    br
    br

    button(@click="inviteMember") Invite Member

</template>

<script>
import { apiRequest } from '~/src/lib/api.js';

export default {
  data() {
    return {
      team: null,
      users: [],
      isDataReady: false,
      email: "",
      firstName: "",
      lastName: "",
      role: ""
    }
  },
  async created() {
    await Promise.all([
      this.getTeam()
    ]);
    this.isDataReady = true;
  },
  methods: {
    async getTeam() {
      let {team, users} = await apiRequest("admin/get-team", {
        id: this.$route.params.id
      });
      this.team = team;
      this.users = users;
    },
    async inviteMember() {
      let {team, users} = await apiRequest("admin/invite-member", {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
        teamId: this.$route.params.id
      });
      this.email = "";
      this.firstName = "";
      this.lastName = "";
      this.role = "";
      await this.getTeam();
    }
  }
}
</script>

<style lang="scss" scoped>

</style>