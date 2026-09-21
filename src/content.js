console.log("[Claude UI Slimmer] content script loaded");

const DEFAULTS = {
  attachmentSize: 120,
  inputMaxHeight: 200,
};

function applySettings(values) {
  if (values.attachmentSize !== undefined) {
    document.documentElement.style.setProperty(
      "--cus-attachment-size",
      `${values.attachmentSize}px`
    );
  }
  if (values.inputMaxHeight !== undefined) {
    document.documentElement.style.setProperty(
      "--cus-input-max-height",
      `${values.inputMaxHeight}px`
    );
  }
}

// ページ読み込み時、保存済みの設定(なければデフォルト)を反映
chrome.storage.local.get(DEFAULTS, (values) => {
  applySettings(values);
});

// popupなど他コンテキストからの変更をリアルタイムに反映
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") return;

  const updates = {};
  if (changes.attachmentSize) updates.attachmentSize = changes.attachmentSize.newValue;
  if (changes.inputMaxHeight) updates.inputMaxHeight = changes.inputMaxHeight.newValue;

  if (Object.keys(updates).length > 0) {
    applySettings(updates);
  }
});
