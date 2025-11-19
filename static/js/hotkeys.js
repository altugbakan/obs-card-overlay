import { navigateHistory } from "./history.js";
import { fetchNextCard, fetchPreviousCard, sendCard } from "./api.js";
import { focusInput, sendToOverlay } from "./controls.js";
import { flipCard } from "./card.js";

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
      sendCard(flipCard());
      break;
    case "n":
    case "N":
    case "k":
    case "K":
      await fetchNextCard();
      break;
    case "b":
    case "B":
    case "j":
    case "J":
      await fetchPreviousCard();
      break;
    case "/":
      focusInput(e);
      break;
  }
});
