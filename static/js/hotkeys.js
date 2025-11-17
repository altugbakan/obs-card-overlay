import { navigateHistory } from "./history.js";
import { flipCard, fetchCardByNumber } from "./api.js";

document.addEventListener("keydown", async e => {
  if (e.target.tagName === "INPUT") return;

  if (e.key === "/") {
    const input = document.getElementById("cardName");
    if (input) {
      e.preventDefault();
      input.focus();

      const len = input.value?.length || 0;
      try { input.setSelectionRange(len, len); } catch (e) { }
    }
    return;
  }

  switch (e.key) {
    case "ArrowLeft": await navigateHistory(-1); break;
    case "ArrowRight": await navigateHistory(1); break;
    case "f":
    case "F": flipCard(); break;
    case "n":
    case "N":
      if (window.currentSet && window.currentNumber)
        await fetchCardByNumber(window.currentSet, parseInt(window.currentNumber) + 1);
      break;
    case "b":
    case "B":
      if (window.currentSet && window.currentNumber > 1)
        await fetchCardByNumber(window.currentSet, parseInt(window.currentNumber) - 1);
      break;
  }
});
