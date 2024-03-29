<template lang="pug">
  .c-portal(v-if="isDataReady")
    .top-section
      a(:href="previewLink" target="_blank") Preview
      .square-counter.waiting-convo-nb {{waitingConvos.length}}
      .square-counter.total-convo-nb {{this.room.totalConvos}}

    .container-flex
      .status-panel
        //- 0.1
        template(v-if="isConnectedToAnotherRoom == true")
          .text Already connected to another room ({{store.connectedRoom.socketRoomId}})
          button.grey(@click="leaveRoom()") Leave Other Room

        //- 1
        template(v-else-if="isConnectedToThisRoom == false")
          .text You are offline
          button.green(@click="joinRoom()") Join Room

        //- 2 & 3
        template(v-else-if="isConnectedToConvo == false")
          .text.green You are online
          button.grey(@click="leaveRoom()") Leave Room

        //- 4
        template(v-else)
          video.client-video(muted="muted" playsinline="playsinline")
          .text(v-if="peerConnectionFinalized == false") Connecting...
          .text.connected(v-else) Connected to a visitor.
          button.grey(@click="endConvo()") End Conversation

      .action-panel
        //- 0.1
        template(v-if="isConnectedToThisRoom == false")
          .big-text(v-if="waitingConvos.length == 0") No callers
          .big-text(v-else) <b>Someone is calling</b>

        //- 3
        template(v-else-if="isConnectedToThisRoom && isConnectedToConvo == false && waitingConvos.length > 0")
          template(v-if="isFirstContact == false")
            .text <b>Someone is calling</b>
            button(@click="recordVideo = true; nextConvo()") Video Call
            button.border.green(@click="recordVideo = false; nextConvo()") Voice Only
          template(v-else)
            .big-text Connecting...
            
        //- 4
        template(v-else-if="isConnectedToConvo && hasAcceptedCall == true")
          .text {{recordVideo ? "Your Camera is ON" : "Your Camera is OFF"}}
          template(v-if="recordVideo")
            button.border.grey(@click="recordVideo = !recordVideo; updateUserMediaStream()") Turn Video OFF
          template(v-else)
            button.border.green(@click="recordVideo = !recordVideo; updateUserMediaStream()") Turn Video ON

        //- 4.5
        template(v-else-if="isConnectedToConvo && hasAcceptedCall == false")
          template(v-if="isFirstContact == false")
            .text Please reconnect
            button(@click="recordVideo = true; answerCall()") Reconnect with Video
            button.border.green(@click="recordVideo = false; answerCall()") Reconnect with Voice
          template(v-else)
            .big-text Connecting...

        //- ???
        template(v-else)
          .text
        
</template>

<script>
import { apiRequest, playRoomEmit, playRoomOn, getSocketId } from '~/src/lib/api.js';
import store from "store";
import SimplePeer from "simple-peer/simplepeer.min.js";

window.req = require;

// setTimeout(() => {
//   window.SimplePeer = SimplePeer;
//   console.log("switch!!!");
// }, 5000)

import adapter from 'webrtc-adapter';
import moment from 'moment';
import webNotification from 'simple-web-notification';

window.webNotification = webNotification;

let alarmAudio = new Audio("/sounds/alarm.mp3");
alarmAudio.loop = true;

let peer = null;

let StunTurnList = {iceServers: [
  {   urls: [ "stun:ss-turn1.xirsys.com" ]},
  {   urls: 'turn:104.248.158.23:3478', credential: 'gsFu3kkpFB2aMWih', username: 'Silverchat'}
  // {   username: "uE3FkTOJyBFzrPPzJUw0JniM6KKwnIFtAinZ-CylKuSe__JnRsK_dgCNGl_5uRWKAAAAAF39EHVnZmxvcmVz",   credential: "1f2c1b94-2355-11ea-bc46-7a7a3a22eac8",   urls: [       "turn:ss-turn1.xirsys.com:80?transport=udp",       "turn:ss-turn1.xirsys.com:3478?transport=udp",       "turn:ss-turn1.xirsys.com:80?transport=tcp",       "turn:ss-turn1.xirsys.com:3478?transport=tcp",       "turns:ss-turn1.xirsys.com:443?transport=tcp",       "turns:ss-turn1.xirsys.com:5349?transport=tcp"   ]}
]};

let currentStream = null;

let notificationSeed = Math.round(Math.random() * 1000000);

export default {
  props: ["socketRoomId"],
  data() {
    return {
      isFirstContact: false,
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
      lastPeerSetupDate: null,
      totalConvos: null,
      peerConnectionFinalized: false
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
      await Promise.all([
        this.storeConnectedRoom(),
        this.fetchRoomData()
      ]);
    },
    async fetchRoomData() {
      let {room, convos} = await apiRequest("admin/get-room", {socketRoomId: this.socketRoomId});

      this.room = room;
      this.convos = convos;
    },
    async socketConnectToRoom() {
      if (this.store.connectedRoom != null && this.socketConnectedToRoom == false) {
        webNotification.requestPermission();
        this.socketConnectedToRoom = true;
        return playRoomEmit("admin/join-room", {}).catch(async e => {
          await apiRequest("admin/end-convo", {});
          window.location.reload();

          return new Promise(() => {});
        });
      }
    },
    async socketConnectToConvo() {
      if (this.store.connectedConvo != null && this.socketConnectedToConvo == false) {
        this.socketConnectedToConvo = true;
        return playRoomEmit("setup-convos", {});
      }
    },
    async simplePeerSetup() {
      this.peerConnectionFinalized = false;

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
      this.store.peer = peer;
      window.thePeer = peer;

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
        this.peerConnectionFinalized = true;
        this.sendPeerMessage({native: true, method: 'adminName', data: this.store.user.firstName});
        if (this.recordVideo == true){
          this.sendPeerMessage({native: true, method: 'adminShowProfile', data: false});
        }
      }),

      peer.on('close', async () => {        
        console.log("CONNECTION WAS CLOSED !!");
        await this.simplePeerSetup();
      })
    },
    async sendPeerMessage(data) {
      peer.send(JSON.stringify(data));
    },
    async updateUserMediaStream(){
      if (this.recordVideo == false) {
        this.sendPeerMessage({native: true, method: 'adminShowProfile', data: true});
        setTimeout(() => {
          this.sendPeerMessage({native: true, method: 'adminShowProfile', data: true});
        }, 1000);
      } else {
        this.sendPeerMessage({native: true, method: 'adminShowProfile', data: false});
        setTimeout(() => {
          this.sendPeerMessage({native: true, method: 'adminShowProfile', data: false});
        }, 1000);
      }
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
      playRoomOn("admin/notify-new-convo", async ({convo}) => {
        console.log("NEW CONVO: ", convo);
        this.convos.push(convo);
        await this.fetchRoomData()
      });
      playRoomOn("user-disconnected", ({id}) => {
        console.log("THIS SOCKET ID DISCONNECTED: ", id);
        this.peerConnectionFinalized = false;

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
      webNotification.requestPermission();
    },
    async endConvo() {
      await apiRequest("admin/end-convo", {});

      // Crutch for now, endConvo doesn't properly terminate otherwise

      // await this.fetchAllData();
      location.reload();
    },
    async nextConvo() {
      this.isFirstContact = true;
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
      this.isFirstContact = true;
      await this.simplePeerSetup();
      this.hasAcceptedCall = true;
      // this.tryConnectIncomingSignal();
    },
    // async getStats(){
    //   let {totalConvos} = await apiRequest("get-room-stats", {roomId: this.room._id});

    //   this.totalConvos = totalConvos;
    // }
  },
  computed: {
    waitingConvos() {
      let res = this.convos.filter(c => c.state == "waiting");
      if (res.length > 0 && this.store.connectedRoom != null && this.store.connectedConvo == null) {
        
        try {
          alarmAudio.play();
          webNotification.showNotification('Someone calling...', {
            body: `${res.length} ${res.length == 1 ? "visitor" : "visitors"} sent a request to connect`,
            tag: `${notificationSeed}/${res.length}`,
            vibrate: [100, 160, 220, 320]
          });
        } catch (e) {
        }

      }
      return res;
    },
    previewLink() {
      return process.env.VUE_APP_SERVER_URL + "?id=" + this.room.socketRoomId
    },
    isConnectedToARoom() {
      return this.store.connectedRoom != null;
    },
    isConnectedToThisRoom(){
      return this.isConnectedToARoom && this.store.connectedRoom.socketRoomId == this.socketRoomId;
    },
    isConnectedToAnotherRoom(){
      return this.isConnectedToARoom && this.store.connectedRoom.socketRoomId != this.socketRoomId;
    },
    isConnectedToConvo() {
      return this.store.connectedConvo != null;
    }
  },
  watch: {
    isFirstContact(val) {
      if (val == true) {
          alarmAudio.currentTime = 0
          alarmAudio.pause();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .c-portal {
    height: 100%;
    width: 100%;
    background: white;
    position: relative;
  }
  .connected {
    font-weight: bold;
    color: #26bf26;
  }
  .top-section {
    width: 100%;
    display: flex;
    justify-content: center;
    height: 40px;
    align-items: flex-end;
    a {
      font-size: 22px;
      text-decoration: none;
      color: grey;
    }
  }
  .square-counter {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-weight: bold;
    font-size: 28px;
    padding: 0 8px;
    border-radius: 2px;

    &.waiting-convo-nb{
      position: absolute;
      right: 20px;
      top: 0px;
      border: hsla(4, 65%, 54%, 1) 4px solid;
      color: hsla(4, 65%, 54%, 1);
    }
    &.total-convo-nb{
      position: absolute;
      left: 20px;
      top: 0px;
      border: hsla(120, 36%, 48%, 1) 4px solid;
      color: hsla(120, 36%, 48%, 1);
    }
  }

  button {
    outline: 0;
    width: calc(100%);
    color: white;
    font-size: 24px;
    font-weight: 700;
    background: hsla(120, 91%, 34%, 1);
    border: 0;
    border-radius: 4px;
    height: 55px;
    display: block;

    &.border {
      box-shadow: inset 0 0 0 4px;
      background: transparent;
      &.green {
        color: hsla(120, 96%, 26%, 1);
      }
      &.grey {
        color: hsla(0, 0%, 32%, 1);
      }
    }
    &:not(.border) {
      &.green {
        color: white;
        background: hsla(120, 91%, 34%, 1);;
      }
      &.grey {
        color: white;
        background: grey;
      }      
    }
  }

  .container-flex {
    display: flex;
    flex-direction: column;
    height: calc(100% - 40px);
    text-align: center;
  }
  .status-panel {
    position: relative;
    padding: 0px 20px;

    width: calc(100% - 40px);
    flex-grow: 1;

    button, .text {
      position: relative;
      top: calc(15%);
    }
    .text {
      margin-bottom: 18px;
      &.green {
        color: hsla(120, 91%, 34%, 1)
      }
    }
    // .join-room-button {
    //   color: white;
    //   background: hsla(120, 91%, 34%, 1);
    // }
    // .leave-room-button {
    //   color: white;
    //   background: grey;
    // }
  }
  
  .action-panel {
    box-shadow: rgba(0, 0, 0, 0.025) 0px 0px 0px 1px, rgba(0, 0, 0, 0.075) 0px 5px 30px 0px, rgba(0, 0, 0, 0.025) 0px 3px 3px 0px;
    
    padding: 20px 20px 40px;
    width: calc(100% - 40px);
    background: hsla(120, 34%, 92%, 1);

    .text {
      margin-bottom: 18px;
      &.green {
        color: hsla(120, 91%, 34%, 1)
      }
    }
    .big-text {
      margin-top: 20px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    button:last-of-type {
      margin-top: 20px;
    }
  }
  .client-video {
    display: none;
  }
</style>