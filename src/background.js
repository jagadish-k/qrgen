// Chrome Extension Service Worker (Manifest V3)
chrome.action.onClicked.addListener((tab) => {
  // Open the extension in a new tab when the extension icon is clicked
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
});