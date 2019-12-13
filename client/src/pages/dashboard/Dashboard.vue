<template lang="pug">
  section sup brah
    .create
      input(v-model="newRoomName")
      button(@click="clickCreateNewRoom()") Create New
    .list
      .item(v-for="room in rooms") {{room.name}}
</template>

<script>
import { apiRequest } from '~/src/lib/api.js';

export default {
  data() {
    return {
      newRoomName: "",
      rooms: []
    };
  },
  async created() {
    await this.logAsGuestIf()

    await this.fetchAllData();
  },
  methods: {
    async clickCreateNewRoom() {
      await apiRequest("create-room", {name: this.newRoomName});
      await this.fetchAllData();
    },
    async fetchAllData() {
      let {rooms} = await apiRequest("list-rooms");

      this.rooms = rooms;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>