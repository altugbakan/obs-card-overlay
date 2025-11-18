import { fetchCardByNumber } from "./api.js";

let cardHistory = [];
let historyIndex = -1;

const MAX_HISTORY = 25;

export function historyPush(name) {
  if (historyIndex < cardHistory.length - 1) {
    cardHistory = cardHistory.slice(0, historyIndex + 1);
  }

  cardHistory.push({
    name,
    face: window.currentFace,
    set: window.currentSet,
    number: window.currentNumber
  });

  if (cardHistory.length > MAX_HISTORY) {
    cardHistory.shift();
  }

  historyIndex = cardHistory.length - 1;
}

export async function navigateHistory(offset) {
  const newIndex = historyIndex + offset;
  if (newIndex < 0 || newIndex >= cardHistory.length) {
    return false;
  }

  historyIndex = newIndex;
  const card = cardHistory[historyIndex];

  window.currentFace = card.face;
  window.currentSet = card.set;
  window.currentNumber = card.number;

  await fetchCardByNumber(card.set, card.number, false);
  return true;
}
