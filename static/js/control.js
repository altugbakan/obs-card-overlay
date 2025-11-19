import { fetchCardByNumber, fetchQuery, sendCard } from "./api.js";
import { getCard, flipCard, saveCard } from "./card.js";
import { historyPush, navigateHistory } from "./history.js";
import "./hotkeys.js";

const input = document.getElementById("cardName");

window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("drop", async (e) => await handleDrop(e));

document.getElementById("prev").onclick = getPreviousCardInHistory;
document.getElementById("next").onclick = getNextCardInHistory;
document.getElementById("flip").onclick = flipCurrentCard;

document.getElementById("next-number").onclick = getNextCard;
document.getElementById("prev-number").onclick = getPreviousCard;

document.getElementById("send").onclick = sendToOverlay;
document.getElementById("cardName").onkeydown = async (e) => {
  switch (e.key) {
    case "Tab":
      e.preventDefault();
      const card = await fetchQuery(e.target.value.trim());
      saveCard(card);
      setPreviewImage(card.image);
      break;

    case "Enter":
      e.preventDefault();
      await sendToOverlay();
      break;
  }
};

export async function getNextCard() {
  const currentCard = getCard();
  if (!currentCard) return;

  const card = await fetchCardByNumber(currentCard.set, currentCard.number + 1);
  if (!card) {
    showToast("Could not fetch next card");
    return;
  }

  saveCard(card);
  setPreviewImage(card.image);
  sendCard(card);
  historyPush(card);
}

export async function getPreviousCard() {
  const currentCard = getCard();
  if (!currentCard) return;

  const card = await fetchCardByNumber(currentCard.set, currentCard.number - 1);
  if (!card) {
    showToast("Could not fetch previous card");
    return;
  }

  saveCard(card);
  setPreviewImage(card.image);
  sendCard(card);
  historyPush(card);
}

export function getNextCardInHistory() {
  const card = navigateHistory(1);
  if (!card) {
    showToast("Could not get next card in history");
    return;
  }

  saveCard(card);
  setPreviewImage(card.image);
  sendCard(card);
}

export function getPreviousCardInHistory() {
  const card = navigateHistory(-1);
  if (!card) {
    showToast("Could not get previous card in history");
    return;
  }

  saveCard(card);
  setPreviewImage(card.image);
  sendCard(card);
}

export function flipCurrentCard() {
  const card = flipCard();
  if (!card) {
    showToast("Cannot flip current card");
    return;
  }

  setPreviewImage(card.image);
  sendCard(card);
}

export async function sendToOverlay() {
  const name = input.value.trim();
  if (!name) {
    sendCard(getCard());
    return;
  }

  const card = await fetchQuery(name);
  if (!card) {
    showToast("Could not fetch card");
    return;
  }

  input.value = "";
  input.blur();

  saveCard(card);
  setPreviewImage(card.image);
  sendCard(card);
  historyPush(card);
}

export function setPreviewImage(img) {
  const preview = document.getElementById("preview");
  if (!preview) return;

  preview.onload = null;
  preview.onerror = null;

  if (img) {
    preview.src = img;
    preview.onload = () => {
      preview.classList.add("visible");
    };
    preview.onerror = () => {
      preview.classList.remove("visible");
      preview.src = "";
    };
  } else {
    preview.classList.remove("visible");
    preview.src = "";
  }
}

export function showToast(msg) {
  const container = document.getElementById("toast-container");

  if (!container) {
    console.warn("Toast container not found in DOM.");
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast`;
  toast.textContent = msg;

  container.appendChild(toast);

  setTimeout(() => toast.remove(), 2500);
}

export function focusInput(e) {
  const input = document.getElementById("cardName");
  if (input) {
    e.preventDefault();
    input.focus();

    const len = input.value?.length || 0;
    try {
      input.setSelectionRange(len, len);
    } catch (e) {}
  }
}

async function handleDrop(e) {
  e.preventDefault();

  const url = e.dataTransfer.getData("text/uri-list");

  if (!url) {
    showToast("No usable URL dropped");
    return;
  }

  const match = url.match(/\/card\/([^/]+)\/([^/]+)/i);
  if (!match) {
    showToast("URL does not match any card");
    return;
  }

  const [, set, number] = match;
  const card = await fetchCardByNumber(set, number);
  if (!card) {
    showToast("Could not fetch card");
    return;
  }

  saveCard(card);
  setPreviewImage(card.image);
  sendCard(card);
  historyPush(card);
}
