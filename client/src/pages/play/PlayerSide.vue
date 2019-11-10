<template lang="pug">
  .player-side.play-corner(:class="store.canPlay ? 'can-play' : ''")
    .action-play-area action play area
    .damage-number-feedback
    .playable-cards-section
      .top-row
        PlayableGameCard(:card="playerData.currentCards[0]" :index="0" :isPlayerSide="true")
      .bottom-row
        PlayableGameCard(:card="playerData.currentCards[1]" :index="1" :isPlayerSide="true")
        PlayableGameCard(:card="playerData.currentCards[2]" :index="2" :isPlayerSide="true")
    .playable-shield-section
      PlayableShield(:playerData="playerData")
    .healthbar-controller {{playerData.currentHp}} / {{playerData.maxHp}}
      


</template>

<script>
import PlayableGameCard from "./PlayableGameCard";
import PlayableShield from "./PlayableShield";

export default {
  components: {
    PlayableGameCard,
    PlayableShield
  },
  computed: {
  }
}
</script>

<style lang="scss">
  .player-side {
    position: absolute;
    bottom: 0;
    width: 100%;

    .healthbar-controller {
      position: absolute;
      bottom: 0;
    }
    .playable-cards-section {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .top-row, .bottom-row {
        display: flex;
        width: 55%
      }
      .top-row {
        justify-content: center;
      }


      // .playable-game-card {
      //     position: absolute;
      //     &:nth-child(1) {
      //       bottom: 0px;
      //       right: 110px;
      //     }
      //     &:nth-child(2) {
      //       bottom: 152px;
      //       right: 56px;
      //     }
      //     &:nth-child(3) {
      //       bottom: 0px;
      //       right: 0px;
      //     }
      // }

    }
    .playable-shield-section {
      position: absolute;
      bottom: 200px;
    }
    .action-play-area {
      position: absolute;
      bottom: 300px;
    }
  }
</style>
