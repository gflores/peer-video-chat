<template lang="pug">
  .setup
    .title Install

    .box {{codeContent}}
    .instruction <b>{{instruction}}</b>
    .instruction The CSS class of the container is <b>.silverchat-container</b>

</template>

<script>
import {getScriptCode, getInstruction, getExample} from "./get-script-code"

export default {
  data(){
    return {

    }
  },
  computed: {
    codeContent() {
      return getScriptCode(this.store.mainRoom.socketRoomId);
    },
    instruction() {
      return getInstruction();
    },
    example() {
      return getExample();
    }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    font-size: 30px;
    font-weight: bold;
    margin: 20px 0px 40px;
    align-self: normal;
  }

  .setup {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    /* background: hsla(120, 34%, 92%, 1); */
    height: 100%;
    width: 100%
  }
  .box {
    height: min-content;
    max-width: 600px;
    padding: 20px;
    border: hsla(120, 91%, 34%, 1) 2px solid;
    font-size: 15px;
    background: white;
    box-shadow: rgba(0, 0, 0, 0.025) 0px 0px 0px 1px, rgba(0, 0, 0, 0.075) 0px 5px 30px 0px, rgba(0, 0, 0, 0.025) 0px 3px 3px 0px;

  }
  ::selection {
    color: black;
    background: hsl(120, 55%, 78%);
  }
  .instruction {
    /* font-weight: bold; */
    margin-top: 20px;
  }
</style>