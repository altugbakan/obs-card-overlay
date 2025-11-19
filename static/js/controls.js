import { fetchPreview, sendCard, fetchCardByNumber } from "./api.js";
import { getCard, flipCard } from "./card.js";
import { historyPush, navigateHistory } from "./history.js";
import "./hotkeys.js";

const input = document.getElementById("cardName");
const sendBtn = document.getElementById("send");

document.getElementById("prev").onclick = async () => await navigateHistory(-1);
document.getElementById("next").onclick = async () => await navigateHistory(1);
document.getElementById("flip").onclick = () => flipCard();

document.getElementById("next-number").onclick = () => {
  const card = getCard();
  if (card.collector_number && card.set)
    fetchCardByNumber(card.set, parseInt(card.collector_number) + 1);
};

document.getElementById("prev-number").onclick = () => {
  const card = getCard();
  if (card.collector_number && card.set)
    fetchCardByNumber(card.set, parseInt(card.collector_number) - 1);
};

export async function sendToOverlay() {
  const name = input.value.trim();
  if (!name) {
    sendCard(getCard());
    return;
  }

  const card = await fetchPreview(name);
  if (!card) return;

  sendCard(card);
  historyPush(name);
  input.value = "";
  input.blur();
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

sendBtn.addEventListener("click", async () => {
  await sendToOverlay();
});

input.addEventListener("keydown", async (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    await fetchPreview(input.value.trim());
  }
});

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    await sendToOverlay();
  }
});
