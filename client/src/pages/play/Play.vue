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

    

</template>

<script>
import { apiRequest, playRoomEmit, playRoomOn } from '~/src/lib/api.js';
import store from "store";
import GamePlayArea from "./GamePlayArea";

export default {
  components: {
    GamePlayArea
  },
  data() {
    return {
      isDataReady: false,
    };
  },
  async created() {
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
    await this.guestJoinAsPlayer();
    this.isDataReady = true;
  },
  methods: {
    async debug() {
      playRoomEmit("debug", {}, ({socket}) => {
        console.log("socket: ", socket)
      });
    },
    async joinAsPlayer() {
      return new Promise(resolve => {
        playRoomEmit("join-room", {roomId: this.roomId}, ({room, user, message}, isSuccess) => {
          if (isSuccess == false) {
            console.log(message);
            return ;
          }
          console.log("room is: ", room)
          console.log("user is: ", user)
          this.setRoom(room);
          this.setUser(user);
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
    }
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
