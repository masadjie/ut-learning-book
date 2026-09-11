/**
 * Background Service Worker for UT Book Auto-Scanner
 * Manifest V3 Compliant
 */

// Initialize badge and state
chrome.runtime.onInstalled.addListener(async () => {
  await chrome.action.setBadgeText({ text: '' });
  await chrome.action.setBadgeBackgroundColor({ color: '#0284c7' });
});

// Handle messages from content script & popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message.action === 'STATE_UPDATED') {
      const count = message.count || 0;
      const text = count > 0 ? String(count) : '';
      await chrome.action.setBadgeText({ text });
      
      if (message.isScanning) {
        await chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
      } else {
        await chrome.action.setBadgeBackgroundColor({ color: '#0284c7' });
      }
      sendResponse({ received: true });
    } else if (message.action === 'CAPTURE_TAB_SCREEN') {
      try {
        let winId = null;
        if (sender && sender.tab && typeof sender.tab.windowId === 'number') {
          winId = sender.tab.windowId;
        } else {
          const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
          winId = activeTab ? activeTab.windowId : null;
        }
        const dataUrl = await chrome.tabs.captureVisibleTab(winId, { format: 'jpeg', quality: 85 });
        sendResponse({ success: true, dataUrl });
      } catch (err) {
        console.error('Screenshot failed:', err);
        sendResponse({ success: false, error: err.message });
      }
    }
  })();
  return true; // Keep message channel open for async response
});
