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

      div(v-if="incomingSignals.length > 0")
        p Someone is calling !
        button(@click="acceptCall()") Answer Call

</template>

<script>
import { apiRequest, playRoomEmit, playRoomOn } from '~/src/lib/api.js';
import store from "store";
import SimplePeer from "simple-peer";

let peer;

export default {
  data() {
    return {
      isDataReady: false,
      newRoomName: "",
      room: null,
      incomingSignals: []
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
      peer = new SimplePeer({initiator: false, trickle: false});
      peer.on('stream', stream => {
        console.log("receiving the vid");
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
        this.incomingSignals.push(signal);
      });
    },
    async acceptCall() {
      console.log("accepting: ", this.incomingSignals);

      this.incomingSignals.forEach(sig => {
        peer.signal(sig);
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