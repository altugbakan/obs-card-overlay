import {
  flipCurrentCard,
  focusInput,
  getNextCard,
  getNextCardInHistory,
  getPreviousCard,
  getPreviousCardInHistory,
  sendToOverlay,
} from "./control.js";

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
      getPreviousCardInHistory();
      break;
    case "ArrowRight":
    case "l":
    case "L":
      getNextCardInHistory();
      break;
    case "f":
    case "F":
      flipCurrentCard();
      break;
    case "ArrowUp":
    case "n":
    case "N":
    case "k":
    case "K":
      await getNextCard();
      break;
    case "ArrowDown":
    case "b":
    case "B":
    case "j":
    case "J":
      await getPreviousCard();
      break;
    case "/":
      focusInput(e);
      break;
  }
});
