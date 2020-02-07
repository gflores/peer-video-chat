<template lang="pug">
  .setup
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
      return getScriptCode(this.store.room.socketRoomId);
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

<style>
  .setup {
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;

    background: hsla(120, 42%, 84%, 1);
    height: 100%;
    width: 100%
  }
  .box {
    margin-top: 40px;
    height: min-content;
    max-width: 600px;
    padding: 20px;
    border: hsla(120, 91%, 34%, 1) 2px solid;
    font-size: 15px;
    background: white;

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