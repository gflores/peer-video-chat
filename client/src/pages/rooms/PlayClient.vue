<template lang="pug">
  section(v-if="isDataReady")
    div Room is {{room.name}}
    div(v-if="store.connectedConvo == null")
      p Not Connected to any room
      button(@click="joinRoom()") Join Room
    div(v-else)
      p You are connected to the room: {{store.connectedRoom.name}}
      video(muted="muted" playsinline="playsinline")
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

var StunTurnList = {iceServers: [
  {   urls: [ "stun:ss-turn1.xirsys.com" ]},
  {   urls: 'turn:104.248.158.23:3478', credential: 'gsFu3kkpFB2aMWih', username: 'Silverchat'}
  // {   username: "uE3FkTOJyBFzrPPzJUw0JniM6KKwnIFtAinZ-CylKuSe__JnRsK_dgCNGl_5uRWKAAAAAF39EHVnZmxvcmVz",   credential: "1f2c1b94-2355-11ea-bc46-7a7a3a22eac8",   urls: [       "turn:ss-turn1.xirsys.com:80?transport=udp",       "turn:ss-turn1.xirsys.com:3478?transport=udp",       "turn:ss-turn1.xirsys.com:80?transport=tcp",       "turn:ss-turn1.xirsys.com:3478?transport=tcp",       "turns:ss-turn1.xirsys.com:443?transport=tcp",       "turns:ss-turn1.xirsys.com:5349?transport=tcp"   ]}
]};


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
      peer = new SimplePeer({initiator: false, trickle: false, config: StunTurnList});
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