import Vue from 'vue'
import store from "store";
import { apiRequest, playRoomEmit} from "~/src/lib/api.js";

var storeObject = {
  user: null,
  room: null,
  selectedAction: null,
  selectedCardIndex: null,
  canPlay: false,

  connectedConvo: null,
  connectedRoom: null
}

Vue.mixin({
  data() {
    return {
      store: storeObject
    };
  },
  methods: {
    async storeConnectedRoom() {
      let res = await apiRequest("get-current-convo", {});

      if (res.message != null) {
        console.log(res.message);
        this.store.connectedRoom = null;
        this.store.connectedConvo = null;
      } else {
        this.store.connectedRoom = res.room;
        this.store.connectedConvo = res.convo;
      }
    },
    async logAsGuestIf() {
      if (store.get('authToken') != null) {
        return ;
      }

      let { authToken } = await apiRequest("log-as-guest");
      store.set('authToken', authToken);
      await this.storeMyProfile();
    },

    async storeMyProfile() {
      try {
        let {user, room} = await apiRequest("my-profile", {
        });
        this.setUser(user);
        // this.setRoom(room);
      } catch (e) {}
    },
    setUser(user) {
      this.store.user = user;
    },
    setRoom(room) {
      this.store.room = room;
    },
    getPlayerData() {
      return this.store.room.players.find(p => p._id == this.store.user._id).playerData
    },
    getOpponentData() {
      return this.store.room.players.find(p => p._id != this.store.user._id).playerData
    },
    playCard(index) {
      playRoomEmit("play-card", {index});
      this.store.selectedAction = "ATTACK";
      this.store.selectedCardIndex = index;
    },
    playShield() {
      playRoomEmit("play-shield", {});
      this.store.selectedAction = "SHIELD";
      this.store.selectedCardIndex = null;
    }

  },
  computed: {
    canPlay() {
      return this.store.user.isVerified == true || this.store.user.isGuest == true;
    },
    playerData(){
      return this.getPlayerData();
    }
  }
});