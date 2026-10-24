App.register({
  id: "board",
  title: "無限白板",
  icon: "🎨",
  init(el) {
    el.classList.add("tool-root");
    el.dataset.toolRoot = "board";
    el.innerHTML = "<canvas id=\"board-board\" aria-label=\"課堂無限白板\"></canvas>\n\n  <aside class=\"toolbar\" id=\"board-toolbar\" aria-label=\"白板工具列\">\n    <h1>課堂無限白板</h1>\n\n    <span class=\"section-label\">工具</span>\n    <div class=\"tool-grid\" role=\"group\" aria-label=\"繪圖工具\">\n      <button class=\"tool-button active\" type=\"button\" data-tool=\"pen\" aria-label=\"粉筆筆\" title=\"粉筆筆\">✎<span>粉筆</span></button>\n      <button class=\"tool-button\" type=\"button\" data-tool=\"eraser\" aria-label=\"橡皮擦\" title=\"橡皮擦\">▱<span>橡皮擦</span></button>\n      <button class=\"tool-button\" type=\"button\" data-tool=\"pan\" aria-label=\"平移畫布\" title=\"平移畫布\">✋<span>平移</span></button>\n      <button class=\"tool-button\" type=\"button\" data-tool=\"line\" aria-label=\"直線\" title=\"直線\">╱<span>直線</span></button>\n      <button class=\"tool-button\" type=\"button\" data-tool=\"rect\" aria-label=\"矩形\" title=\"矩形\">▢<span>矩形</span></button>\n      <button class=\"tool-button\" type=\"button\" data-tool=\"circle\" aria-label=\"圓形\" title=\"圓形\">◯<span>圓形</span></button>\n    </div>\n\n    <span class=\"section-label\">粉筆顏色</span>\n    <div class=\"color-grid\" role=\"group\" aria-label=\"筆刷顏色\">\n      <button class=\"color-button active\" type=\"button\" data-color=\"#f4f6ef\" aria-label=\"白色\" title=\"白色\" style=\"background:#f4f6ef\"></button>\n      <button class=\"color-button\" type=\"button\" data-color=\"#ff5d62\" aria-label=\"紅色\" title=\"紅色\" style=\"background:#ff5d62\"></button>\n      <button class=\"color-button\" type=\"button\" data-color=\"#ffe45e\" aria-label=\"黃色\" title=\"黃色\" style=\"background:#ffe45e\"></button>\n      <button class=\"color-button\" type=\"button\" data-color=\"#65ed91\" aria-label=\"綠色\" title=\"綠色\" style=\"background:#65ed91\"></button>\n      <button class=\"color-button\" type=\"button\" data-color=\"#62baff\" aria-label=\"藍色\" title=\"藍色\" style=\"background:#62baff\"></button>\n    </div>\n\n    <label class=\"section-label\" for=\"board-brush-width\">筆刷粗細</label>\n    <div class=\"range-row\">\n      <input id=\"board-brush-width\" type=\"range\" min=\"2\" max=\"24\" value=\"6\">\n      <output id=\"board-width-value\" for=\"board-brush-width\">6 px</output>\n    </div>\n\n    <label class=\"toggle-row\" for=\"board-grid-toggle\">\n      <span>背景格線</span>\n      <input id=\"board-grid-toggle\" type=\"checkbox\">\n    </label>\n\n    <div class=\"action-grid\">\n      <button class=\"action-button\" id=\"board-undo-button\" type=\"button\" title=\"復原（Ctrl/Cmd+Z）\">↶ 復原</button>\n      <button class=\"action-button danger\" id=\"board-clear-button\" type=\"button\">清除全部</button>\n      <button class=\"action-button primary\" id=\"board-download-button\" type=\"button\">下載圖片</button>\n      <button class=\"action-button\" id=\"board-zoom-reset-button\" type=\"button\" title=\"重設視角\">重設視角</button>\n    </div>\n  </aside>\n\n  <div class=\"toolbar-toggle\">\n    <button class=\"collapse-button\" id=\"board-collapse-button\" type=\"button\" aria-label=\"收合工具列\" title=\"收合工具列\">‹</button>\n  </div>\n  <div id=\"board-status\" role=\"status\" aria-live=\"polite\">空白鍵平移 · 滾輪／雙指縮放</div>";
    (() => {
      "use strict";


      const STORAGE_KEY = "classroom-infinite-whiteboard-v1";
      const BACKGROUND = "#17211b";
      const canvas = el.querySelector("#board-board");
      const ctx = canvas.getContext("2d", { alpha: false });
      const strokesCanvas = document.createElement("canvas");
      const strokesCtx = strokesCanvas.getContext("2d");
      const toolbar = el.querySelector("#board-toolbar");
      const status = el.querySelector("#board-status");
      const colorButtons = [...el.querySelectorAll(".color-button")];
      const toolButtons = [...el.querySelectorAll(".tool-button")];
      const widthInput = el.querySelector("#board-brush-width");
      const widthValue = el.querySelector("#board-width-value");
      const gridToggle = el.querySelector("#board-grid-toggle");
      const pointers = new Map();

      let paths = [];
      let currentTool = "pen";
      let color = "#f4f6ef";
      let lineWidth = 6;
      let gridEnabled = false;
      let offsetX = 0;
      let offsetY = 0;
      let scale = 1;
      let dpr = 1;
      let drawingPath = null;
      let interaction = null;
      let pinchState = null;
      let spaceDown = false;
      let saveTimer = 0;
      let statusTimer = 0;

      function setStatus(message, temporary = false) {
        status.textContent = message;
        window.clearTimeout(statusTimer);
        if (temporary) {
          statusTimer = window.setTimeout(() => {
            status.textContent = "空白鍵平移 · 滾輪／雙指縮放";
          }, 2800);
        }
      }

      function scheduleSave() {
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(saveState, 120);
      }

      function saveState() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: 1,
            paths,
            preferences: { tool: currentTool, color, lineWidth, gridEnabled }
          }));
        } catch (error) {
          setStatus("無法保存白板資料；請下載圖片備份。", true);
          console.error("白板資料保存失敗：", error);
        }
      }

      function loadState() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        try {
          const saved = JSON.parse(raw);
          if (saved.version !== 1 || !Array.isArray(saved.paths)) {
            throw new Error("白板資料格式不相容");
          }
          paths = saved.paths.filter(path =>
            path && ["pen", "eraser", "line", "rect", "circle"].includes(path.tool) &&
            typeof path.color === "string" && Number.isFinite(path.lineWidth) &&
            Array.isArray(path.points) && path.points.every(point =>
              Number.isFinite(point.x) && Number.isFinite(point.y))
          );
          const preferences = saved.preferences || {};
          if (["pen", "eraser", "pan", "line", "rect", "circle"].includes(preferences.tool)) currentTool = preferences.tool;
          if (colorButtons.some(button => button.dataset.color === preferences.color)) color = preferences.color;
          if (Number.isFinite(preferences.lineWidth)) lineWidth = Math.min(24, Math.max(2, preferences.lineWidth));
          gridEnabled = Boolean(preferences.gridEnabled);
        } catch (error) {
          console.error("無法讀取白板資料：", error);
          setStatus("保存資料無法讀取，已使用空白畫布。", true);
          paths = [];
        }
      }

      function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        dpr = Math.max(1, window.devicePixelRatio || 1);
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        strokesCanvas.width = canvas.width;
        strokesCanvas.height = canvas.height;
        redraw();
      }

      function drawGrid(width, height) {
        const spacing = 40;
        const left = -offsetX / scale;
        const top = -offsetY / scale;
        const right = (width - offsetX) / scale;
        const bottom = (height - offsetY) / scale;
        const startX = Math.floor(left / spacing) * spacing;
        const startY = Math.floor(top / spacing) * spacing;

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(211, 232, 216, 0.12)";
        ctx.lineWidth = 1 / scale;
        for (let x = startX; x <= right; x += spacing) {
          ctx.moveTo(x, top);
          ctx.lineTo(x, bottom);
        }
        for (let y = startY; y <= bottom; y += spacing) {
          ctx.moveTo(left, y);
          ctx.lineTo(right, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      function drawPath(path, context) {
        const points = path.points;
        if (!points.length) return;
        context.save();
        context.globalCompositeOperation = path.tool === "eraser" ? "destination-out" : "source-over";
        context.strokeStyle = path.color;
        context.fillStyle = path.color;
        context.lineWidth = path.tool === "eraser" ? path.lineWidth * 3 : path.lineWidth;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.beginPath();

        if (path.tool === "line") {
          if (points.length > 1) {
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[points.length - 1].x, points[points.length - 1].y);
          }
        } else if (path.tool === "rect") {
          if (points.length > 1) {
            const first = points[0];
            const last = points[points.length - 1];
            context.rect(first.x, first.y, last.x - first.x, last.y - first.y);
          }
        } else if (path.tool === "circle") {
          if (points.length > 1) {
            const first = points[0];
            const last = points[points.length - 1];
            const radius = Math.hypot(last.x - first.x, last.y - first.y);
            context.arc(first.x, first.y, radius, 0, Math.PI * 2);
          }
        } else if (points.length === 1) {
          context.arc(points[0].x, points[0].y, context.lineWidth / 2, 0, Math.PI * 2);
          context.fill();
        } else {
          context.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
          }
        }

        if (path.tool !== "pen" || points.length > 1) context.stroke();
        context.restore();
      }

      function redraw() {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = BACKGROUND;
        ctx.fillRect(0, 0, width, height);
        if (gridEnabled) {
          ctx.save();
          ctx.translate(offsetX, offsetY);
          ctx.scale(scale, scale);
          drawGrid(width, height);
          ctx.restore();
        }
        strokesCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        strokesCtx.clearRect(0, 0, width, height);
        strokesCtx.save();
        strokesCtx.translate(offsetX, offsetY);
        strokesCtx.scale(scale, scale);
        for (const path of paths) drawPath(path, strokesCtx);
        if (drawingPath) drawPath(drawingPath, strokesCtx);
        strokesCtx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(strokesCanvas, 0, 0);
      }

      function screenPoint(event) {
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
      }

      function worldPoint(point) {
        return { x: (point.x - offsetX) / scale, y: (point.y - offsetY) / scale };
      }

      function setActiveTool(tool) {
        currentTool = tool;
        toolButtons.forEach(button => button.classList.toggle("active", button.dataset.tool === tool));
        updateCursor();
        scheduleSave();
      }

      function updateCursor() {
        canvas.classList.toggle("cursor-pan", currentTool === "pan" || spaceDown);
        canvas.classList.toggle("cursor-eraser", currentTool === "eraser" && !spaceDown);
        canvas.classList.toggle("cursor-panning", interaction?.kind === "pan" || interaction?.kind === "pinch");
      }

      function zoomAt(screen, factor) {
        const nextScale = Math.min(8, Math.max(.15, scale * factor));
        const ratio = nextScale / scale;
        offsetX = screen.x - (screen.x - offsetX) * ratio;
        offsetY = screen.y - (screen.y - offsetY) * ratio;
        scale = nextScale;
        redraw();
        scheduleSave();
      }

      function pointerDown(event) {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        canvas.setPointerCapture(event.pointerId);
        const point = screenPoint(event);
        pointers.set(event.pointerId, point);

        if (pointers.size >= 2) {
          drawingPath = null;
          const pair = [...pointers.values()].slice(0, 2);
          const center = { x: (pair[0].x + pair[1].x) / 2, y: (pair[0].y + pair[1].y) / 2 };
          pinchState = { distance: Math.max(1, Math.hypot(pair[1].x - pair[0].x, pair[1].y - pair[0].y)) };
          interaction = { kind: "pinch", center };
          redraw();
          updateCursor();
          return;
        }

        if (currentTool === "pan" || spaceDown) {
          interaction = { kind: "pan", last: point };
        } else {
          const start = worldPoint(point);
          const tool = currentTool === "eraser" ? "eraser" : currentTool;
          drawingPath = { tool, color, lineWidth, points: [start] };
          interaction = { kind: "draw", pointerId: event.pointerId };
          redraw();
        }
        updateCursor();
      }

      function pointerMove(event) {
        if (!pointers.has(event.pointerId)) return;
        event.preventDefault();
        const point = screenPoint(event);
        pointers.set(event.pointerId, point);

        if (interaction?.kind === "pinch" && pointers.size >= 2) {
          const pair = [...pointers.values()].slice(0, 2);
          const distance = Math.max(1, Math.hypot(pair[1].x - pair[0].x, pair[1].y - pair[0].y));
          const center = { x: (pair[0].x + pair[1].x) / 2, y: (pair[0].y + pair[1].y) / 2 };
          zoomAt(center, distance / pinchState.distance);
          offsetX += center.x - interaction.center.x;
          offsetY += center.y - interaction.center.y;
          pinchState.distance = distance;
          interaction.center = center;
          redraw();
        } else if (interaction?.kind === "pan") {
          offsetX += point.x - interaction.last.x;
          offsetY += point.y - interaction.last.y;
          interaction.last = point;
          redraw();
        } else if (interaction?.kind === "draw" && drawingPath && interaction.pointerId === event.pointerId) {
          drawingPath.points.push(worldPoint(point));
          redraw();
        }
      }

      function pointerUp(event) {
        if (!pointers.has(event.pointerId)) return;
        event.preventDefault();
        pointers.delete(event.pointerId);

        if (interaction?.kind === "draw" && interaction.pointerId === event.pointerId && drawingPath) {
          paths.push(drawingPath);
          drawingPath = null;
          scheduleSave();
        }

        if (pointers.size < 2) pinchState = null;
        interaction = null;
        updateCursor();
        redraw();
      }

      function pointerCancel(event) {
        pointers.delete(event.pointerId);
        if (interaction?.kind === "draw" && interaction.pointerId === event.pointerId) drawingPath = null;
        pinchState = null;
        interaction = null;
        updateCursor();
        redraw();
      }

      toolButtons.forEach(button => {
        button.addEventListener("click", () => setActiveTool(button.dataset.tool));
      });

      colorButtons.forEach(button => {
        button.addEventListener("click", () => {
          color = button.dataset.color;
          colorButtons.forEach(item => item.classList.toggle("active", item === button));
          scheduleSave();
        });
      });

      widthInput.addEventListener("input", () => {
        lineWidth = Number(widthInput.value);
        widthValue.value = `${lineWidth} px`;
        scheduleSave();
      });

      gridToggle.addEventListener("change", () => {
        gridEnabled = gridToggle.checked;
        redraw();
        scheduleSave();
      });

      el.querySelector("#board-undo-button").addEventListener("click", () => {
        if (paths.length) {
          paths.pop();
          redraw();
          scheduleSave();
        }
      });

      el.querySelector("#board-clear-button").addEventListener("click", () => {
        if (!paths.length) return;
        if (window.confirm("確定要清除所有筆劃嗎？此操作無法復原。")) {
          paths = [];
          drawingPath = null;
          redraw();
          scheduleSave();
        }
      });

      el.querySelector("#board-download-button").addEventListener("click", () => {
        canvas.toBlob(blob => {
          if (!blob) {
            setStatus("圖片匯出失敗，請再試一次。", true);
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `課堂白板-${new Date().toISOString().slice(0, 10)}.png`;
          link.click();
          URL.revokeObjectURL(url);
          setStatus("已下載目前畫面 PNG。", true);
        }, "image/png");
      });

      el.querySelector("#board-zoom-reset-button").addEventListener("click", () => {
        offsetX = 0;
        offsetY = 0;
        scale = 1;
        redraw();
        setStatus("視角已重設。", true);
      });

      el.querySelector("#board-collapse-button").addEventListener("click", event => {
        const collapsed = toolbar.classList.toggle("collapsed");
        event.currentTarget.parentElement.classList.toggle("is-collapsed", collapsed);
        event.currentTarget.textContent = collapsed ? "›" : "‹";
        event.currentTarget.setAttribute("aria-label", collapsed ? "展開工具列" : "收合工具列");
        event.currentTarget.title = collapsed ? "展開工具列" : "收合工具列";
      });

      canvas.addEventListener("pointerdown", pointerDown);
      canvas.addEventListener("pointermove", pointerMove);
      canvas.addEventListener("pointerup", pointerUp);
      canvas.addEventListener("pointercancel", pointerCancel);
      canvas.addEventListener("lostpointercapture", pointerCancel);

      canvas.addEventListener("wheel", event => {
        event.preventDefault();
        const point = screenPoint(event);
        zoomAt(point, Math.exp(-event.deltaY * .0015));
      }, { passive: false });

      window.addEventListener("keydown", event => {
        if (el.hidden) return;
        const target = event.target;
        const editing = target instanceof HTMLElement &&
          (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
        if (event.code === "Space" && !editing && !event.repeat) {
          event.preventDefault();
          spaceDown = true;
          updateCursor();
        }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && !editing) {
          event.preventDefault();
          el.querySelector("#board-undo-button").click();
        }
      });

      window.addEventListener("keyup", event => {
        if (event.code === "Space" && spaceDown) {
          spaceDown = false;
          updateCursor();
        }
      });

      window.addEventListener("blur", () => {
        if (spaceDown) {
          spaceDown = false;
          updateCursor();
        }
      });
      window.addEventListener("resize", resizeCanvas);
      new ResizeObserver(() => {
        if (el.clientWidth && el.clientHeight) resizeCanvas();
      }).observe(el);

      loadState();
      toolButtons.forEach(button => button.classList.toggle("active", button.dataset.tool === currentTool));
      colorButtons.forEach(button => button.classList.toggle("active", button.dataset.color === color));
      widthInput.value = String(lineWidth);
      widthValue.value = `${lineWidth} px`;
      gridToggle.checked = gridEnabled;
      resizeCanvas();
    })();
  }
});
