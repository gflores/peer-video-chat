<template lang="pug">
  section(v-if="isDataReady")
    div Room is {{room.name}}
    div(v-if="store.connectedConvo == null")
      p Not Connected to any room
      button(@click="joinRoom()") Join Room
    div(v-else)
      p You are connected to the room: {{store.connectedRoom.name}}
      video(muted="muted")
      button(@click="leaveRoom()") Leave Room

</template>

<script>
import { apiRequest, playRoomEmit, playRoomOn } from '~/src/lib/api.js';
import store from "store";
import SimplePeer from "simple-peer";

export default {
  data() {
    return {
      isDataReady: false,
      newRoomName: "",
      room: null,
    };
  },
  async created() {
    await this.logAsGuestIf()
    await this.fetchAllData();
    await playRoomEmit("setup-convos", {});
    await this.simplePeerSetup();
  },
  methods: {
    async fetchAllData() {
      let [__, {room}] = await Promise.all([
        this.storeConnectedRoom(),
        apiRequest("get-room", {socketRoomId: this.socketRoomId})
      ]);
      this.room = room;

      this.isDataReady = true;
    },
    async simplePeerSetup() {
      let peer = new SimplePeer({initiator: false, trickle: true});
      peer.on('stream', stream => {
        console.log("receveing the vid");
        // got remote video stream, now let's show it in a video tag
        var video = document.querySelector('video')
    
        if ('srcObject' in video) {
          video.srcObject = stream
        } else {
          video.src = window.URL.createObjectURL(stream) // for older browsers
        }
    
        video.play();
        video.muted = false
      });
      peer.on('error', err => console.log('error', err))
      peer.on('signal', signal => {
        console.log('SIGNAL:  ', JSON.stringify(signal))
        playRoomEmit("transmit-signal", {signal: signal})
      });

      playRoomOn("signal-emitted-to-client", ({signal}) => {
          peer.signal(signal);
      });

    },
    async joinRoom() {
      await apiRequest("client/join-convo", {
        socketRoomId: this.socketRoomId
        });
      await this.fetchAllData();
    },
    async leaveRoom() {
      await apiRequest("client/leave-convo", {});
      await this.fetchAllData();
    },
  },
  computed: {
    socketRoomId() {
      return this.$route.params.socketRoomId
    }
  }
}
</script>

<style lang="scss" scoped>

</style>