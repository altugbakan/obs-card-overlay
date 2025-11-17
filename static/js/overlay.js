import { socket } from "./utils.js";

socket.on("show_card", data => {
  const img = document.getElementById("card");
  img.classList.remove("visible");

  setTimeout(() => {
    img.src = data.url;
    img.onload = () => img.classList.add("visible");
  }, 200);
});
