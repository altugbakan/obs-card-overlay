import { navigateHistory } from "./history.js";
import { flipCard, fetchCardByNumber } from "./api.js";
import { sendToOverlay } from "./controls.js";

function focusInput(e) {
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

document.addEventListener("keydown", async (e) => {
  if (e.target.tagName === "INPUT") return;

  switch (e.key) {
    case "Enter":
      e.preventDefault();
      await sendToOverlay();
      break;
    case "ArrowLeft":
    case "h":
    case "H":
      await navigateHistory(-1);
      break;
    case "ArrowRight":
    case "l":
    case "L":
      await navigateHistory(1);
      break;
    case "f":
    case "F":
      flipCard();
      break;
    case "n":
    case "N":
    case "k":
    case "K":
      if (window.currentSet && window.currentNumber)
        await fetchCardByNumber(
          window.currentSet,
          parseInt(window.currentNumber) + 1
        );
      break;
    case "b":
    case "B":
    case "j":
    case "J":
      if (window.currentSet && window.currentNumber > 1)
        await fetchCardByNumber(
          window.currentSet,
          parseInt(window.currentNumber) - 1
        );
      break;
    case "/":
      focusInput(e);
      break;
  }
});
