let isSelecting = false;
let startX = 0;
let startY = 0;
let overlayElement = null;
let boxElement = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "START_SELECTION") {
        initSelectionMode();
        sendResponse({ status: "SELECTION_STARTED" })
    }
})
function initSelectionMode() {
    if (document.getElementById("area-translator-overlay")) return;

    removeExistingBox()

    overlayElement = document.createElement("div");
    overlayElement.id = "area-translator-overlay";
    document.documentElement.appendChild(overlayElement);

    overlayElement.addEventListener("mousedown", onMouseDown, true);
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("mouseup", onMouseUp, true);
}

function onMouseDown(e) {
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;

    console.log("MouseDown tetiklendi. Başlangıç:", startX, startY);

    removeExistingBox();
    boxElement = document.createElement("div");
    boxElement.id = "area-translator-box";

    boxElement.style.position = "fixed";
    boxElement.style.left = `${startX}px`;
    boxElement.style.top = `${startY}px`;
    boxElement.style.width = "0px";
    boxElement.style.height = "0px";

    document.documentElement.appendChild(boxElement);
}

function onMouseMove(e) {
    if (!isSelecting || !boxElement) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    boxElement.style.left = `${left}px`;
    boxElement.style.top = `${top}px`;
    boxElement.style.width = `${width}px`;
    boxElement.style.height = `${height}px`;
    console.log(`Çiziliyor: ${width}x${height}`);
}

function onMouseUp(e) {
    if (!isSelecting) return;
    isSelecting = false;

    const endX = e.clientX;
    const endY = e.clientY;

    const selectedRect = {
        left: Math.min(startX, endY),
        top: Math.min(startY, endY),
        right: Math.max(startX, endX),
        bottom: Math.max(startY - endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY)
    }

    cleanupOverlay()

    if (selectedRect.width < 10 || selectedRect.height < 10) {
        console.log("Alan çok küçük, seçim iptal edildi.");
        removeExistingBox();
    } else {
        console.log("Başarılı seçim! Boyut:", selectedRect.width, "x", selectedRect.height);
    }
}

function cleanupOverlay() {
    if (overlayElement) {
        overlayElement.remove()
        overlayElement = null
    }
    window.removeEventListener("mousemove", onMouseMove)
    window.removeEventListener("mouseup", onMouseUp)
}

function removeExistingBox() {
    if (boxElement) {
        boxElement.remove();
        boxElement = null;
    }
    const oldBox = document.getElementById("area-translator-box");
    if (oldBox) oldBox.remove();
}