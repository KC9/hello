# AI Web Page Summarizer Chrome Extension

## Overview

This Chrome extension allows users to summarize the content of the current web page using the OpenAI API (GPT models). It extracts the main text from the page, sends it to OpenAI for summarization, and displays the result in the extension's popup and a side panel.

## Features

*   Extracts main content from the active web page.
*   Calls the OpenAI API to generate a summary.
*   Displays the summary in the extension popup.
*   Displays the summary in an automatically opening side panel for easier reading.
*   Allows users to configure their OpenAI API Key via an options page.

## Setup Instructions

1.  **Download or Clone the Extension:**
    *   Ensure all the extension files (`manifest.json`, `popup.html`, `popup.js`, etc.) are in a single folder on your computer.

2.  **Load the Extension in Chrome:**
    *   Open Google Chrome.
    *   Navigate to `chrome://extensions`.
    *   Enable "Developer mode" using the toggle switch (usually in the top right corner).
    *   Click the "Load unpacked" button.
    *   Select the folder where you saved the extension files.

3.  **Set Your OpenAI API Key:**
    *   After loading the extension, find it in your Chrome toolbar (it might be under the puzzle piece icon).
    *   Right-click the extension icon and select "Options".
    *   Alternatively, go to the extension's card on the `chrome://extensions` page and click "Details", then "Extension options".
    *   Enter your OpenAI API Key in the input field and click "Save API Key".

## How to Use

1.  **Navigate to a Web Page:** Open the web page you want to summarize.
2.  **Open the Extension Popup:** Click on the AI Web Page Summarizer extension icon in the Chrome toolbar.
3.  **Request Summary:** Click the "Summarize Page" button in the popup.
4.  **View Summary:**
    *   The summary will appear directly in the popup.
    *   A side panel will also open automatically, displaying the summary.

## Troubleshooting

*   **"API Key not found" Error:** Ensure you have correctly saved your OpenAI API Key in the extension's options page.
*   **OpenAI API Errors:** If you see errors related to the OpenAI API (e.g., authentication issues, rate limits), please check your OpenAI account and API key validity.
*   **No Summary / Incorrect Content:** The content extraction tries its best to find the main text of a page. On some complex websites, it might not be perfect.
