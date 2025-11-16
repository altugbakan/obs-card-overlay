const socket = io();
const img = document.getElementById("card");

socket.on("show_card", async (data) => {
  const name = data.name;
  if (!name) return;

  const query = encodeURIComponent(name);
  try {
    const res = await fetch(`https://api.scryfall.com/cards/search?q=${query}`);
    const json = await res.json();
    const card = json.data?.[0];
    const image = card?.image_uris?.normal || card?.card_faces?.[0]?.image_uris?.normal;

    if (image) {
      img.classList.remove("visible");
      setTimeout(() => {
        img.src = image;
        img.onload = () => img.classList.add("visible");
      }, 300);
    }
  } catch (err) {
    console.error(err);
  }
});
