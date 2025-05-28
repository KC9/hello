document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveApiKeyButton = document.getElementById('saveApiKeyButton');
  const statusDiv = document.getElementById('status');

  // Load existing key
  chrome.storage.sync.get(['openaiApiKey'], (result) => {
    if (result.openaiApiKey) {
      apiKeyInput.value = result.openaiApiKey;
    }
  });

  // Save key
  saveApiKeyButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    if (!apiKey) {
      statusDiv.textContent = 'API Key cannot be empty.';
      setTimeout(() => {
        statusDiv.textContent = '';
      }, 3000);
      return;
    }
    chrome.storage.sync.set({ 'openaiApiKey': apiKey }, () => {
      if (chrome.runtime.lastError) {
        statusDiv.textContent = 'Error saving API Key: ' + chrome.runtime.lastError.message;
      } else {
        statusDiv.textContent = 'API Key saved!';
      }
      setTimeout(() => {
        statusDiv.textContent = '';
      }, 3000);
    });
  });
});
