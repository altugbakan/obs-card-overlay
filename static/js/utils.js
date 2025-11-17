export const socket = io("http://127.0.0.1:5000");
export const showToast = (msg, type = "error") => {
    const container = document.getElementById("toast-container");

    if (!container) {
        console.warn("Toast container not found in DOM.");
        return;
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = msg;

    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3500);
};
