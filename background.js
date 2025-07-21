chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    return { redirectUrl: chrome.runtime.getURL("blocked.html") };
  },
  { urls: ["*://www.youtube.com/*"] },
  ["blocking"]
);
