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
        
        button(@click="recordVideo = !recordVideo") {{recordVideo ? "Turn Video OFF" : "Turn Video ON"}}
        button(@click="recordSound = !recordSound") {{recordSound ? "Turn Microphone OFF" : "Turn Microphone ON"}}



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
      incomingSignal: null,
      recordVideo: true,
      recordSound: true,
      socketConnectedToRoom: false,
      socketConnectedToConvo: false
    };
  },
  async created() {
    await this.logAsGuestIf()
    await this.fetchAllData();
    
    await Promise.all([this.socketConnectToRoom(), this.socketConnectToConvo()]);

    this.isDataReady = true;
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
  

    },
    async socketConnectToRoom() {
      if (this.store.connectedRoom != null && this.socketConnectedToRoom == false) {
        this.socketConnectedToRoom = true;
        return playRoomEmit("admin/join-room", {});
      }
      
      return Promise.resolve();
    },
    async socketConnectToConvo() {
      if (this.store.connectedConvo != null && this.socketConnectedToConvo == false) {
        this.socketConnectedToConvo = true;
        return playRoomEmit("setup-convos", {});
      }

      return Promise.resolve();
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

        if (this.socketConnectedToConvo == true) {
          await playRoomEmit("transmit-signal", {signal: signal});
        }
      });

      // When receiving request to send signals again from client
      playRoomOn("admin/request-for-signal", ({}) => {
        console.log("receiving request-for-signal");
        this.emitStoredSignals();
      });

      // When receiving signal from the client
      playRoomOn("admin/emit-signal", ({signal}) => {
        console.log("OTHER SIGNAL: ", signal);
        this.incomingSignal = signal;
      });

      // When client notify he created a convo
      playRoomOn("admin/notify-new-convo", ({convo}) => {
        console.log("NEW CONVO: ", convo);
        this.convos.push(convo);
      });

    },
    emitStoredSignals() {
      if (mySignals.length == 0) {
        return ;
      }
      for (let i = 0; i < mySignals.length; ++i) {
        let sig = mySignals[i];
        playRoomEmit("transmit-signal", {signal: sig});
      }
    },
    async acceptCall() {
      peer.signal(this.incomingSignal);
    },
    async joinRoom() {
      await apiRequest("admin/join-room", {
        socketRoomId: this.socketRoomId
      });
      await this.fetchAllData();
      await this.socketConnectToRoom();
    },
    async endConvo() {
      await apiRequest("admin/end-convo", {});
      await this.fetchAllData();
    },
    async nextConvo() {
      await apiRequest("admin/next-convo", {});
      await this.fetchAllData();
      await this.socketConnectToConvo();
      this.emitStoredSignals();
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