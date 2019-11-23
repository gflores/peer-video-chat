<template lang="pug">
  .play(v-if="isDataReady")
    template(v-if="store.user")
      b Welcome {{store.user.nickname}}

      template(v-if="store.room == null")
      template(v-else-if="store.room.isGameEnded == false")
        br
        p you are in room {{store.room.roomId}}
        template(v-if="store.room.isGameLaunched == false")
          p Waiting for your opponent
          button(@click="leaveRoom()") leave room

        template(v-else)
          GamePlayArea
      template(v-else-if="store.room.winner == store.user._id")
        p YOU WIN !
      template(v-else-if="store.room.loser == store.user._id")
        p YOU LOSE !
      template(v-else)
        p Weird State
      


    template(v-else)
      b You are not logged in
      br
      button(@click="guestJoinAsPlayer()") join game as Guest

    .debug(@) debug
    button(@click="logout()") Logout

    textarea#otherId(v-model="otherId")
    button#connect(@click="signal()") Connect

    video(muted="muted")

    

</template>

<script>
import { apiRequest, playRoomEmit, playRoomOn } from '~/src/lib/api.js';
import store from "store";
import GamePlayArea from "./GamePlayArea";
import SimplePeer from "simple-peer";

window.playRoomEmit = playRoomEmit;

let peer;

export default {
  components: {
    GamePlayArea
  },
  data() {
    return {
      isDataReady: false,
      myData: "",
      otherId: "",
    };
  },
  async created() {
    // peer = new Peer({
    //   initiator: this.isAdmin, trickle: true
    // });
    // peer.on('signal', data => {
    //   console.log("SIGNAL: ", JSON.stringify(data));
    //   // this.myData = JSON.stringify(data);
    // });

    playRoomOn("signal-emitted", (isAdmin, data) => {
      if (this.isAdmin == isAdmin) {
        return ;
      }
      console.log("signal-emitted data: ", data);
      if (this.isAdmin) {
        peer.signal(data.client.playerData.signal);
      } else if (this.isAdmin == false) {
        peer.signal(data.admin.playerData.signal);
      }
    });

    playRoomOn("user-joined-room", data => {
      console.log("user-joined-room: ", data);
    });
    playRoomOn("game-countdown", ({time}) => {
      console.log("Countdown started : ", time);
    });
    playRoomOn("game-started", (room) => {
      console.log("game-started");
      // console.log("Countdown started : ", time);
      this.setRoom(room);
    });
    playRoomOn("new-round", ({roundTime}) => {
      this.store.canPlay = true;
      console.log("new-round");
    });
    playRoomOn("end-round", (room) => {
      console.log("end-round: ", room);
      this.store.canPlay = false;
      this.setRoom(room);
    });

    // await Promise.all([
    //   this.storeMyProfile()
    // ]);
    await this.simplePeerSetupClient();
    await this.guestJoinAsPlayer();
    console.log("guestJoinAsPlayer");
    this.isDataReady = true;
    await this.simplePeerSetupAdmin();
  },
  methods: {
    async simplePeerSetupAdmin() {
      if (this.isAdmin) {
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        peer = new SimplePeer({ initiator: true, trickle: true, stream: stream});

        peer.on('error', err => console.log('error', err))
        peer.on('signal', signal => {
          console.log('SIGNAL:  ', JSON.stringify(signal))
          playRoomEmit("submit-signal", {signal: signal}, () => {
            console.log("emitted");
          })
          console.log('WTF')
        });
      }
    },
    async simplePeerSetupClient() {
      if (this.isAdmin == false) {
        peer = new SimplePeer({initiator: false, trickle: false});
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
          playRoomEmit("submit-signal", {signal: signal})
        });
      }
    },
    async signal() {
      console.log("peer: ", peer);
      peer.signal(JSON.parse(this.otherId));
    },
    async debug() {
      playRoomEmit("debug", {}, ({socket}) => {
        console.log("socket: ", socket)
      });
    },
    async joinAsPlayer() {
      return new Promise(resolve => {
        playRoomEmit("join-room", {roomId: this.roomId, isAdmin: this.isAdmin, rtcData: "rtcdata"}, ({room, user, message}, isSuccess) => {
          if (isSuccess == false) {
            console.log(message);
            return ;
          }
          console.log("room is: ", room)
          console.log("user is: ", user)
          this.setRoom(room);
          this.setUser(user);
          if (this.isAdmin == false) {
            if (room.admin && room.admin.playerData.signal != null) {
              peer.signal(room.admin.playerData.signal);
            }
          }
          resolve();
        });
      })
    },
    async guestJoinAsPlayer() {
      if (store.get('authToken') == null) {
        await this.logAsGuest();
      }
      await this.joinAsPlayer();
    },
    async leaveRoom() {
      console.log("leave");
      playRoomEmit("leave-room", {});
    },
    async logout() {
      store.set('authToken', null);
      window.location.reload();
    }
  },
  computed: {
    roomId() {
      return this.$route.params.roomId
    },
    role() {
      return this.$route.params.role
    },
    isAdmin() {
      return this.role == "admin";
    },


  }
}
</script>

<style lang="scss">
  .play {
    position: absolute;
    height: 100%;
    width: 100%;
  }
</style>
