/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener((details) => {
  console.log('GMB Audit Tool installed:', details.reason);
});
