chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callOpenAI") {
    chrome.storage.sync.get(['openaiApiKey'], async (result) => { // Made this callback async
      if (chrome.runtime.lastError) {
        const errorMsg = "Error retrieving API Key: " + chrome.runtime.lastError.message;
        console.error('Error retrieving API Key:', chrome.runtime.lastError.message);
        sendResponse({ error: errorMsg });
        // Also send error to side panel if it's relevant
        chrome.runtime.sendMessage({ action: "displaySummaryInSidePanel", error: errorMsg });
        // Attempt to open side panel even on error to show the message
        if (sender && sender.tab && sender.tab.id) {
          chrome.sidePanel.open({ tabId: sender.tab.id });
        }
        return; 
      }

      if (result.openaiApiKey) {
        const apiKey = result.openaiApiKey;
        const contentToSummarize = request.content;

        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  "role": "system",
                  "content": "You are a helpful assistant that summarizes web pages."
                },
                {
                  "role": "user",
                  "content": `Summarize the following content: ${contentToSummarize}`
                }
              ],
              max_tokens: 150
            })
          });

          const data = await response.json();

          if (response.ok) {
            if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
              const summary = data.choices[0].message.content.trim();
              sendResponse({ summary: summary }); // Send to popup

              // Send to side panel
              chrome.runtime.sendMessage({ action: "displaySummaryInSidePanel", summary: summary });
              if (sender && sender.tab && sender.tab.id) {
                chrome.sidePanel.open({ tabId: sender.tab.id });
              }

            } else {
              const errorMsg = "OpenAI API Error: Unexpected response structure.";
              console.error("OpenAI API Error: Unexpected response structure", data);
              sendResponse({ error: errorMsg });

              // Send error to side panel
              chrome.runtime.sendMessage({ action: "displaySummaryInSidePanel", error: errorMsg });
              if (sender && sender.tab && sender.tab.id) {
                chrome.sidePanel.open({ tabId: sender.tab.id });
              }
            }
          } else {
            const errorMsg = `OpenAI API Error: ${data.error?.message || response.statusText}`;
            console.error("OpenAI API Error:", data);
            sendResponse({ error: errorMsg });

            // Send error to side panel
            chrome.runtime.sendMessage({ action: "displaySummaryInSidePanel", error: errorMsg });
            if (sender && sender.tab && sender.tab.id) {
              chrome.sidePanel.open({ tabId: sender.tab.id });
            }
          }
        } catch (error) {
          const errorMsg = `Network error or other issue: ${error.message}`;
          console.error("Network error or other issue:", error);
          sendResponse({ error: errorMsg });

          // Send error to side panel
          chrome.runtime.sendMessage({ action: "displaySummaryInSidePanel", error: errorMsg });
          if (sender && sender.tab && sender.tab.id) {
            chrome.sidePanel.open({ tabId: sender.tab.id });
          }
        }
      } else {
        const errorMsg = "API Key not found. Please set it in the options.";
        sendResponse({ error: errorMsg });

        // Send error to side panel
        chrome.runtime.sendMessage({ action: "displaySummaryInSidePanel", error: errorMsg });
        if (sender && sender.tab && sender.tab.id) {
          chrome.sidePanel.open({ tabId: sender.tab.id });
        }
      }
    });
    return true; // Indicate that sendResponse will be called asynchronously
  }
});
