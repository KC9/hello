chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getContent") {
    // Attempt to find the main content of the page.
    // Strategy 1: Look for <article> elements
    let mainContentElement = document.querySelector('article');

    // Strategy 2: If no <article>, look for <main> elements
    if (!mainContentElement) {
      mainContentElement = document.querySelector('main');
    }

    let extractedText;
    if (mainContentElement) {
      extractedText = mainContentElement.innerText;
    } else {
      // Fallback strategy: document.body.innerText
      // This can be refined later if needed.
      extractedText = document.body.innerText;
    }

    if (extractedText) {
      sendResponse({ content: extractedText });
    } else {
      sendResponse({ content: '' }); // Send empty string if nothing found
    }
  }
  // Return true to indicate that sendResponse will be called asynchronously
  // This is important even for synchronous operations in some cases.
  return true;
});
