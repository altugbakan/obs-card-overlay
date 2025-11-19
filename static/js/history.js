let cardHistory = [];
let historyIndex = -1;

const MAX_HISTORY = 25;

export function historyPush(card) {
  if (historyIndex < cardHistory.length - 1) {
    cardHistory = cardHistory.slice(0, historyIndex + 1);
  }

  cardHistory.push(card);

  if (cardHistory.length > MAX_HISTORY) {
    cardHistory.shift();
  }

  historyIndex = cardHistory.length - 1;
}

export function navigateHistory(offset) {
  const newIndex = historyIndex + offset;
  if (newIndex < 0 || newIndex >= cardHistory.length) {
    return;
  }

  historyIndex = newIndex;
  const card = cardHistory[historyIndex];

  return card;
}
