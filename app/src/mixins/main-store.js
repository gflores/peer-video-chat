import Vue from 'vue'
import store from "store";
import { apiRequest, playRoomEmit} from "~/src/lib/api.js";

var storeObject = {
  user: null,
  team: null,
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
        if (store.get("authToken") != null) {          
          let {user, team, room} = await apiRequest("my-profile", {});
          console.log("Receiving: ");
          this.setUser(user);
          this.setTeam(team);
          this.setRoom(room);
        }
      } catch (e) {}
    },
    setUser(user) {
      this.store.user = user;
    },
    setTeam(team) {
      this.store.team = team;
    },
    setRoom(room) {
      this.store.room = room;
    },
    logoutUser(){
      store.remove("authToken");
      this.$router.push('/login');
    }
  },
  computed: {
  }
});