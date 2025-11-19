export function saveCard(card) {
  if (card.card_faces) {
    card.current_face = 0;
    card.name = card.card_faces[0].name;
    card.image = card.card_faces[0].image_uris.normal;
  } else {
    card.image = card.image_uris.normal;
  }
  card.number = parseInt(card.collector_number);

  window.card = card;
  return card;
}

export function getCard() {
  return window.card;
}

export function flipCard() {
  const card = getCard();
  if (!card?.card_faces) return;

  card.current_face = card.current_face === 0 ? 1 : 0;
  card.name = card.card_faces[card.current_face].name;
  card.image = card.card_faces[card.current_face].image_uris.normal;

  return card;
}
