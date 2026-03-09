/// <reference types="chrome-types" />

chrome.runtime.onInstalled.addListener((details) => {
  console.log('GMB Audit Tool installed:', details.reason);
});
