console.log("[Claude UI Slimmer] content script loaded");

chrome.runtime.onMessage.addListener((message) => {
  if (!message || !message.type) return;

  if (message.type === "CUS_UPDATE_ATTACHMENT_SIZE") {
    document.documentElement.style.setProperty(
      "--cus-attachment-size",
      `${message.value}px`
    );
  }

  if (message.type === "CUS_UPDATE_INPUT_MAX_HEIGHT") {
    document.documentElement.style.setProperty(
      "--cus-input-max-height",
      `${message.value}px`
    );
  }
});
