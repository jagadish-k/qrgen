// Background script for QR Code Generator extension
chrome.action.onClicked.addListener((tab) => {
  // Open the QR code generator in a new tab
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
});