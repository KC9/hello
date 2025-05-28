document.addEventListener('DOMContentLoaded', () => {
  const summarizeButton = document.getElementById('summarizeButton');
  const resultDiv = document.getElementById('resultDiv'); // Updated ID

  if (summarizeButton && resultDiv) {
    summarizeButton.addEventListener('click', () => {
      resultDiv.innerHTML = ''; // Clear previous results
      resultDiv.classList.remove('error'); // Clear error styling
      resultDiv.textContent = 'Extracting content...'; // Indicate activity

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
          const tabId = tabs[0].id;

          if (tabId) {
            chrome.tabs.sendMessage(tabId, { action: "getContent" }, (response) => {
              if (chrome.runtime.lastError) {
                resultDiv.textContent = 'Error: Could not communicate with the content script. ' + chrome.runtime.lastError.message;
                resultDiv.classList.add('error');
                console.error(chrome.runtime.lastError.message);
                return;
              }

              if (response && response.content) {
                resultDiv.textContent = 'Summarizing...'; // Update status

                chrome.runtime.sendMessage({ action: "callOpenAI", content: response.content }, (backgroundResponse) => {
                  resultDiv.innerHTML = ''; // Clear "Summarizing..."
                  resultDiv.classList.remove('error');

                  if (chrome.runtime.lastError) {
                    resultDiv.textContent = 'Error: Could not communicate with the background script. ' + chrome.runtime.lastError.message;
                    resultDiv.classList.add('error');
                    console.error('Background script communication error:', chrome.runtime.lastError.message);
                    return;
                  }

                  if (backgroundResponse) {
                    if (backgroundResponse.error) {
                      resultDiv.textContent = 'Error: ' + backgroundResponse.error;
                      resultDiv.classList.add('error');
                    } else if (backgroundResponse.summary) {
                      resultDiv.textContent = backgroundResponse.summary; // Display summary
                    } else {
                      resultDiv.textContent = 'Received an unexpected response from background.';
                    }
                  } else {
                    resultDiv.textContent = 'No response from background script.';
                  }
                });

              } else if (response) {
                resultDiv.textContent = 'No content extracted from the page.';
              } else {
                resultDiv.textContent = 'Error: No response from content script.';
                resultDiv.classList.add('error');
              }
            });
          } else {
            resultDiv.textContent = 'Error: Could not get active tab ID.';
            resultDiv.classList.add('error');
            console.error('Error: Could not get active tab ID.');
          }
        } else {
          resultDiv.textContent = 'Error: No active tab found.';
          resultDiv.classList.add('error');
          console.error('Error: No active tab found.');
        }
      });
    });
  } else {
    console.error('Could not find summarizeButton or resultDiv in popup.html');
    if (resultDiv) {
        resultDiv.textContent = 'Error: Popup elements not found.';
        resultDiv.classList.add('error');
    }
  }
});
