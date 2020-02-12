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
      isDataReady: false
    };
  },
  async created() {
    await this.fetchAllData();
    this.isDataReady = true;
  },
  methods: {
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
</style>