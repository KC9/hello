document.addEventListener('DOMContentLoaded', () => {
  const sidePanelResultDiv = document.getElementById('sidePanelResult');

  if (!sidePanelResultDiv) {
    console.error("Side Panel Error: Could not find sidePanelResult div.");
    return;
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Check if the message is intended for the side panel
    if (message.action === "displaySummaryInSidePanel") {
      sidePanelResultDiv.innerHTML = ''; // Clear previous content
      sidePanelResultDiv.classList.remove('error'); // Clear previous error styling

      if (message.error) {
        sidePanelResultDiv.textContent = message.error;
        sidePanelResultDiv.classList.add('error');
        console.error("Error displayed in side panel:", message.error);
      } else if (message.summary) {
        sidePanelResultDiv.textContent = message.summary;
      } else {
        sidePanelResultDiv.textContent = "Received an unexpected message format.";
        console.warn("Side panel received an unexpected message:", message);
      }
      // Optionally, send a response back to the sender if needed
      // sendResponse({ status: "Message received by side panel" });
    }
    // Return true if you intend to send a response asynchronously, otherwise it's not strictly necessary
    // if handling messages synchronously or not sending a response.
    // For this listener, it's safer to return true if there's any chance of async operations later.
    return true;
  });

  // Initial message for the side panel (optional)
  sidePanelResultDiv.textContent = "Side panel ready. Summarize a page to see the result here.";
});
