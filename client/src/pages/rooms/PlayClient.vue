<template lang="pug">
  .play-client(:class="hasAcceptedCall ? 'accepted-call' : ''")
    template(v-if="isDataReady")
      //- div Room is {{room.name}}
      template(v-if="store.connectedConvo == null")
        //- p Not Connected to any room
        button.instant-call(@click="joinRoom()")
          span.bolt-wrapper
            Bolt.left
          | Instant Call
          span.bolt-wrapper
            Bolt.right
      template(v-else)
        .calling-msg(v-if="connectedSeed == null") Calling...
        //- p You are connected to the room: {{store.connectedRoom.name}}
        video(muted="muted" playsinline="playsinline")
        //- button(@click="leaveRoom()") Leave Room

        template(v-if="hasAcceptedCall == false")
          button.reconnect-call(@click="answerCall()") Reconnect call
        template(v-else)
          //- p {{recordAudio ? "Your Microphone is ON" : "Your Microphone is OFF"}}
          //- button(@click="recordAudio = !recordAudio; updateUserMediaStream()") {{recordAudio ? "Turn Mic OFF" : "Turn Mic ON"}}


</template>

<script>
import { apiRequest, playRoomEmit, playRoomOn, getSocketId } from '~/src/lib/api.js';
import store from "store";
import SimplePeer from "simple-peer";

let peer = null;

var StunTurnList = {iceServers: [
  {   urls: [ "stun:ss-turn1.xirsys.com" ]},
  {   urls: 'turn:104.248.158.23:3478', credential: 'gsFu3kkpFB2aMWih', username: 'Silverchat'}
  // {   username: "uE3FkTOJyBFzrPPzJUw0JniM6KKwnIFtAinZ-CylKuSe__JnRsK_dgCNGl_5uRWKAAAAAF39EHVnZmxvcmVz",   credential: "1f2c1b94-2355-11ea-bc46-7a7a3a22eac8",   urls: [       "turn:ss-turn1.xirsys.com:80?transport=udp",       "turn:ss-turn1.xirsys.com:3478?transport=udp",       "turn:ss-turn1.xirsys.com:80?transport=tcp",       "turn:ss-turn1.xirsys.com:3478?transport=tcp",       "turns:ss-turn1.xirsys.com:443?transport=tcp",       "turns:ss-turn1.xirsys.com:5349?transport=tcp"   ]}
]};
let connectTimer = null;

let currentStream;

export default {
  data() {
    return {
      isDataReady: false,
      newRoomName: "",
      room: null,
      incomingSignals: {},
      recordAudio: true,
      socketConnectedToConvo: false,
      isConnectionEstablished: false,
      hasAcceptedCall: false,
      lastAdminSeed: null,
      connectedSeed: null,
      mySeed: null,
      adminSocketId: null
    };
  },
  async created() {
    await this.logAsGuestIf()
    this.socketSetup();
    await this.fetchAllData();

    await this.socketConnectToConvo();

    this.isDataReady = true;
    // await this.simplePeerSetup();
    // if (this.socketConnectedToConvo == true) {
    //   playRoomEmit("client/request-for-signal", {});
    // }
  },
  mounted() {
  },
  methods: {
    async fetchAllData() {
      let [__, {room}] = await Promise.all([
        this.storeConnectedRoom(),
        apiRequest("get-room", {socketRoomId: this.socketRoomId})
      ]);
      this.room = room;

    },
    async simplePeerSetup() {
      this.mySeed = Math.round(Math.random() * 1000000);
      console.log("My Seed: ", this.mySeed);

      this.isConnectionEstablished = false;

      if (peer != null) {
        peer.destroy();
      }

      try {
        if (this.recordAudio == true) {
          currentStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        } else {
          currentStream = undefined;
        }
      } catch (e) {
        console.log("e: ", e);
        currentStream = undefined;
      }

      peer = new SimplePeer({initiator: false, trickle: false, config: StunTurnList, stream: currentStream});
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
        console.log('MY SIGNAL:  ', JSON.stringify(signal))
        playRoomEmit("transmit-signal", {signal: signal, seed: this.mySeed, senderSocketId: getSocketId(), returnSeed: this.connectedSeed});
      });
      peer.on('connect', () => {
        console.log("I'M CONNECTED !");
      })
      peer.on('close', () => {
        console.log("CONNECTION WAS CLOSED !!");
      })
    },

    socketSetup(){
      playRoomOn("client/emit-signal", ({signal, seed, senderSocketId}) => {
        console.log(`OTHER SIGNAL [${seed}]: `, signal);
        this.lastAdminSeed = seed;
        this.adminSocketId = senderSocketId;

        if (this.connectedSeed == seed) {
          console.log("CONCAT NEW SIGNAL");
          peer.signal(signal);
        } else if (this.incomingSignals[seed] == null) {
          console.log("SIGNAL NEW SEED: ", seed);
          this.incomingSignals[seed] = [signal];
          clearTimeout(connectTimer);
          connectTimer = setTimeout(async () => {
            await this.tryConnectIncomingSignal();
          }, 2000);
        } else {
          console.log("PUSHING SIGNAL");
          this.incomingSignals[seed].push(signal);
        }

      });
    },

    async updateUserMediaStream(){
      try {
        if (currentStream != null) {
          peer.removeStream(currentStream);
          currentStream = null;
        }
      } catch(e) {
        currentStream = null;
      } finally {
        if (this.recordAudio == true) {
          setTimeout(async () => {
            currentStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
            console.log("new stream: ", currentStream);
            try {
              peer.addStream(currentStream);
            } catch(e) {
              // await this.simplePeerSetup();
              console.log("SHOULD BE LAST RESORT, BUT WAIT FOR ADMIN TO RESTART")
            }
          }, 10);
        }
      }
    },

    async socketConnectToConvo() {
      console.log(`try connect to convo: ${this.store.connectedConvo != null} && ${this.socketConnectedToConvo == false}`);
      if (this.store.connectedConvo != null && this.socketConnectedToConvo == false) {
        this.socketConnectedToConvo = true;
        return playRoomEmit("setup-convos", {});
      }

      return Promise.resolve();
    },
    async answerCall(){
      await this.simplePeerSetup();
      this.hasAcceptedCall = true;

      if (this.lastAdminSeed == null) {
        playRoomEmit("client/request-for-signal", {})
      } else {
        this.tryConnectIncomingSignal();
      }
    },
    async tryConnectIncomingSignal() {
      if (this.hasAcceptedCall == true && this.lastAdminSeed != null && this.incomingSignals[this.lastAdminSeed] != null) {
        if (this.isConnectionEstablished == true) {
          console.log("connection already established, reconstructing peer"); 
          await this.simplePeerSetup();
        }
        console.log("Accepting: " + this.incomingSignals[this.lastAdminSeed].length);
        this.connectedSeed = this.lastAdminSeed;
        for (let i = 0; i < this.incomingSignals[this.lastAdminSeed].length; ++i) {
          let sig = this.incomingSignals[this.lastAdminSeed][i];
          peer.signal(sig);
        }
        this.isConnectionEstablished = true;
        this.incomingSignals[this.lastAdminSeed] = null;
      }
    },
    async joinRoom() {
      await this.simplePeerSetup();
      this.hasAcceptedCall = true;

      await apiRequest("client/join-convo", {
        socketRoomId: this.socketRoomId
        });
      await this.fetchAllData();
      await this.socketConnectToConvo();

      if (this.lastAdminSeed == null) {
        playRoomEmit("client/request-for-signal", {})
      }
    },
    async leaveRoom() {
      await apiRequest("client/leave-convo", {});
      this.socketConnectedToConvo = false;
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
  .play-client {
    background: hsla(120, 91%, 34%, 1);
    position: absolute;
    width: 100%;
    height: 55px;
    &.accepted-call {
      height: 250px;
    }
  }

  .instant-call {
    font-family: 'Source Sans Pro', sans-serif;
    width: 100%;
    height: 100%;
    color: white;
    font-size: 24px;
    font-weight: 700;
    background: hsla(120, 91%, 34%, 1);
    border: 0;
  }

  .reconnect-call {
    font-family: 'Source Sans Pro', sans-serif;
    width: 100%;
    height: 100%;
    color: white;
    font-size: 24px;
    font-weight: 700;
    background: hsla(120, 91%, 34%, 1);
    position: absolute;
    top: 0;
    left: 0;
    border: 0;
  }

  video {
    width: 100%;
  }

  .bolt-wrapper {
    position: relative;

    svg {
      height: 26px;
      position: absolute;
      fill: white;
      top: 2px;
      &.left {
        right: 4px;
      }
      &.right {
        left: 4px;
      }
    }
  }

  .calling-msg {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    color: white;
  }
</style>