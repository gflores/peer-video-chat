<template lang="pug">
  .c-portal(v-if="isDataReady")
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
          button(@click="recordVideo = false; nextConvo()") Join With CALL
          button(@click="recordVideo = true; nextConvo()") Join With VIDEO
      div(v-else)
        video(muted="muted" playsinline="playsinline")
        p You are having conversation with: {{store.connectedConvo.clientId}}
        button(@click="endConvo()") End Conversation

        div(v-if="hasAcceptedCall == false")
          button(@click="recordVideo = false; answerCall()") Reconnect to CALL !
          button(@click="recordVideo = true; answerCall()") Reconnect to VIDEO !
        div(v-else)
          p {{recordVideo ? "Your Camera is ON" : "Your Camera is OFF"}}
          button(@click="recordVideo = !recordVideo; updateUserMediaStream()") {{recordVideo ? "Turn Video OFF" : "Turn Video ON"}}


        //- div(v-if="incomingSignal != null")
        //-   p Someone is calling !
        //-   button(@click="acceptCall()") (old) acceptCall
        
        //- button(@click="recordVideo = !recordVideo; updateUserMediaStream()") {{recordVideo ? "Turn Video OFF" : "Turn Video ON"}}
        //- button(@click="recordAudio = !recordAudio; updateUserMediaStream()") {{recordAudio ? "Turn Microphone OFF" : "Turn Microphone ON"}}



</template>

<script>
import { apiRequest, playRoomEmit, playRoomOn, getSocketId } from '~/src/lib/api.js';
import store from "store";
import SimplePeer from "simple-peer";
import adapter from 'webrtc-adapter';
import moment from 'moment';

let peer = null;

let StunTurnList = {iceServers: [
  {   urls: [ "stun:ss-turn1.xirsys.com" ]},
  {   urls: 'turn:104.248.158.23:3478', credential: 'gsFu3kkpFB2aMWih', username: 'Silverchat'}
  // {   username: "uE3FkTOJyBFzrPPzJUw0JniM6KKwnIFtAinZ-CylKuSe__JnRsK_dgCNGl_5uRWKAAAAAF39EHVnZmxvcmVz",   credential: "1f2c1b94-2355-11ea-bc46-7a7a3a22eac8",   urls: [       "turn:ss-turn1.xirsys.com:80?transport=udp",       "turn:ss-turn1.xirsys.com:3478?transport=udp",       "turn:ss-turn1.xirsys.com:80?transport=tcp",       "turn:ss-turn1.xirsys.com:3478?transport=tcp",       "turns:ss-turn1.xirsys.com:443?transport=tcp",       "turns:ss-turn1.xirsys.com:5349?transport=tcp"   ]}
]};

let currentStream = null;

export default {
  props: ["socketRoomId"],
  data() {
    return {
      isDataReady: false,
      newRoomName: "",
      room: null,
      convos: [],
      incomingSignal: null,
      recordVideo: false,
      recordAudio: true,
      socketConnectedToRoom: false,
      socketConnectedToConvo: false,
      isConnectionEstablished: false,
      hasAcceptedCall: false,
      lastClientSeed: null,
      connectedSeed: null,
      mySeed: null,
      clientSocketId: null,
      mySignals: [],
      lastPeerSetupDate: null
    };
  },
  async created() {
    await this.logAsGuestIf()
    this.socketSetup();

    await this.fetchAllData();

    await Promise.all([this.socketConnectToRoom(), this.socketConnectToConvo()]);

    this.isDataReady = true;
    // await this.simplePeerSetup();
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
      if (this.lastPeerSetupDate == null || moment() - this.lastPeerSetupDate > 2000) {
        this.lastPeerSetupDate = moment();
      } else {
        return ;
      }

      this.mySeed = Math.round(Math.random() * 1000000);
      console.log("My Seed: ", this.mySeed);

      this.lastClientSeed = null;
      this.connectedSeed = null;

      this.mySignals = [];
      this.isConnectionEstablished = false;

      if (peer != null) {
        peer.destroy();
      }

      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ video: this.recordVideo, audio: this.recordAudio });
      } catch (e) {
        console.log("e: ", e);
        currentStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      }

      peer = new SimplePeer({ initiator: true, trickle: true, stream: currentStream, config: StunTurnList});

      peer.on('stream', stream => {
        console.log("receiving the vid");
        var video = document.querySelector('video')    
        if ('srcObject' in video) {
          video.srcObject = stream
        } else {
          video.src = window.URL.createObjectURL(stream) // for older browsers
        }
        video.play();
        video.muted = false
      });

      // window.thePeer = peer;
      // window.theStream = stream;

      peer.on('error', err => console.log('peer error: ', err))
      peer.on('signal', async signal => {
        console.log('MY SIGNAL:  ', JSON.stringify(signal))
        this.mySignals.push(signal);

        if (this.socketConnectedToConvo == true) {
          await playRoomEmit("transmit-signal", {signal: signal, seed: this.mySeed, senderSocketId: getSocketId()});
        }
      });
      peer.on('connect', () => {
        console.log("I'M CONNECTED !");
      })
      peer.on('close', async () => {
        console.log("CONNECTION WAS CLOSED !!");
        await this.simplePeerSetup();
      })
    },
    async updateUserMediaStream(){
      try {
        peer.removeStream(currentStream);
      } catch(e) {
        currentStream = null;
      } finally {
        setTimeout(async () => {
          currentStream = await navigator.mediaDevices.getUserMedia({ video: this.recordVideo, audio: this.recordAudio })
          console.log("new stream: ", currentStream);
          try {
            peer.addStream(currentStream);
          } catch(e) {
            await this.simplePeerSetup();
            console.log("RESETING LAST RESORT: ")
          }
        }, 10);
      }
    },
    emitStoredSignals() {
      console.log("emit my stored signals: ", this.mySignals.length);
      if (this.mySignals.length == 0) {
        return ;
      }
      for (let i = 0; i < this.mySignals.length; ++i) {
        let sig = this.mySignals[i];
        playRoomEmit("transmit-signal", {signal: sig, seed: this.mySeed, senderSocketId: getSocketId()});
      }
    },
    socketSetup() {
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
      playRoomOn("admin/emit-signal", async ({signal, seed, returnSeed, senderSocketId}) => {
        console.log("returnSeed: ", returnSeed)
        if (returnSeed != this.mySeed) {
          console.log("Unknown return Seed");
          return ;
        }
        console.log("OTHER SIGNAL: ", signal);
        console.log("seed: ", seed);
        console.log("this.connectedSeed: ", this.connectedSeed);
        this.lastClientSeed = seed;
        this.clientSocketId = senderSocketId;

        if (this.connectedSeed == seed) {
          console.log("CONCAT NEW SIGNAL");
          peer.signal(signal);
        } else if (this.isConnectionEstablished == true) {
          //comment this allow toggle camera/mic
          console.log("connection already established, reconstructing peer");
          await this.simplePeerSetup();

          //thePeer.removeStream(oldNs)
          //ns = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
          //thePeer.addStream(ns)

          // this.incomingSignal = signal;
          // this.tryConnectIncomingSignal();

          // peer.signal(signal);
        } else {
          console.log("FIRST SIGNAL");
          this.incomingSignal = signal;
          this.tryConnectIncomingSignal();
        }
      });
      // When client notify he created a convo
      playRoomOn("admin/notify-new-convo", ({convo}) => {
        console.log("NEW CONVO: ", convo);
        this.convos.push(convo);
      });
      playRoomOn("user-disconnected", ({id}) => {
        console.log("THIS SOCKET ID DISCONNECTED: ", id);
      });
    },
    async tryConnectIncomingSignal() {
      if (this.hasAcceptedCall == true && this.incomingSignal != null) {
        peer.signal(this.incomingSignal);
        this.isConnectionEstablished = true;
        this.incomingSignal = null;
        this.connectedSeed = this.lastClientSeed;
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

      // Crutch for now, endConvo doesn't properly terminate otherwise

      // await this.fetchAllData();
      location.reload();
    },
    async nextConvo() {
      await this.simplePeerSetup();
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
      await this.simplePeerSetup();
      this.hasAcceptedCall = true;
      // this.tryConnectIncomingSignal();
    }
  },
  computed: {
    waitingConvos() {
      return this.convos.filter(c => c.state == "waiting");
    }
  }
}
</script>

<style lang="scss" scoped>

</style>