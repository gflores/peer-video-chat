import { generateStartingCards } from './cards.js';
import { maxHp } from '~/src/global-variables.js';

export const constructPlayerData = () => {
  let hand = [];
  let deck = generateStartingCards();

  hand.push(deck.pop());
  hand.push(deck.pop());
  hand.push(deck.pop());

  let player = {
      currentHp: maxHp, 
      maxHp: maxHp,
      currentCards: hand,
      remainingCardsStack: deck,
      action: null,
      actionCardIndex: null,
      canPlayShield: true
  };
  return player;
}