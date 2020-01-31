<template lang="pug">
  .dashboard
    .admins(v-for="admin in admins")
      .admin {{admin.firstName}} {{admin.lastName}} {{admin.email}} {{admin.isVerified ? "" : "-UNVERIFIED-"}}
        button(@click="deleteUser(admin)") delete

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
      admins: []
    }
  },
  created() {
    this.getAdmins();
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
    async getAdmins() {
      let {users} = await apiRequest("admin/get-admins")
      this.admins = users;
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

</style>