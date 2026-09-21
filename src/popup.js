const attachmentSlider = document.getElementById("attachmentSize");
const attachmentValue = document.getElementById("attachmentSizeValue");
const inputHeightSlider = document.getElementById("inputMaxHeight");
const inputHeightValue = document.getElementById("inputMaxHeightValue");

function sendToActiveTab(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
  });
}

attachmentSlider.addEventListener("input", () => {
  attachmentValue.textContent = attachmentSlider.value;
  sendToActiveTab({
    type: "CUS_UPDATE_ATTACHMENT_SIZE",
    value: attachmentSlider.value,
  });
});

inputHeightSlider.addEventListener("input", () => {
  inputHeightValue.textContent = inputHeightSlider.value;
  sendToActiveTab({
    type: "CUS_UPDATE_INPUT_MAX_HEIGHT",
    value: inputHeightSlider.value,
  });
});
