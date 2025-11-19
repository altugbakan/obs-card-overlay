import { historyPush } from "./history.js";
import { showToast, socket } from "./utils.js";
import { getCard, saveCard } from "./card.js";
import { setPreviewImage } from "./controls.js";

export async function fetchPreview(query) {
  try {
    const searchQuery = `${query} game:paper`;
    const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
      searchQuery
    )}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      throw new Error("No results found.");
    }

    const card = data.data[0];
    saveCard(card);

    return card;
  } catch (err) {
    showToast(`Card not found: ${err}`);
    return;
  }
}

export function sendCard(card) {
  if (!card) return;

  setPreviewImage(card.image);
  socket.emit("set_card", { name: card.name, url: card.image });
}

export async function fetchNextCard() {
  const card = getCard();
  return fetchCardByNumber(card.set, parseInt(card.collector_number) + 1);
}

export async function fetchPreviousCard() {
  const card = getCard();
  return fetchCardByNumber(card.set, parseInt(card.collector_number) - 1);
}

export async function fetchCardByNumber(setCode, number, addToHistory = true) {
  try {
    const q = encodeURIComponent(`set:${setCode} number:${number} game:paper`);
    const res = await fetch(`https://api.scryfall.com/cards/search?q=${q}`);
    const data = await res.json();
    if (!data.data || !data.data.length) return;

    const card = data.data[0];
    saveCard(card);

    setPreviewImage(card.image);

    if (addToHistory) {
      historyPush(card);
    }

    sendCard(card);
  } catch (err) {
    showToast(`Could not fetch card ${setCode}-${number}`);
  }
}
