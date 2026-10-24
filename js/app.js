(() => {
  "use strict";

  const tools = [];
  const navigationDock = document.getElementById("navigation-dock");
  const navigation = document.getElementById("tool-navigation");
  const navigationToggle = document.getElementById("navigation-toggle");
  const panels = document.getElementById("tool-panels");
  const status = document.getElementById("app-status");
  const themeSelect = document.getElementById("theme-select");
  const themeControl = themeSelect.closest(".theme-control");
  const themeStorageKey = "smart-classroom-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: light)");
  const compactNavigation = window.matchMedia("(max-width: 800px)");
  let activeTool = null;
  let dragState = null;
  let suppressNavigationClick = false;

  function clampDockPosition(left, top) {
    const maxLeft = Math.max(8, window.innerWidth - navigationToggle.offsetWidth - 8);
    const maxTop = Math.max(8, window.innerHeight - navigationToggle.offsetHeight - 8);
    return {
      left: Math.min(Math.max(8, left), maxLeft),
      top: Math.min(Math.max(8, top), maxTop)
    };
  }

  function positionDock(left, top) {
    const position = clampDockPosition(left, top);
    navigationDock.style.left = `${position.left}px`;
    navigationDock.style.top = `${position.top}px`;
    navigationDock.style.transform = "none";
    navigationDock.dataset.positioned = "true";
  }

  function positionNavigationMenu() {
    if (!compactNavigation.matches || navigationDock.dataset.expanded !== "true") return;

    const toggleRect = navigationToggle.getBoundingClientRect();
    const menuRect = navigation.getBoundingClientRect();
    const side = toggleRect.left + toggleRect.width / 2 > window.innerWidth / 2 ? "left" : "right";
    const left = side === "right"
      ? toggleRect.right + 8
      : toggleRect.left - menuRect.width - 8;
    const top = Math.min(
      Math.max(8, toggleRect.top + toggleRect.height / 2 - menuRect.height / 2),
      Math.max(8, window.innerHeight - menuRect.height - 8)
    );

    navigation.dataset.side = side;
    navigation.style.left = `${Math.max(8, Math.min(left, window.innerWidth - menuRect.width - 8))}px`;
    navigation.style.top = `${top}px`;
  }

  function clearDockPosition() {
    navigationDock.style.removeProperty("left");
    navigationDock.style.removeProperty("top");
    navigationDock.style.removeProperty("transform");
    delete navigationDock.dataset.positioned;
  }

  function setNavigationExpanded(expanded) {
    navigationDock.dataset.expanded = String(expanded);
    navigationToggle.setAttribute("aria-expanded", String(expanded));
    navigationToggle.setAttribute(
      "aria-label",
      `${expanded ? "關閉" : "開啟"}課堂工具`
    );
    if (expanded && compactNavigation.matches) {
      requestAnimationFrame(positionNavigationMenu);
    } else {
      navigation.style.removeProperty("left");
      navigation.style.removeProperty("top");
      delete navigation.dataset.side;
    }
  }

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
    themeControl.dataset.themePreference = preference;
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
      button.addEventListener("click", () => {
        show(tool.id);
        setNavigationExpanded(false);
        if (compactNavigation.matches) navigationToggle.focus();
      });

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
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    if (compactNavigation.matches && ["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    if (!compactNavigation.matches && ["ArrowUp", "ArrowDown"].includes(event.key)) return;
    const buttons = [...navigation.querySelectorAll('[role="tab"]')];
    const currentIndex = buttons.findIndex((button) => button.getAttribute("aria-selected") === "true");
    const nextIndex = event.key === "Home" ? 0
      : event.key === "End" ? buttons.length - 1
        : (currentIndex + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
    event.preventDefault();
    buttons[nextIndex].focus();
    show(buttons[nextIndex].id.replace("tab-", ""));
  });

  navigationToggle.addEventListener("pointerdown", (event) => {
    if (!compactNavigation.matches || !event.isPrimary || event.button !== 0) return;
    const rect = navigationToggle.getBoundingClientRect();
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      dragging: false
    };
    navigationToggle.setPointerCapture(event.pointerId);
  });
  navigationToggle.addEventListener("pointermove", (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
    if (!dragState.dragging && distance < 6) return;

    if (!dragState.dragging) {
      dragState.dragging = true;
      suppressNavigationClick = true;
      navigationDock.dataset.dragging = "true";
      setNavigationExpanded(false);
    }
    positionDock(event.clientX - dragState.offsetX, event.clientY - dragState.offsetY);
  });
  navigationToggle.addEventListener("pointerup", (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    if (dragState.dragging) {
      positionDock(
        event.clientX - dragState.offsetX,
        event.clientY - dragState.offsetY
      );
      navigationToggle.releasePointerCapture(event.pointerId);
      window.setTimeout(() => {
        suppressNavigationClick = false;
        delete navigationDock.dataset.dragging;
      }, 0);
    }
    dragState = null;
  });
  navigationToggle.addEventListener("pointercancel", () => {
    dragState = null;
    suppressNavigationClick = false;
    delete navigationDock.dataset.dragging;
  });
  navigationToggle.addEventListener("click", (event) => {
    if (suppressNavigationClick) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    setNavigationExpanded(navigationDock.dataset.expanded !== "true");
  });
  document.addEventListener("click", (event) => {
    if (compactNavigation.matches && !navigationDock.contains(event.target)) {
      setNavigationExpanded(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || navigationDock.dataset.expanded !== "true") return;
    setNavigationExpanded(false);
    navigationToggle.focus();
  });
  compactNavigation.addEventListener("change", (event) => {
    if (!event.matches) {
      setNavigationExpanded(false);
      clearDockPosition();
    }
  });
  window.addEventListener("resize", () => {
    if (!compactNavigation.matches) return;
    if (navigationDock.dataset.positioned === "true") {
      const rect = navigationToggle.getBoundingClientRect();
      positionDock(rect.left, rect.top);
    }
    positionNavigationMenu();
  });

  const initialTheme = loadThemePreference();
  themeSelect.value = initialTheme;
  themeControl.dataset.themePreference = initialTheme;
  applyTheme(initialTheme);
  themeSelect.addEventListener("change", () => setThemePreference(themeSelect.value));
  systemTheme.addEventListener("change", () => {
    if (themeSelect.value === "system") applyTheme("system");
  });

  window.addEventListener("hashchange", () => show(location.hash.slice(1), false));

  window.App = Object.freeze({ register, show });
  document.addEventListener("DOMContentLoaded", render, { once: true });
})();
