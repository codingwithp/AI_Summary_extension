chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.sync.get(["API"]),(result)=>{
        if(!result.API){
            chrome.tabs.create({url:"options.html"})
        }
    }
})