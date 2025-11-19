import { socket } from "./utils.js";

export async function fetchQuery(query) {
  const searchQuery = `${query} game:paper`;
  const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
    searchQuery
  )}`;

  const res = await fetch(url);
  if (!res.ok) {
    return;
  }

  const data = await res.json();
  if (!data.data || data.data.length === 0) {
    return;
  }

  return data.data[0];
}

export async function fetchCardByNumber(setCode, number) {
  if (!setCode || !number) return;

  return fetchQuery(`set:${setCode} number:${number}`);
}

export function sendCard(card) {
  if (!card) return;

  socket.emit("set_card", { name: card.name, url: card.image });
}
