const DEFAULTS = {
  attachmentSize: 120,
  inputMaxHeight: 200,
  scrollFixEnabled: true,
};

function clamp(value, min, max) {
  const n = Number(value);
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function setupControl(sliderId, numberId, storageKey, min, max) {
  const slider = document.getElementById(sliderId);
  const number = document.getElementById(numberId);

  function apply(value, { save = true } = {}) {
    const v = clamp(value, min, max);
    slider.value = v;
    number.value = v;
    if (save) {
      chrome.storage.local.set({ [storageKey]: v });
    }
  }

  slider.addEventListener("input", () => apply(slider.value));
  number.addEventListener("input", () => {
    if (number.value === "") return;
    apply(number.value);
  });
  number.addEventListener("blur", () => apply(number.value || slider.value));

  return { apply };
}

const attachmentControl = setupControl(
  "attachmentSize", "attachmentSizeNumber", "attachmentSize", 40, 120
);
const inputHeightControl = setupControl(
  "inputMaxHeight", "inputMaxHeightNumber", "inputMaxHeight", 80, 458
);

const scrollFixToggle = document.getElementById("scrollFixToggle");

function applyScrollFixToggle(value, { save = true } = {}) {
  scrollFixToggle.checked = value;
  if (save) {
    chrome.storage.local.set({ scrollFixEnabled: value });
  }
}

scrollFixToggle.addEventListener("change", () => {
  applyScrollFixToggle(scrollFixToggle.checked);
});

// ポップアップを開いたタイミングで、保存済みの値をUIに反映(このときは保存し直さない)
chrome.storage.local.get(DEFAULTS, (values) => {
  attachmentControl.apply(values.attachmentSize, { save: false });
  inputHeightControl.apply(values.inputMaxHeight, { save: false });
  applyScrollFixToggle(values.scrollFixEnabled, { save: false });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  attachmentControl.apply(DEFAULTS.attachmentSize);
  inputHeightControl.apply(DEFAULTS.inputMaxHeight);
  applyScrollFixToggle(DEFAULTS.scrollFixEnabled);
});
