<template lang="pug">
  section sup brah
    .create
      input(v-model="newRoomName")
      button(@click="clickCreateNewRoom()") Create New
    .list
      .item(v-for="room in rooms")
       router-link(:to="`play/${room.socketRoomId}/client/preview`") {{room.socketRoomId}}
       | &#32;
       router-link(:to="`play/${room.socketRoomId}/admin`") _@

    
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