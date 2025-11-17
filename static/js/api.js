import { historyPush } from "./history.js";
import { socket } from "./utils.js";

function setPreviewImage(img) {
    const preview = document.getElementById("preview");
    if (!preview) return;

    preview.onload = null;
    preview.onerror = null;

    if (img) {
        preview.src = img;
        preview.onload = () => {
            preview.classList.add('visible');
        };
        preview.onerror = () => {
            preview.classList.remove('visible');
            preview.src = '';
        };
    } else {
        preview.classList.remove('visible');
        preview.src = '';
    }
}

export async function fetchPreview(query) {
    try {
        const searchQuery = `${query} game:paper`;
        const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(searchQuery)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.data || data.data.length === 0) {
            return { error: "No results found." };
        }

        const card = data.data[0];

        window.currentCardData = card;
        window.currentFace = 0;
        if (card.set) window.currentSet = card.set;
        if (card.collector_number) window.currentNumber = card.collector_number;

        let img = null;
        if (card.image_uris) {
            img = card.image_uris.normal;
        } else if (card.card_faces) {
            img = card.card_faces[0].image_uris?.normal ?? null;
        }
        setPreviewImage(img);

        return card;
    } catch (err) {
        console.error("fetchPreview failed", err);
        return { error: "Search failed." };
    }
}

export function sendCard(name) {
    const data = window.currentCardData;
    if (!data) return;

    const img = data.image_uris?.normal ||
        data.card_faces?.[window.currentFace]?.image_uris?.normal;
    socket.emit("set_card", { name, url: img });
}

export function sendCardNoHistory(name) {
    const data = window.currentCardData;
    if (!data) return;

    const img = data.image_uris?.normal ||
        data.card_faces?.[window.currentFace]?.image_uris?.normal;
    socket.emit("set_card", { name, url: img });
}

export async function fetchCardByNumber(setCode, number, addToHistory = true) {
    try {
        // Prefer paper prints when fetching by set/number
        const q = encodeURIComponent(`set:${setCode} number:${number} game:paper`);
        const res = await fetch(`https://api.scryfall.com/cards/search?q=${q}`);
        const data = await res.json();
        if (!data.data || !data.data.length) return;

        const card = data.data[0];

        window.currentCardData = card;
        window.currentSet = card.set;
        window.currentNumber = number;
        window.currentFace = 0;

        const img = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal;
        setPreviewImage(img);

        if (addToHistory) {
            sendCard(card.name);
            historyPush(card.name);
        } else {
            sendCardNoHistory(card.name);
        }

    } catch (err) {
        console.error("Number fetch failed", err);
    }
}

export function flipCard() {
    if (!window.currentCardData?.card_faces) return;

    window.currentFace = window.currentFace === 0 ? 1 : 0;

    const face = window.currentCardData.card_faces[window.currentFace];
    const img = face?.image_uris?.normal ?? null;

    try {
        setPreviewImage(img);
    } catch (e) { }

    const name = window.currentCardData.name || window.currentCardData.card_faces[0].name;
    sendCardNoHistory(name);
}
