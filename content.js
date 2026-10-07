console.log("Alan Çevirici: Content script sayfaya başarıyla yüklendi.")

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message.action === "START_SELECTION"){
        console.log("Seçim modu sinyali alındı!");
        sendResponse({status:"SELECTION_INITIATED"})
    }
})