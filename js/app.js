(() => {
  "use strict";

  const tools = [];
  const navigation = document.getElementById("tool-navigation");
  const panels = document.getElementById("tool-panels");
  const status = document.getElementById("app-status");
  let activeTool = null;

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

  window.addEventListener("hashchange", () => show(location.hash.slice(1), false));

  window.App = Object.freeze({ register, show });
  document.addEventListener("DOMContentLoaded", render, { once: true });
})();
