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

sendBtn.onclick = async () => {
  const name = input.value.trim();
  if (!name) return;

  await fetchPreview(name);
  sendCard(name);
  historyPush(name);
  input.value = "";
  // move focus away from the input so Enter blurs
  input.blur();
};

input.addEventListener("keydown", e => {
  if (e.key === "Tab") {
    e.preventDefault();
    fetchPreview(input.value.trim());
  }
});

input.addEventListener("keydown", async e => {
  if (e.key === "Enter") {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;

    await fetchPreview(name);
    sendCard(name);
    historyPush(name);
    input.value = "";
    // remove focus so subsequent hotkeys work
    input.blur();
  }
});
