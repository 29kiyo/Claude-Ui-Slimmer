console.log("[Claude UI Slimmer] content script loaded");

const DEFAULTS = {
  attachmentSize: 120,
  inputMaxHeight: 200,
  scrollFixEnabled: true,
};

const COMPOSER_SELECTOR = '[data-cds="ChatComposerEditor"]';
const EXPAND_BUTTON_CLASS = "cus-expand-toggle";
const EXPANDED_CLASS = "cus-expanded";
const EXPANDED_MAX_HEIGHT = "70vh";

let cusScrollFixEnabled = DEFAULTS.scrollFixEnabled;

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
  if (values.scrollFixEnabled !== undefined) {
    cusScrollFixEnabled = values.scrollFixEnabled;
    cusSyncAllButtons();
  }
}

chrome.storage.local.get(DEFAULTS, (values) => applySettings(values));

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") return;

  const updates = {};
  if (changes.attachmentSize) updates.attachmentSize = changes.attachmentSize.newValue;
  if (changes.inputMaxHeight) updates.inputMaxHeight = changes.inputMaxHeight.newValue;
  if (changes.scrollFixEnabled) updates.scrollFixEnabled = changes.scrollFixEnabled.newValue;

  if (Object.keys(updates).length > 0) {
    applySettings(updates);
  }
});

/* ===== 入力欄の手動拡大ボタン =====
 * ボタンは el(入力欄・スクロールする箱)の子ではなく document.body 直下に position:fixed で配置する。
 * el の子にすると、el内部のスクロール(scrollTop)に連動してボタンも一緒に動いてしまうため。
 * body直下+fixedにすることで、el内部のスクロールの影響を受けず、常に画面上の同じ位置に留まる。
 * el自体の位置・サイズが変わったとき(拡大/縮小、ウィンドウリサイズ等)は ResizeObserver で追従する。
 */

const cusButtonMap = new Map(); // el -> { btn, resizeObserver }

function cusPositionButton(el, btn) {
  const rect = el.getBoundingClientRect();
  const btnSize = 22;
  // 縦スクロールバーが出ている場合、その幅の分だけ余計に左へオフセットし、
  // スクロールバーとボタンが重ならないようにする
  const scrollbarWidth = Math.max(0, el.offsetWidth - el.clientWidth);
  btn.style.top = `${Math.round(rect.top + 4)}px`;
  btn.style.left = `${Math.round(rect.right - btnSize - 4 - scrollbarWidth)}px`;
}

function cusCollapseEl(el, btn) {
  el.classList.remove(EXPANDED_CLASS);
  el.style.removeProperty("max-height");
  btn.textContent = "⤢";
  btn.title = "入力欄を拡大 (Claude UI Slimmer)";
  requestAnimationFrame(() => cusPositionButton(el, btn));
}

function cusExpandEl(el, btn) {
  el.classList.add(EXPANDED_CLASS);
  el.style.setProperty("max-height", EXPANDED_MAX_HEIGHT, "important");
  btn.textContent = "⤡";
  btn.title = "入力欄を縮小 (Claude UI Slimmer)";
  requestAnimationFrame(() => cusPositionButton(el, btn));
}

function cusToggleEl(el, btn) {
  if (el.classList.contains(EXPANDED_CLASS)) {
    cusCollapseEl(el, btn);
  } else {
    cusExpandEl(el, btn);
  }
}

// 拡大中の入力欄について、中身の変化(送信・削除等)を監視し、
// 縮小時の上限(--cus-input-max-height)内に収まる高さまで内容が減った場合は
// 自動的に縮小状態へ戻す
function cusCheckAutoCollapse(el, btn) {
  if (!el.classList.contains(EXPANDED_CLASS)) return;

  const maxHeightStr = getComputedStyle(document.documentElement)
    .getPropertyValue("--cus-input-max-height")
    .trim();
  const maxHeightPx = parseFloat(maxHeightStr);
  if (!maxHeightPx || Number.isNaN(maxHeightPx)) return;

  // scrollHeight は現在の拡大表示での「実際に必要な高さ」を表す
  if (el.scrollHeight <= maxHeightPx) {
    cusCollapseEl(el, btn);
  }
}

function cusCreateButtonFor(el) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = EXPAND_BUTTON_CLASS;
  btn.textContent = "⤢";
  btn.title = "入力欄を拡大 (Claude UI Slimmer)";
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    cusToggleEl(el, btn);
  });
  btn.addEventListener("mousedown", (e) => e.stopPropagation());

  document.body.appendChild(btn);
  cusPositionButton(el, btn);
  // 作成直後はレイアウトが確定しきっていないことがあるため、
  // 次フレーム・少し遅延後にも再計算して確実に正しい位置へ合わせる
  requestAnimationFrame(() => cusPositionButton(el, btn));
  setTimeout(() => cusPositionButton(el, btn), 100);
  setTimeout(() => cusPositionButton(el, btn), 400);

  const resizeObserver = new ResizeObserver(() => cusPositionButton(el, btn));
  resizeObserver.observe(el);

  el.addEventListener("scroll", () => cusPositionButton(el, btn));

  // 入力欄の中身(文字入力・送信による全消去など)の変化を監視し、
  // 拡大不要になったタイミングで自動的に縮小する
  const contentObserver = new MutationObserver(() => cusCheckAutoCollapse(el, btn));
  contentObserver.observe(el, { childList: true, subtree: true, characterData: true });

  cusButtonMap.set(el, { btn, resizeObserver, contentObserver });
}

function cusRemoveButtonFor(el) {
  const entry = cusButtonMap.get(el);
  if (!entry) return;
  // 拡大中にボタン自体が消える(トグルOFF)場合、拡大したままにせず、
  // 入力欄の最大高さ設定(--cus-input-max-height)まで確実に戻す
  if (el.classList.contains(EXPANDED_CLASS)) {
    cusCollapseEl(el, entry.btn);
  }
  if (entry.contentObserver) entry.contentObserver.disconnect();
  entry.resizeObserver.disconnect();
  entry.btn.remove();
  cusButtonMap.delete(el);
}

function cusSyncAllButtons() {
  const currentEls = new Set(document.querySelectorAll(COMPOSER_SELECTOR));

  // 消えた入力欄(ページ遷移等)に対応するボタンを掃除
  for (const el of cusButtonMap.keys()) {
    if (!currentEls.has(el) || !cusScrollFixEnabled) {
      cusRemoveButtonFor(el);
    }
  }

  if (!cusScrollFixEnabled) return;

  for (const el of currentEls) {
    if (!cusButtonMap.has(el)) {
      cusCreateButtonFor(el);
    }
  }
}

// 初回チェック + SPAでの入力欄の再生成(ページ遷移等)に対応するための監視
cusSyncAllButtons();
const cusObserver = new MutationObserver(() => {
  cusSyncAllButtons();
  cusRepositionAll();
});
cusObserver.observe(document.body, { childList: true, subtree: true });

// ページ全体のスクロール・ウィンドウリサイズでもボタン位置を追従させる
function cusRepositionAll() {
  cusButtonMap.forEach(({ btn }, el) => cusPositionButton(el, btn));
}
window.addEventListener("scroll", cusRepositionAll, true);
window.addEventListener("resize", cusRepositionAll);
