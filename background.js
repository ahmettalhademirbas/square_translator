chrome.action.onClicked.addListener((tab)=>{
    if(tab.id){
        chrome.tabs.sendMessage(tab.id, {action:"START_SELECTION"}, (response)=>{
            if(chrome.runtime.lastError){
                console.warn("Mesaj gönderilemedi:", chrome.runtime.lastError.message)
            }
        });
    }
});