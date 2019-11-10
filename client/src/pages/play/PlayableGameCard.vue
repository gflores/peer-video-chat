<template lang="pug">
  .playable-game-card
    .game-card(v-if="card != null" @click="playCard(index)" :class="getElementClass() + getSelectedClass()")
      img.card-image(:src="getImagePath()")
      .value.top {{ card.value }}
      .value.bottom {{ card.value }}
    .game-card.empty(v-else)
      img.card-image(src="/images/card_rock.png")

</template>

<script>

export default {
  props: ["card", "index", "isPlayerSide"],
  methods: {
    getElementClass() {
        return this.card.element.toLowerCase();
    },
    getSelectedClass() {
      if (this.isPlayerSide == true && this.store.selectedAction == "ATTACK" && this.store.selectedCardIndex == this.index)
        return " selected"
      return "";
    },
    getImagePath(){
      if (this.card.element == "ROCK")
          return "/images/card_rock.png";
      if (this.card.element == "SCISSOR")
          return "/images/card_scissor.png";
      else if (this.card.element == "PAPER")
          return "/images/card_paper.png";
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/_utils.scss';
@import '@/assets/scss/_card_elements.scss';

@keyframes glowEffectRock {
    0%   {box-shadow: 0px 0px 20px 3px $rockColor;}
    50%  {box-shadow: 0px 0px 4px 1px $rockColor;}
    100%   {box-shadow: 0px 0px 20px 3px $rockColor;}
}

@keyframes glowEffectScissor {
    0%   {box-shadow: 0px 0px 20px 3px $scissorColor;}
    50%  {box-shadow: 0px 0px 4px 1px $scissorColor;}
    100%   {box-shadow: 0px 0px 20px 3px $scissorColor;}
}
@keyframes glowEffectPaper {
    0%   {box-shadow: 0px 0px 20px 3px $paperColor;}
    50%  {box-shadow: 0px 0px 4px 1px $paperColor;}
    100%   {box-shadow: 0px 0px 20px 3px $paperColor;}
}

@mixin glowAnimation($animationName) {
        animation: $animationName 1.5s linear infinite;
}

@keyframes AutoScaleAnimation {
    0%   {transform: scale(1.03);}
    50%  {transform: scale(0.97);}
    100%   {transform: scale(1.03);}
}


//

.playable-game-card {
    background-color: hsla(0, 0%, 80%, 1);
    margin: 0 ;
    padding: 7px;
    border-radius: 1%;
    border: 2px solid hsla(0, 0%, 25%, 1);
    display: inline-block;
    width: calc(50% - 14px);

    .empty {
        width: 100%;
        opacity: 0;
    }
    .game-card {
        position: relative;
        border-radius: 5%;

        .card-image {
            display: block;
            width: 100%;
        }
        .value {
            position: absolute;
            font-size: 34px;
            font-weight: bold;
            line-height: 120%;
            color: #ffec00;
            text-shadow: -1px 1px 1px #000, 1px 1px 1px #000, 1px -1px 1px #000, -1px -1px 1px #000, 0px 1px 1px #000, 1px 0px 1px #000, 0px -1px 1px #000, -1px 0px 1px #000;
        }

        .top {
            left: 6%;
            top: 1%;
        }
        .bottom {
            right: 6%;
            bottom: 1%;
        }
    }
}



.player-side {
    .playable-game-card {
        .selected.game-card{
            margin: -4px;
            border: 5px solid rgba(130, 255, 255, 1);
            &::after {
                position:absolute;
                display:block;
                z-index: 9;
                background-color: black;
                opacity: 0.2;
                left: 0;
                top: 0;
                height: 100%;
                width: 100%;
                content: '';
                border-radius: inherit;
            }
        }
    }

    &.can-play .playable-game-card {

        .game-card:not(.selected) {
            @extend .clickable-block;


            &:hover{
                margin: -2px;
                border: 2px solid #2196F3;
                top: -5px;
            }

            &.rock {
                animation: AutoScaleAnimation 3s linear infinite, glowEffectRock 1.5s linear infinite;
            }
            &.paper {
                animation: AutoScaleAnimation 3s linear infinite, glowEffectPaper 1.5s linear infinite;
            }
            &.scissor {
                animation: AutoScaleAnimation 3s linear infinite, glowEffectScissor 1.5s linear infinite;
            }            
        }

    }
}
</style>