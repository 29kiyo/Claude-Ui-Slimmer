const DEFAULTS = {
  attachmentSize: 120,
  inputMaxHeight: 200,
};

function sendToActiveTab(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
  });
}

function clamp(value, min, max) {
  const n = Number(value);
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function setupControl(sliderId, numberId, messageType, min, max) {
  const slider = document.getElementById(sliderId);
  const number = document.getElementById(numberId);

  function apply(value) {
    const v = clamp(value, min, max);
    slider.value = v;
    number.value = v;
    sendToActiveTab({ type: messageType, value: v });
  }

  slider.addEventListener("input", () => apply(slider.value));

  // 入力中はそのまま反映(即時リアルタイム)、範囲外は blur 時に補正
  number.addEventListener("input", () => {
    if (number.value === "") return;
    apply(number.value);
  });
  number.addEventListener("blur", () => apply(number.value || slider.value));

  return { apply };
}

const attachmentControl = setupControl(
  "attachmentSize",
  "attachmentSizeNumber",
  "CUS_UPDATE_ATTACHMENT_SIZE",
  40,
  120
);

const inputHeightControl = setupControl(
  "inputMaxHeight",
  "inputMaxHeightNumber",
  "CUS_UPDATE_INPUT_MAX_HEIGHT",
  80,
  458
);

document.getElementById("resetBtn").addEventListener("click", () => {
  attachmentControl.apply(DEFAULTS.attachmentSize);
  inputHeightControl.apply(DEFAULTS.inputMaxHeight);
});
