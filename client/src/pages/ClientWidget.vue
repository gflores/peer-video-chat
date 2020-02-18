<template lang="pug">
  .play-client(:class="isFirstContact ? 'accepted-call' : ''")
    template(v-if="isDataReady")
      //- div Room is {{room.name}}

      template(v-if="isFirstContact == false")
        template(v-if="store.connectedConvo == null || store.connectedRoom.socketRoomId != socketRoomId")
          //- p Not Connected to any room
          button.instant-call(@click="haveIntroQuestions ? isFirstContact = true : tryJoinRoom()") {{buttonStartText}}
        template(v-else)
          button.reconnect-call(@click="answerCall()") Reconnect call
      
      template(v-else-if="haveIntroQuestions && (store.connectedConvo == null || store.connectedRoom.socketRoomId != socketRoomId)")
        .questions
          .question(v-for="(introQuestion, qi) in room.introQuestions")
            .text {{introQuestion.questionText}}
            .answers
              .answer(v-for="(answer, i) in introQuestion.answers" :class="selectedAnswers[qi] == i ? 'selected' : ''" @click="selectedAnswers[qi] = i") {{answer.answerText}}
        button(@click="tryJoinRoom()") Live Call


      template(v-else-if="connectedSeed == null")
        .calling-msg(v-if="askingForPermission") Please Allow Microphone
        .calling-msg(v-else-if="deniedPermission && isMicRequired") Microphone Denied :(
        .calling-msg(v-else) {{deniedPermission ? "One-way call..." : "Calling..."}}

      .rows(v-else)
        .profile-section(:style="adminShowProfile == false ? 'display: none' : ''")
          img.profile-picture(:src="profilePictureUrl")
          .online-indicator
          .handle-name {{adminName}}
        video(:style="adminShowProfile ? 'display: none' : ''" muted="muted" playsinline="playsinline")

        //- button(@click="leaveRoom()") Leave Room

        //- p {{recordAudio ? "Your Microphone is ON" : "Your Microphone is OFF"}}
        //- button(@click="recordAudio = !recordAudio; updateUserMediaStream()") {{recordAudio ? "Turn Mic OFF" : "Turn Mic ON"}}
    template(v-else)
      button   


</template>

<script>
import { apiRequest, playRoomEmit, playRoomOn, getSocketId } from '~/src/lib/api.js';
import store from "store";
import SimplePeer from "simple-peer/simplepeer.min.js";

// window.SimplePeer = SimplePeer;

let peer = null;

var StunTurnList = {iceServers: [
  {   urls: [ "stun:ss-turn1.xirsys.com" ]},
  {   urls: 'turn:104.248.158.23:3478', credential: 'gsFu3kkpFB2aMWih', username: 'Silverchat'}
  // {   username: "uE3FkTOJyBFzrPPzJUw0JniM6KKwnIFtAinZ-CylKuSe__JnRsK_dgCNGl_5uRWKAAAAAF39EHVnZmxvcmVz",   credential: "1f2c1b94-2355-11ea-bc46-7a7a3a22eac8",   urls: [       "turn:ss-turn1.xirsys.com:80?transport=udp",       "turn:ss-turn1.xirsys.com:3478?transport=udp",       "turn:ss-turn1.xirsys.com:80?transport=tcp",       "turn:ss-turn1.xirsys.com:3478?transport=tcp",       "turns:ss-turn1.xirsys.com:443?transport=tcp",       "turns:ss-turn1.xirsys.com:5349?transport=tcp"   ]}
]};
let connectTimer = null;

let currentStream;

export default {
  props: ['roomId', 'isMicRequired'],
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
      adminSocketId: null,
      isFirstContact: false,
      askingForPermission: false,
      deniedPermission: false,
      selectedAnswers: {0: null, 1: null, 2: null},
      adminShowProfile: true,
      adminName: ""
    };
  },
  async created() {
    console.log("ClientWidget roomId: ", this.roomId);

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

      this.askingForPermission = true;
        try {
          currentStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          this.askingForPermission = false;
        } catch (e) {
          console.log("e: ", e);
          this.askingForPermission = false;
          this.deniedPermission = true;
          currentStream = undefined;
          console.log("this.isMicRequired: ", this.isMicRequired);

          if (this.isMicRequired == true) {
            return Promise.reject("Denied Permission")
          }
          console.log("still alive");
        }

      peer = new SimplePeer({initiator: false, trickle: false, config: StunTurnList, stream: currentStream});
      window.thePeer = peer;
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

      peer.on('data', data => {
        let buffer = new TextDecoder("utf-8").decode(data);
        let obj = JSON.parse(buffer);
        console.log("peer-data: ", obj);
        if (obj.native == true) {
          switch(obj.method){
            case "adminShowProfile":
              this.adminShowProfile = obj.data;
              break;
            case "adminName":
              this.adminName = obj.data;
              break;

              
          }
        } else if (window.SilverchatController != null) {
          console.log("SilverchatController: ", obj);
          window.SilverchatController[obj.method](obj);
        } else {
          console.log("No controller");
        }
      });
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

      playRoomOn("user-disconnected", async({id}) => {
        console.log("THIS SOCKET ID DISCONNECTED: ", id);
        if (this.adminSocketId == id) {
          this.connectedSeed = null;
          await this.fetchAllData();

          if (this.store.connectedConvo == null) {
            this.isFirstContact = false;
            this.socketConnectedToConvo = false;
          }
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
      this.isFirstContact = true;
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
    async doJoinConvo(){
      await apiRequest("client/join-convo", {
        socketRoomId: this.socketRoomId,
        introAnswers: this.selectedAnswers
      });
    },

    async tryJoinRoom() {
      this.isFirstContact = true;
      if (this.canJoinConvo == false) {
        console.log("Have questions, please submit first");
        return ;
      }
      try {

        if (this.store.connectedConvo != null && this.store.connectedRoom.socketRoomId != this.socketRoomId) {
          console.log("leaving room first !");
          await this.leaveRoom();
        }

        await this.simplePeerSetup();
        this.hasAcceptedCall = true;

        await this.doJoinConvo();

        await this.fetchAllData();
        await this.socketConnectToConvo();

        if (this.lastAdminSeed == null) {
          playRoomEmit("client/request-for-signal", {})
        }
      } catch (e) {
        console.log("?Microphone denied?", e);
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
      return this.roomId;
    },
    buttonStartText(){
      return this.room.buttonStartText ? this.room.buttonStartText : "Start a conversation";
    },
    haveIntroQuestions() {
      return this.room.introQuestions != null && this.room.introQuestions.length > 0;
    },
    canJoinConvo () {
      return this.haveIntroQuestions == false || (this.haveIntroQuestions == true);
    },
    profilePictureUrl() {
      if (this.adminName == "Gael") {
        return process.env.VUE_APP_API_URL + 'assets/gael-profile.jpg';
      } else if (this.adminName == "Julius") {
        return process.env.VUE_APP_API_URL + 'assets/julius-profile.jpg';
      }
      return process.env.VUE_APP_API_URL + 'assets/default-profile.png';
    }
  }
}
</script>

<style lang="scss" scoped>
  .questions {
    .question {
      display: flex;
      // padding: 15px 0px;
      // margin-bottom: 15px;
      // border: #26292c 1px solid;
      background: hsla(208, 20%, 96%, 1);
      margin-bottom: 1px;

      &:nth-child(odd) {
        background: hsla(120, 51%, 96%, 1);
      }

      .text {
        // font-size: 20px;
        width: 28%;
        padding: 0px 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: hsla(210, 5%, 26%, 1);
        font-weight: bold;
        font-size: 14px;
      }
      .answers {
        display: flex;
        flex-grow: 1;
        // padding-right: 15px;

        .answer {
          margin: 1px 0;
          line-height: 58px;
          text-align: center;
          // border: #26292c 1px solid;
          // border-radius: 5px;
          flex: 1;
          border-radius: 2px;
          cursor: pointer;

          &:hover {
            font-weight: bold;
            color: black;
            background: hsla(210, 30%, 90%, 1)
          }
          &.selected {
            font-weight: bold;
            color: black;
            background: hsla(120, 40%, 68%, 1);

          }
        }
      }
    }
  }
  .rows {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .play-client {
    position: relative;
    width: 100%;

    transition: height 1s;
  }
  .calling-msg {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    color: white;
    background: hsla(120, 91%, 34%, 1);
  }
  button {
    outline: 0;
    font-family: 'Source Sans Pro', sans-serif;
    width: 100%;
    height: 100%;
    color: white;
    font-size: 26px;
    font-weight: 700;
    background: hsla(120, 91%, 34%, 1);
    border: 0;
    border-radius: 4px;
    height: 60px;
    display: block;

    @media only screen and (min-width: 1680px) {
      height: 72px;
      font-size: 32px;
    }
  }

  .profile-section {
    position: relative;
    max-width: 140px;

    .profile-picture {
      width: 100%;
      display: block;
    }
    .online-indicator {
      width: 16px;
      height: 16px;
      border-radius: 100%;
      background: hsla(120, 80%, 50%, 1);
      position: absolute;
      top: 2px;
      right: 2px;
    }
    .handle-name {
      width: 100%;
      position: absolute;
      bottom: 0;
      text-align: center;
      color: white;
      background: rgba(0, 0, 0, 0.8);
    }
  }

  video {
    width: 100%;
    display: block;
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
</style>