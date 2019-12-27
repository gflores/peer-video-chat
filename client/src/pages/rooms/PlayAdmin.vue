<template lang="pug">
  section(v-if="isDataReady")
    div ADMIN - Room is {{room.name}}
    h3 Waiting clients:
    div(v-for="convo in convos") {{convo.clientId}} {{convo.state}} {{convo.adminId}}
    h3 Connected admins:
    div(v-for="admin in room.admins") {{admin}}

    <br><br><br><br><br>
    div(v-if="store.connectedRoom == null")
      p You haven't joined a room
      button(@click="joinRoom()") Join Room

    div(v-else)
      p You have joined the room {{store.connectedRoom.name}}
      button(@click="leaveRoom()") Leave Room

      div(v-if="store.connectedConvo == null")
        p Not having any conversation
        button(@click="nextConvo()") Start Next Conversation
      div(v-else)
        p You are having conversation with: {{store.connectedConvo.clientId}}
        button(@click="endConvo()") End Conversation

        div(v-if="incomingSignal != null")
          p Someone is calling !
          button(@click="acceptCall()") Answer Call



</template>

<script>
import { apiRequest, playRoomEmit, playRoomOn } from '~/src/lib/api.js';
import store from "store";
import SimplePeer from "simple-peer";
import adapter from 'webrtc-adapter';

let peer;

let StunTurnList = {iceServers: [
  {   urls: [ "stun:ss-turn1.xirsys.com" ]},
  {   urls: 'turn:104.248.158.23:3478', credential: 'gsFu3kkpFB2aMWih', username: 'Silverchat'}
  // {   username: "uE3FkTOJyBFzrPPzJUw0JniM6KKwnIFtAinZ-CylKuSe__JnRsK_dgCNGl_5uRWKAAAAAF39EHVnZmxvcmVz",   credential: "1f2c1b94-2355-11ea-bc46-7a7a3a22eac8",   urls: [       "turn:ss-turn1.xirsys.com:80?transport=udp",       "turn:ss-turn1.xirsys.com:3478?transport=udp",       "turn:ss-turn1.xirsys.com:80?transport=tcp",       "turn:ss-turn1.xirsys.com:3478?transport=tcp",       "turns:ss-turn1.xirsys.com:443?transport=tcp",       "turns:ss-turn1.xirsys.com:5349?transport=tcp"   ]}
]};

let mySignals = [];

export default {
  data() {
    return {
      isDataReady: false,
      newRoomName: "",
      room: null,
      convos: [],
      incomingSignal: null
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
      let [__, {room, convos}] = await Promise.all([
        this.storeConnectedRoom(),
        apiRequest("admin/get-room", {socketRoomId: this.socketRoomId})
      ]);
      this.room = room;
      this.convos = convos;

      this.isDataReady = true;
    },
    async simplePeerSetup() {

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (e) {
        console.log("e: ", e);
        stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      }

      peer = new SimplePeer({ initiator: true, trickle: true, stream: stream, config: StunTurnList});
      window.thePeer = peer;
      window.theStream = stream;

      peer.on('error', err => console.log('error', err))
      peer.on('signal', async signal => {
        console.log('MY SIGNAL:  ', JSON.stringify(signal))
        mySignals.push(signal);
        await playRoomEmit("transmit-signal", {signal: signal});
      });

      // When receiving request to send signals again from client
      playRoomOn("admin/request-for-signal", ({}) => {
        if (mySignals.length == 0) {
          return ;
        }
        mySignals.forEach(s => {
          playRoomEmit("transmit-signal", {signal: s});
        })
      });

      // When receiving signal from the client
      playRoomOn("admin/emit-signal", ({signal}) => {
        console.log("OTHER SIGNAL: ", signal);
        this.incomingSignal = signal;
      });
      
    },
    async acceptCall() {
      peer.signal(this.incomingSignal);
    },
    async joinRoom() {
      await apiRequest("admin/join-room", {
        socketRoomId: this.socketRoomId
        });
      await this.fetchAllData();
    },
    async endConvo() {
      await apiRequest("admin/end-convo", {});
      await this.fetchAllData();
    },
    async nextConvo() {
      await apiRequest("admin/next-convo", {});
      await this.fetchAllData();
    },
    async leaveRoom() {
      await apiRequest("admin/leave-room", {});
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