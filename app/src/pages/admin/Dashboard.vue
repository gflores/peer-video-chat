<template lang="pug">
  .dashboard
    h2 Teams
    .teams
      .team(v-for="team in teams")
        router-link(:to="'/admin/teams/' + team._id") {{team.name}}
    input(v-model="teamName" placeholder="name")
    button(@click="createTeam") Create Team

    h2 Demos
    router-link(to="/admin/demo/booking") Booking Demo

    h2 Admins
    .admins
      .admin(v-for="admin in admins") {{admin.firstName}} {{admin.lastName}} {{admin.email}} {{admin.isVerified ? "" : "-UNVERIFIED-"}}
        button(@click="deleteUser(admin)") delete

    h3 Invite new Admin
    input(v-model="email" placeholder="email")
    input(v-model="firstName" placeholder="first name")
    input(v-model="lastName" placeholder="last name")
    button(@click="inviteAdmin") Invite Admin


</template>

<script>
import { apiRequest } from '~/src/lib/api.js'

export default {
  data() {
    return {
      email: "",
      firstName: "",
      lastName: "",
      admins: [],
      teamName: "",
      teams: []
    }
  },
  async created() {
    await Promise.all([
      this.getAdmins(),
      this.getTeams()
    ]);
  },
  methods: {
    async inviteAdmin() {   
      await apiRequest("admin/invite-admin", {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
      });

      this.email = "";
      this.firstName = "";
      this.lastName = "";

      await this.getAdmins();
    },
    async createTeam() {   
      await apiRequest("create-team", {
        name: this.teamName,
      });

      this.teamName = "";

      await this.getTeams();
    },
    async getAdmins() {
      let {users} = await apiRequest("admin/get-admins")
      this.admins = users;
    },
    async getTeams() {
      let {teams} = await apiRequest("admin/get-teams")
      this.teams = teams;
    },
    async deleteUser(user) {
      if (user.firstName == "Gael" || user.firstName == "Julius") {
        return ;
      }
      await apiRequest("admin/delete-user", {id: user._id});
      await this.getAdmins();
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    padding: 20px;
  }
  h2 {
    margin-top: 20px;
  }

  .team {
    margin-bottom: 10px;
  }
  .teams, .admins {
    margin-left: 20px;
  }
</style>