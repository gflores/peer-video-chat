<template lang="pug">
  h1 WebSocket Monitor

  
</template>

<script>

export default {
  created(){
    console.log("suo bro");
    let host = `https://${location.host.split(":")[0]}:4000/`;
    let monitorSocket = require('socket.io-client')(host + "ws-monitor", {rejectUnauthorized: false});
    monitorSocket.on("snapshot", (data) => {
      console.log("snapshot data: ", data);
    })
  }
}
</script>

<style scoped>

</style>