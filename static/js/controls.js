import { fetchPreview, sendCard, fetchCardByNumber, flipCard } from "./api.js";
import { historyPush, navigateHistory } from "./history.js";
import "./hotkeys.js";

const input = document.getElementById("cardName");
const sendBtn = document.getElementById("send");

document.getElementById("prev").onclick = async () => await navigateHistory(-1);
document.getElementById("next").onclick = async () => await navigateHistory(1);
document.getElementById("flip").onclick = () => flipCard();

document.getElementById("next-number").onclick = () => {
  window.currentNumber && window.currentSet &&
    fetchCardByNumber(window.currentSet, parseInt(window.currentNumber) + 1);
};

document.getElementById("prev-number").onclick = () => {
  if (window.currentNumber > 1) {
    fetchCardByNumber(window.currentSet, parseInt(window.currentNumber) - 1);
  }
};

export async function sendToOverlay() {
  const name = input.value.trim();
  if (!name) {
    sendCard(window.currentCardData.name);
    return;
  }

  const card = await fetchPreview(name);
  if (!card) return;

  sendCard(name);
  historyPush(name);
  input.value = "";
  input.blur();
}

sendBtn.addEventListener("click", async () => {
  await sendToOverlay();
});

input.addEventListener("keydown", async e => {
  if (e.key === "Tab") {
    e.preventDefault();
    await fetchPreview(input.value.trim());
  }
});

input.addEventListener("keydown", async e => {
  if (e.key === "Enter") {
    e.preventDefault();

    await sendToOverlay();
  }
});
