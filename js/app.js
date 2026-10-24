(() => {
  "use strict";

  const tools = [];
  const navigation = document.getElementById("tool-navigation");
  const panels = document.getElementById("tool-panels");
  const status = document.getElementById("app-status");
  const themeSelect = document.getElementById("theme-select");
  const themeStorageKey = "smart-classroom-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: light)");
  let activeTool = null;

  function applyTheme(preference) {
    const resolved = preference === "system"
      ? (systemTheme.matches ? "light" : "dark")
      : preference;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", resolved === "light" ? "#f3f6fb" : "#101522");
    window.dispatchEvent(new CustomEvent("smart-classroom-themechange", {
      detail: { preference, resolved }
    }));
  }

  function loadThemePreference() {
    try {
      const saved = localStorage.getItem(themeStorageKey);
      return ["system", "light", "dark"].includes(saved) ? saved : "system";
    } catch (error) {
      console.warn("無法讀取主題偏好，將跟隨系統設定。", error);
      status.textContent = "無法讀取主題偏好，暫時跟隨系統設定";
      return "system";
    }
  }

  function setThemePreference(preference) {
    themeSelect.value = preference;
    applyTheme(preference);
    try {
      localStorage.setItem(themeStorageKey, preference);
      status.textContent = `已切換為${preference === "system" ? "跟隨系統" : preference === "light" ? "淺色" : "深色"}主題`;
    } catch (error) {
      console.warn("無法儲存主題偏好。", error);
      status.textContent = "主題已切換，但無法儲存偏好設定";
    }
  }

  function register(tool) {
    if (!tool || !tool.id || !tool.title || !tool.init) {
      throw new TypeError("工具必須提供 id、title 與 init。");
    }
    if (tools.some((item) => item.id === tool.id)) {
      throw new Error(`工具代號重複：${tool.id}`);
    }
    tools.push(tool);
  }

  function show(id, updateHash = true) {
    const selected = tools.find((tool) => tool.id === id) || tools[0];
    if (!selected) return;

    activeTool = selected;
    for (const tool of tools) {
      const panel = document.getElementById(`panel-${tool.id}`);
      const button = document.getElementById(`tab-${tool.id}`);
      const active = tool === selected;
      panel.hidden = !active;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    }

    if (!selected.initialized) {
      selected.init(document.getElementById(`panel-${selected.id}`));
      selected.initialized = true;
    }
    selected.show?.();

    if (updateHash && location.hash !== `#${selected.id}`) {
      history.replaceState(null, "", `#${selected.id}`);
    }
    status.textContent = `${selected.title}已就緒`;
  }

  function render() {
    for (const tool of tools) {
      const button = document.createElement("button");
      button.className = "tool-tab";
      button.id = `tab-${tool.id}`;
      button.type = "button";
      button.role = "tab";
      button.setAttribute("aria-controls", `panel-${tool.id}`);
      button.setAttribute("aria-selected", "false");
      button.tabIndex = -1;
      button.textContent = `${tool.icon ? `${tool.icon} ` : ""}${tool.title}`;
      button.addEventListener("click", () => show(tool.id));

      const panel = document.createElement("section");
      panel.className = "tool-panel";
      panel.id = `panel-${tool.id}`;
      panel.role = "tabpanel";
      panel.setAttribute("aria-labelledby", button.id);
      panel.hidden = true;

      navigation.append(button);
      panels.append(panel);
    }
    show(location.hash.slice(1), false);
  }

  navigation.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const buttons = [...navigation.querySelectorAll('[role="tab"]')];
    const currentIndex = buttons.findIndex((button) => button.getAttribute("aria-selected") === "true");
    const nextIndex = event.key === "Home" ? 0
      : event.key === "End" ? buttons.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    event.preventDefault();
    buttons[nextIndex].focus();
    show(buttons[nextIndex].id.replace("tab-", ""));
  });

  const initialTheme = loadThemePreference();
  themeSelect.value = initialTheme;
  applyTheme(initialTheme);
  themeSelect.addEventListener("change", () => setThemePreference(themeSelect.value));
  systemTheme.addEventListener("change", () => {
    if (themeSelect.value === "system") applyTheme("system");
  });

  window.addEventListener("hashchange", () => show(location.hash.slice(1), false));

  window.App = Object.freeze({ register, show });
  document.addEventListener("DOMContentLoaded", render, { once: true });
})();
