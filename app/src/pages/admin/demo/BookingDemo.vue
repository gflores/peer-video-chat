<template lang="pug">
  .booking-demo
    .title Booking Demo
    .first-row
      portal(:socketRoomId="socketRoomId")
      .button-text-container(v-if="isDataReady")
        input(placeholder="Start a conversation" v-model="room.buttonStartText")
        button(@click="updateStartText") Update

      .questions(v-if="isDataReady")
        .question-container(v-for="(introQ, qIndex) in room.introQuestions")
          .question {{introQ.questionText}}
          .answer(:class="wasAnswerSelected(qIndex, aIndex) ? 'selected' : ''" v-for="(answer, aIndex) in introQ.answers") {{answer.answerText}}
        
        br
        | Question: 
        input(placeholder="Question" type="text" v-model="questionText")
        br
        | Mandatory ?: 
        input(placeholder="Mandatory ?" type="checkbox" v-model="isMandatory")
        br
        template(v-for="(answerText, i) in answerTexts")
          input(v-model="answerTexts[i]" :placeholder="`Answer ${i + 1}`" type="text")
          br
        button(@click="submitNewQuestion") Add New Question
    .second-row
      .col
        button(:class="selectedImageName == 'screen1-1.PNG' ? 'selected' : ''" @click="changeRemotePicture('screen1-1.PNG')") Screen 1-1
        button(:class="selectedImageName == 'screen1-2.PNG' ? 'selected' : ''" @click="changeRemotePicture('screen1-2.PNG')") Screen 1-2
        button(:class="selectedImageName == 'screen2.PNG' ? 'selected' : ''" @click="changeRemotePicture('screen2.PNG')") Screen 2
        button.sublevel(:class="selectedImageName == 'igloo1.jpg' ? 'selected' : ''" @click="changeRemotePicture('igloo1.jpg')") Igloo1
        button.sublevel(:class="selectedImageName == 'igloo2.jpg' ? 'selected' : ''" @click="changeRemotePicture('igloo2.jpg')") Igloo2
        button.sublevel(:class="selectedImageName == 'cloud-room1.jpg' ? 'selected' : ''" @click="changeRemotePicture('cloud-room1.jpg')") Cloud Room 1
        button.sublevel(:class="selectedImageName == 'cloud-room2.jpg' ? 'selected' : ''" @click="changeRemotePicture('cloud-room2.jpg')") Cloud Room 2
        button.sublevel(:class="selectedImageName == 'warehouse1.jpg' ? 'selected' : ''" @click="changeRemotePicture('warehouse1.jpg')") Warehouse 1
        button.sublevel(:class="selectedImageName == 'warehouse2.jpg' ? 'selected' : ''" @click="changeRemotePicture('warehouse2.jpg')") Warehouse 2
        button(:class="selectedImageName == 'screen3.PNG' ? 'selected' : ''" @click="changeRemotePicture('screen3.PNG')") Screen 3
        button(:class="selectedImageName == 'screen4.PNG' ? 'selected' : ''" @click="changeRemotePicture('screen4.PNG')") Screen 4
        button(:class="selectedImageName == 'screen5.PNG' ? 'selected' : ''" @click="changeRemotePicture('screen5.PNG')") Screen 5
        button(:class="selectedImageName == 'screen6.PNG' ? 'selected' : ''" @click="changeRemotePicture('screen6.PNG')") Screen 6
        button(:class="selectedImageName == 'screen7.PNG' ? 'selected' : ''" @click="changeRemotePicture('screen7.PNG')") Screen 7
        button(:class="selectedImageName == 'screen8.PNG' ? 'selected' : ''" @click="changeRemotePicture('screen8.PNG')") Screen 8
      .col
        img.preview-picture(v-if="selectedImageName != null" :src="getImageUrl(selectedImageName)")

</template>

<script>
import portal from "~/src/pages/client/c-portal.vue";
import { apiRequest } from "~/src/lib/api.js";


export default {
  components: {portal},
  data() {
    return {
      questionText: "",
      isMandatory: false,
      answerTexts: ["","",""],
      room: null,
      isDataReady: false,
      selectedImageName: null
    };
  },
  async created() {
    await this.fetchAllData();
    this.isDataReady = true;
  },
  methods: {
    async changeRemotePicture(name) {
      this.selectedImageName = name;
      this.sendPeerMessage({method: "changePicture", data: this.getImageUrl(name)});
    },
    async sendPeerMessage(data) {
      this.store.peer.send(JSON.stringify(data));
    },
    async fetchAllData() {
      let {room, convos} = await apiRequest("admin/get-room", {socketRoomId: this.socketRoomId});
      this.room = room;
    },

    async submitNewQuestion() {
      await apiRequest("agent/add-question", {
        socketRoomId: this.socketRoomId,
        isMandatory: this.isMandatory,
        questionText: this.questionText,
        answerTexts: this.answerTexts
      });
      await this.fetchAllData();
    },

    async updateStartText(){
      console.log(this.room.buttonStartText);
      await apiRequest("agent/update-button-start-text", {socketRoomId: this.socketRoomId, buttonStartText: this.room.buttonStartText});
      await this.fetchAllData();
    },

    wasAnswerSelected(qIndex, aIndex){
      if (this.store.connectedConvo != null && this.store.connectedConvo.introAnswers != null) {
        // console.log(`${this.store.connectedConvo.introAnswers[qIndex]} | ${qIndex} | ${aIndex}`);
        // console.log(this.store.connectedConvo.introAnswers[qIndex] == aIndex)
        return this.store.connectedConvo.introAnswers[qIndex] == aIndex;
      }
      return false;
    },
    getImageUrl(name) {
      return process.env.VUE_APP_WEBSITE_URL + "/images/booking/" + name;
    }
  },
  computed: {
    socketRoomId(){
      return "demo/booking";
    }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    font-weight: bold;
    font-size: 30px;
    margin: 10px 40px;
  }
  .first-row {
    display: flex;
    justify-content: space-between;

    .c-portal {
      width: 300px;
    }
    .question-container {
      display: flex;
      margin-bottom: 4px;

      .answer {
        margin-left: 14px;
        background: grey;
        color: white;
        border-radius: 10px;
        padding: 0px 8px;

        &.selected {
          background: #08a608;
        }
      }
    }
  }

  .second-row {
    display: flex;
    justify-content: space-between;

    .selected {
      border: hsla(180, 100%, 59%, 1) 5px solid;
    }
    button {
      margin-bottom: 8px;
    }
    .sublevel {
      margin-left: 30px;
      margin-bottom: 2px;

    }
  }
  .col {
    display: flex;
    flex-direction: column;
  }
  .preview-picture {
    width: 100%;
  }
</style>