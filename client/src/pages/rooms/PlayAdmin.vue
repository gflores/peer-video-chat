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
        div(v-if="waitingConvos.length > 0")
          p Someone is Waiting !
          button(@click="nextConvo()") Join Conversation
      div(v-else)
        p You are having conversation with: {{store.connectedConvo.clientId}}
        button(@click="endConvo()") End Conversation

        div(v-if="hasAcceptedCall == false")
          button(@click="answerCall()") RECONNECT TO CONVERSATION !

        //- div(v-if="incomingSignal != null")
        //-   p Someone is calling !
        //-   button(@click="acceptCall()") (old) acceptCall
        
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
      socketConnectedToConvo: false,
      isConnectionEstablished: false,
      hasAcceptedCall: false
    };
  },
  async created() {
    await this.logAsGuestIf()
    this.socketSetup();

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

      mySignals = [];
      this.isConnectionEstablished = false;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (e) {
        console.log("e: ", e);
        stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      }

      peer = new SimplePeer({ initiator: true, trickle: true, stream: stream, config: StunTurnList});
      window.thePeer = peer;
      window.theStream = stream;

      peer.on('error', err => console.log('peer error: ', err))
      peer.on('signal', async signal => {
        console.log('MY SIGNAL:  ', JSON.stringify(signal))
        mySignals.push(signal);

        if (this.socketConnectedToConvo == true) {
          await playRoomEmit("transmit-signal", {signal: signal});
        }
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
    socketSetup(){
      // When receiving request to send signals again from client
      playRoomOn("admin/request-for-signal", async ({}) => {
        console.log("receiving request-for-signal");
        
        if (this.isConnectionEstablished == true) {
          console.log("connection already established, reconstructing peer");
          await this.simplePeerSetup();
        } else {
          this.emitStoredSignals();
        }
      });

      // When receiving signal from the client
      playRoomOn("admin/emit-signal", async ({signal}) => {
        console.log("OTHER SIGNAL: ", signal);

        if (this.isConnectionEstablished == true) {
          console.log("connection already established, reconstructing peer");
          await this.simplePeerSetup();
        } else {
          this.incomingSignal = signal;
          this.tryConnectIncomingSignal();
        }
      });
      // When client notify he created a convo
      playRoomOn("admin/notify-new-convo", ({convo}) => {
        console.log("NEW CONVO: ", convo);
        this.convos.push(convo);
      });
    },
    async tryConnectIncomingSignal() {
      if (this.hasAcceptedCall == true && this.incomingSignal != null) {
        peer.signal(this.incomingSignal);
        this.isConnectionEstablished = true;
        this.incomingSignal = null;
      }
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
      this.hasAcceptedCall = true;
      await this.socketConnectToConvo();
      this.emitStoredSignals();
    },
    async leaveRoom() {
      await apiRequest("admin/leave-room", {});
      await this.fetchAllData();
    },
    async answerCall(){
      this.hasAcceptedCall = true;
      this.tryConnectIncomingSignal();
    }
  },
  computed: {
    socketRoomId() {
      return this.$route.params.socketRoomId
    },
    waitingConvos() {
      return this.convos.filter(c => c.state == "waiting");
    }
  }
}
</script>

<style lang="scss" scoped>

</style>