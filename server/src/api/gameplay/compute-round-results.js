import { getResult, generateStartingCards } from './cards.js';

let shieldHpCost = 5;
let passiveHealAmount = 1;

function attackToAttack(playerOne, playerTwo) {
    let playerOneCard = getPlayedCard(playerOne);
    let playerTwoCard = getPlayedCard(playerTwo);

    let result = getResult(playerOneCard.element, playerTwoCard.element);

    if (result == 1) {
        strongerToWeakerPlayer(playerOne, playerTwo);
    } else if (result == 0) {
        sameSuitPlayersDuel(playerOne, playerTwo);
    } else if (result == -1) {
        strongerToWeakerPlayer(playerTwo, playerOne);
    }
    
    enablePlayerShield(playerOne);
    enablePlayerShield(playerTwo);
}

function strongerToWeakerPlayer(strongerPlayer, weakerPlayer) {
    let strongCard = getPlayedCard(strongerPlayer);
    let weakCard = getPlayedCard(weakerPlayer);
    let attackValue = strongCard.value + weakCard.value;
    weakerPlayer.currentHp -= attackValue;

    discardPlayedCard(strongerPlayer);
    discardPlayedCard(weakerPlayer);
};

function sameSuitPlayersDuel(playerOne, playerTwo) {
    let playerOneAttackPower = getPlayedCard(playerOne).value;
    let playerTwoAttackPower = getPlayedCard(playerTwo).value;
    
    if (playerOneAttackPower == playerTwoAttackPower ) {
        discardPlayedCard(playerOne);
        discardPlayedCard(playerTwo);
        return;
    }
    let [strongerPlayer, weakerPlayer] = playerOneAttackPower > playerTwoAttackPower ?
        [playerOne, playerTwo] : [playerTwo, playerOne];
    
    dealingNormalDamage(strongerPlayer, weakerPlayer);
    healingNormalHealth(weakerPlayer, strongerPlayer);    
};

function dealingNormalDamage(attackingPlayer, damagedPlayer){
    let attackingValue = getPlayedCard(attackingPlayer).value;
    damagedPlayer.currentHp -= attackingValue;
    discardPlayedCard(attackingPlayer);
    enablePlayerShield(attackingPlayer);
};

function healingNormalHealth(healer, healedPlayer){
    let healingValue = getPlayedCard(healer).value;
    healedPlayer.currentHp += healingValue;
    if (healedPlayer.currentHp >= healedPlayer.maxHp){
        healedPlayer.currentHp = healedPlayer.maxHp;
    }
    discardPlayedCard(healer);
    enablePlayerShield(healer);
};

function healPassivePlayer(passivePlayer){
    passivePlayer.currentHp += passiveHealAmount;
    if(passivePlayer.currentHp >= passivePlayer.maxHp){
        passivePlayer.currentHp = passivePlayer.maxHp;
    }
    enablePlayerShield(passivePlayer);
};

function playShield(player) {
    player.currentHp -= shieldHpCost;
    disablePlayerShield(player);
};

function attackDeflected(attackingPlayer) {
    let attackingValue = getPlayedCard(attackingPlayer).value;
    attackingPlayer.currentHp -= attackingValue;

    discardPlayedCard(attackingPlayer);
    enablePlayerShield(attackingPlayer);
};

function enablePlayerShield(player){
    player.canPlayShield = true;
};

function disablePlayerShield(player){
    player.canPlayShield = false;
}

function resetPlayerActions(player) {
    player.action = null;
    player.actionCardIndex = null;
};

function drawCardsIfEmpty(player) {
    // if player's hand is empty, reload 3 new cards
    if (player.currentCards.filter(c => c != null).length == 0) {
        let newCards = [];
        newCards.push(player.remainingCardsStack.pop());
        newCards.push(player.remainingCardsStack.pop());
        newCards.push(player.remainingCardsStack.pop());
        player.currentCards = newCards;
    }
};

function generateNewDeckIfEmpty(player){
    if(player.remainingCardsStack.length == 0){
        player.remainingCardsStack = generateStartingCards();
    }
}

function discardPlayedCard(player) {
    player.currentCards[player.actionCardIndex] = null;
};

function getPlayedCard(player) {
    return player.currentCards[player.actionCardIndex];
}

export const computeRoundResult = (room) => {
    let playerOne = room.players[0].playerData;
    let playerTwo = room.players[1].playerData;
    
    if (playerOne.action == 'ATTACK' && playerTwo.action == 'ATTACK'){
        attackToAttack(playerOne, playerTwo);
    } else if (playerOne.action == 'ATTACK' && playerTwo.action == 'SHIELD') {
        playShield(playerTwo);
        attackDeflected(playerOne);
    } else if (playerOne.action == 'SHIELD' && playerTwo.action == 'ATTACK') {
        playShield(playerOne);
        attackDeflected(playerTwo);
    } else if (playerOne.action == 'SHIELD' && playerTwo.action == 'SHIELD'){
        playShield(playerOne);
        playShield(playerTwo);
    } else if (playerOne.action == 'ATTACK' && playerTwo.action == null) {
        healPassivePlayer(playerTwo);
        dealingNormalDamage(playerOne, playerTwo);
    } else if (playerOne.action == null && playerTwo.action == 'ATTACK') {
        healPassivePlayer(playerOne);
        dealingNormalDamage(playerTwo, playerOne);
    } else if (playerOne.action == 'SHIELD' && playerTwo.action == null ) {
        healPassivePlayer(playerTwo);
        playShield(playerOne);
    } else if (playerOne.action == null && playerTwo.action == 'SHIELD') {
        healPassivePlayer(playerOne);
        playShield(playerTwo);
    } else if (playerOne.action == null && playerTwo.action == null) {
        healPassivePlayer(playerOne);
        healPassivePlayer(playerTwo);
    }

    if (playerOne.currentHp < 0 && playerOne.currentHp < playerTwo.currentHp) {
        room.loser = room.players[0]._id;
        room.winner = room.players[1]._id;
        room.isGameEnded = true;
    } else if (playerTwo.currentHp < 0 && playerTwo.currentHp < playerOne.currentHp) {
        room.loser = room.players[1]._id;;
        room.winner = room.players[0]._id;;
        room.isGameEnded = true;
    } else {
        // reset players Actions and draw cards if hands are empty
        drawCardsIfEmpty(playerOne);
        drawCardsIfEmpty(playerTwo);

        generateNewDeckIfEmpty(playerOne);
        generateNewDeckIfEmpty(playerTwo);

        resetPlayerActions(playerOne);
        resetPlayerActions(playerTwo);
    }
}