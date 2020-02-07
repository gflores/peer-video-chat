function getScriptCode(id) {
  return `
    <script type="text/javascript">
      Silverchat={init(d){this.d = d;}}
    </script>
    <script type="text/javascript">
      Silverchat.init({roomId: "${id}", selector: ".silverchat-location"});
    </script>
    <script src="${process.env.VUE_APP_SERVER_URL}silverchat-client.js" defer></script>
    <div class="silverchat-container"><div class="silverchat-location"></div></div>
  `;
};

function getInstruction() {
  return `Insert this code as a JavasScript or HTML element.`;
}

function getExample() {
  return `<div class="silverchat-location"></div>`;
}

export {
  getScriptCode,
  getInstruction,
  getExample
};