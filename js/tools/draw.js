App.register({
  id: "draw",
  title: "抽籤與分組",
  icon: "🎲",
  init(el) {
    el.classList.add("tool-root");
    el.dataset.toolRoot = "draw";
    el.innerHTML = "<canvas id=\"draw-confetti\" aria-hidden=\"true\"></canvas>\n  <div class=\"app\">\n    <header class=\"topbar\">\n      <div class=\"brand\">\n        <div class=\"brand-mark\" aria-hidden=\"true\">抽</div>\n        <div>\n          <h1>課堂多功能抽籤與分組機</h1>\n          <p class=\"subtitle\">讓每一次提問，都有公平又有趣的開始</p>\n        </div>\n      </div>\n      <div class=\"header-actions\">\n        <button class=\"sound-toggle\" id=\"draw-soundToggle\" type=\"button\" aria-pressed=\"true\">🔊 音效開啟</button>\n      </div>\n    </header>\n\n    <div class=\"layout\">\n      <aside class=\"settings\" aria-label=\"抽籤設定\">\n        <h2 class=\"panel-title\"><span class=\"icon\" aria-hidden=\"true\">⚙</span> 抽籤設定</h2>\n        <div class=\"field\">\n          <div class=\"field-label\"><span>抽籤模式</span></div>\n          <div class=\"segmented\" role=\"group\" aria-label=\"抽籤模式\">\n            <button class=\"tab-button\" type=\"button\" data-mode=\"number\" aria-pressed=\"true\">號碼</button>\n            <button class=\"tab-button\" type=\"button\" data-mode=\"name\" aria-pressed=\"false\">姓名</button>\n            <button class=\"tab-button\" type=\"button\" data-mode=\"groups\" aria-pressed=\"false\">分組</button>\n          </div>\n        </div>\n\n        <section id=\"draw-numberSettings\">\n          <div class=\"field\">\n            <div class=\"field-label\"><span>號碼範圍</span><span class=\"hint\">包含起始與結束號碼</span></div>\n            <div class=\"range-fields\">\n              <label>起始號碼<input id=\"draw-numberStart\" type=\"number\" value=\"1\" step=\"1\"></label>\n              <label>結束號碼<input id=\"draw-numberEnd\" type=\"number\" value=\"30\" step=\"1\"></label>\n            </div>\n          </div>\n        </section>\n\n        <section id=\"draw-nameSettings\" hidden>\n          <div class=\"field\">\n            <label class=\"field-label\" for=\"draw-roster\"><span>學生名單</span></label>\n            <textarea id=\"draw-roster\" placeholder=\"每行一位學生&#10;王小明 (男)&#10;李小華 (女)&#10;陳同學,images/01.jpg\"></textarea>\n            <div class=\"hint\">支援「姓名 (男/女)」或「姓名,圖片路徑」格式，未標註性別列為其他。</div>\n          </div>\n        </section>\n\n        <section id=\"draw-drawSettings\">\n          <div class=\"field\">\n            <label class=\"field-label\" for=\"draw-drawCount\"><span>一次抽出人數</span><span class=\"hint\">1–100</span></label>\n            <input id=\"draw-drawCount\" type=\"number\" value=\"1\" min=\"1\" max=\"100\" step=\"1\">\n          </div>\n          <div class=\"field check-row\">\n            <div class=\"check-copy\"><strong>不重複抽籤</strong><span>本輪已中籤者會暫時排除</span></div>\n            <label class=\"switch\" aria-label=\"不重複抽籤\">\n              <input id=\"draw-noRepeat\" type=\"checkbox\" checked><span></span>\n            </label>\n          </div>\n          <div class=\"field\">\n            <label class=\"field-label\" for=\"draw-excludeList\"><span>排除名單</span><span class=\"hint\">逗號分隔</span></label>\n            <input id=\"draw-excludeList\" type=\"text\" placeholder=\"例如：5, 12, 王小明\">\n          </div>\n          <div class=\"field-label\"><span>目前可抽人數</span><span class=\"remaining\" id=\"draw-remainingCount\">30 人</span></div>\n        </section>\n\n        <section id=\"draw-groupSettings\" hidden>\n          <div class=\"field\">\n            <label class=\"field-label\" for=\"draw-groupSize\"><span>每組人數</span></label>\n            <input id=\"draw-groupSize\" type=\"number\" min=\"1\" max=\"100\" value=\"4\" step=\"1\">\n          </div>\n          <div class=\"field\">\n            <label class=\"field-label\" for=\"draw-groupMethod\"><span>分組方式</span></label>\n            <select id=\"draw-groupMethod\">\n              <option value=\"random\">純隨機</option>\n              <option value=\"mixed\">男女混合（平均分流）</option>\n              <option value=\"separate\">男女分開</option>\n            </select>\n          </div>\n          <p class=\"hint\">分組將使用排除名單中的設定；請先在姓名模式貼上名單。</p>\n        </section>\n        <p class=\"storage-note\" id=\"draw-storageNote\" aria-live=\"polite\">設定會自動儲存在此瀏覽器。</p>\n      </aside>\n\n      <main class=\"main-column\">\n        <section class=\"main-panel\" aria-live=\"polite\">\n          <p class=\"mode-kicker\" id=\"draw-modeKicker\">READY TO DRAW</p>\n          <h2 class=\"result-title\" id=\"draw-resultTitle\">幸運號碼即將揭曉</h2>\n          <div class=\"result-stage\" id=\"draw-resultStage\">\n            <div class=\"result-list\" id=\"draw-resultList\"><span class=\"empty-result\">?</span></div>\n          </div>\n          <button class=\"draw-button\" id=\"draw-drawButton\" type=\"button\">開始抽籤</button>\n          <p class=\"keyboard-hint\" id=\"draw-keyboardHint\">按 <kbd>Space</kbd> 也能開始抽籤</p>\n          <p class=\"notice\" id=\"draw-notice\" role=\"status\"></p>\n          <div class=\"group-controls\" id=\"draw-groupControls\" hidden>\n            <div class=\"field\">\n              <label class=\"field-label\" for=\"draw-groupSizeInline\"><span>每組人數</span></label>\n              <input id=\"draw-groupSizeInline\" type=\"number\" min=\"1\" max=\"100\" value=\"4\" step=\"1\">\n            </div>\n            <div class=\"field\">\n              <label class=\"field-label\" for=\"draw-groupMethodInline\"><span>分組方式</span></label>\n              <select id=\"draw-groupMethodInline\">\n                <option value=\"random\">純隨機</option>\n                <option value=\"mixed\">男女混合（平均分流）</option>\n                <option value=\"separate\">男女分開</option>\n              </select>\n            </div>\n          </div>\n          <div class=\"group-actions\" id=\"draw-groupActions\" hidden>\n            <button class=\"draw-button\" id=\"draw-makeGroupsButton\" type=\"button\">開始隨機分組</button>\n            <button class=\"ghost-button\" id=\"draw-allLeadersButton\" type=\"button\" disabled>每組各抽一位組長</button>\n          </div>\n          <div class=\"groups-grid\" id=\"draw-groupsGrid\" aria-live=\"polite\"></div>\n        </section>\n\n        <section class=\"history-panel\">\n          <div class=\"history-heading\">\n            <h2 class=\"panel-title\"><span class=\"icon\" aria-hidden=\"true\">◷</span> 抽籤紀錄</h2>\n            <div class=\"history-actions\">\n              <button class=\"small-button\" id=\"draw-exportButton\" type=\"button\">匯出紀錄 CSV</button>\n              <button class=\"small-button danger\" id=\"draw-clearHistoryButton\" type=\"button\">重置紀錄</button>\n            </div>\n          </div>\n          <div class=\"history-list\" id=\"draw-historyList\"><p class=\"history-empty\">尚無抽籤紀錄</p></div>\n        </section>\n      </main>\n    </div>\n  </div>\n  <div class=\"toast\" id=\"draw-toast\" role=\"alert\" hidden></div>";
    (() => {
      "use strict";


      const STORAGE_KEY = "classroom-lottery-v1";
      const defaults = {
        mode: "number", start: 1, end: 30, roster: "", count: 1, noRepeat: true,
        excluded: "", sound: true, groupSize: 4, groupMethod: "random", history: []
      };
      const state = loadState();
      let animationTimer = null;
      let drawTimeout = null;
      let toastTimeout = null;
      let currentGroups = [];
      let leaders = new Map();
      let audioContext = null;
      const $ = (id) => el.querySelector(`#draw-${CSS.escape(id)}`);
      const modeButtons = [...el.querySelectorAll("[data-mode]")];

      function loadState() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return { ...defaults };
          const saved = JSON.parse(raw);
          return {
            ...defaults,
            ...saved,
            history: Array.isArray(saved.history) ? saved.history : []
          };
        } catch (error) {
          console.error("無法讀取抽籤設定：", error);
          return { ...defaults };
        }
      }

      function persist() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          $("storageNote").textContent = "設定會自動儲存在此瀏覽器。";
          $("storageNote").classList.remove("error");
        } catch (error) {
          console.error("無法儲存抽籤設定：", error);
          $("storageNote").textContent = "儲存失敗：瀏覽器可能已停用本機儲存。";
          $("storageNote").classList.add("error");
        }
      }

      function shuffle(items) {
        const result = items.slice();
        for (let i = result.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
      }

      function parseRoster() {
        const occurrences = new Map();
        return state.roster.split(/\r?\n/).map((line) => {
          const raw = line.trim();
          if (!raw) return null;
          const avatarParts = raw.split(",");
          let name = avatarParts[0].trim();
          let avatar = avatarParts.length > 1 ? avatarParts.slice(1).join(",").trim() : "";
          let gender = "other";
          const genderMatch = name.match(/\s*[（(]\s*(男|女)\s*[）)]\s*$/);
          if (genderMatch) {
            gender = genderMatch[1] === "男" ? "male" : "female";
            name = name.slice(0, genderMatch.index).trim();
          }
          const identity = `${name}\u0000${gender}\u0000${avatar}`;
          const occurrence = occurrences.get(identity) || 0;
          occurrences.set(identity, occurrence + 1);
          return { id: `student-${JSON.stringify([name, gender, avatar])}-${occurrence}`, name, gender, avatar };
        }).filter((student) => student && student.name);
      }

      function numberEntries() {
        const start = Number(state.start);
        const end = Number(state.end);
        if (!Number.isInteger(start) || !Number.isInteger(end) || end < start || end - start > 9999) return [];
        return Array.from({ length: end - start + 1 }, (_, index) => {
          const number = start + index;
          return { id: `number-${number}`, name: String(number), gender: "other", avatar: "" };
        });
      }

      function excludedTokens() {
        return state.excluded.split(",").map((token) => token.trim()).filter(Boolean);
      }

      function eligibleEntries(mode = state.mode) {
        const entries = mode === "number" ? numberEntries() : parseRoster();
        const excluded = excludedTokens();
        const blocked = new Set(entries.filter((entry) =>
          excluded.includes(entry.name) || excluded.includes(entry.id.replace(/^number-/, "")) ||
          excluded.includes(entry.id)
        ).map((entry) => entry.id));
        if (mode !== "groups" && state.noRepeat) {
          state.history.forEach((record) => {
            if (record.mode === mode && Array.isArray(record.ids)) record.ids.forEach((id) => blocked.add(id));
          });
        }
        return entries.filter((entry) => !blocked.has(entry.id));
      }

      function updateRemaining() {
        $("remainingCount").textContent = `${eligibleEntries(state.mode === "groups" ? "name" : state.mode).length} 人`;
      }

      function showToast(message) {
        const toast = $("toast");
        toast.textContent = message;
        toast.hidden = false;
        window.clearTimeout(toastTimeout);
        toastTimeout = window.setTimeout(() => { toast.hidden = true; }, 4200);
      }

      function syncControls() {
        $("numberStart").value = state.start;
        $("numberEnd").value = state.end;
        $("roster").value = state.roster;
        $("drawCount").value = state.count;
        $("noRepeat").checked = state.noRepeat;
        $("excludeList").value = state.excluded;
        $("soundToggle").setAttribute("aria-pressed", String(state.sound));
        $("soundToggle").textContent = state.sound ? "🔊 音效開啟" : "🔇 音效靜音";
        $("groupSize").value = state.groupSize;
        $("groupSizeInline").value = state.groupSize;
        $("groupMethod").value = state.groupMethod;
        $("groupMethodInline").value = state.groupMethod;
        renderMode();
        renderHistory();
        updateRemaining();
      }

      function renderMode() {
        modeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mode === state.mode)));
        const isNumber = state.mode === "number";
        const isName = state.mode === "name";
        const isGroups = state.mode === "groups";
        $("numberSettings").hidden = !isNumber;
        $("nameSettings").hidden = !isName;
        $("drawSettings").hidden = isGroups;
        $("groupSettings").hidden = !isGroups;
        $("groupControls").hidden = !isGroups;
        $("groupActions").hidden = !isGroups;
        $("drawButton").hidden = isGroups;
        $("keyboardHint").hidden = isGroups;
        $("groupsGrid").hidden = !isGroups;
        $("modeKicker").textContent = isGroups ? "TEAM UP" : "READY TO DRAW";
        $("resultTitle").textContent = isGroups ? "一起合作，完成挑戰" : isName ? "幸運同學即將揭曉" : "幸運號碼即將揭曉";
        $("drawButton").textContent = isName ? "開始抽同學" : "開始抽籤";
        if (!isGroups && $("resultList").dataset.mode !== state.mode) {
          $("resultList").dataset.mode = state.mode;
          $("resultList").innerHTML = '<span class="empty-result">?</span>';
        }
        updateRemaining();
      }

      function displayName(entry) {
        return entry.name.replace(/\s*[（(]\s*(男|女)\s*[）)]\s*$/, "").trim();
      }

      function renderResult(entries) {
        const result = $("resultList");
        result.replaceChildren();
        if (!entries.length) {
          const empty = document.createElement("span");
          empty.className = "empty-result";
          empty.textContent = "?";
          result.append(empty);
          return;
        }
        entries.forEach((entry) => {
          const item = document.createElement("div");
          item.className = "result-item";
          if (state.mode === "name" && entry.avatar) {
            const image = document.createElement("img");
            image.className = "result-avatar";
            image.src = entry.avatar;
            image.alt = `${displayName(entry)}的大頭貼`;
            image.addEventListener("error", () => {
              image.replaceWith(makeAvatarFallback(displayName(entry)));
            }, { once: true });
            item.append(image);
          } else if (state.mode === "name") {
            item.append(makeAvatarFallback(displayName(entry)));
          }
          const name = document.createElement("span");
          name.className = state.mode === "name" ? "result-name" : "result-chip";
          name.textContent = displayName(entry);
          item.append(name);
          result.append(item);
        });
      }

      function makeAvatarFallback(name) {
        const fallback = document.createElement("div");
        fallback.className = "result-avatar result-avatar-fallback";
        fallback.setAttribute("aria-hidden", "true");
        fallback.textContent = Array.from(name)[0] || "？";
        return fallback;
      }

      function startDraw() {
        if (state.mode === "groups" || animationTimer !== null) return;
        const count = Number(state.count);
        if (!Number.isInteger(count) || count < 1 || count > 100) {
          showToast("請輸入 1 到 100 之間的抽取人數。");
          return;
        }
        if (state.mode === "number" && !numberEntries().length) {
          showToast("號碼範圍無效，請確認起始號碼與結束號碼。");
          return;
        }
        if (state.mode === "name" && !parseRoster().length) {
          showToast("請先輸入至少一位學生姓名。");
          return;
        }
        const available = eligibleEntries();
        if (available.length < count) {
          showToast(`只剩 ${available.length} 人可抽，無法一次抽 ${count} 人。`);
          return;
        }
        const selected = shuffle(available).slice(0, count);
        const animationPool = shuffle(available);
        const button = $("drawButton");
        button.disabled = true;
        $("notice").textContent = "抽籤中，請稍候⋯";
        const started = Date.now();
        animationTimer = window.setInterval(() => {
          renderResult(shuffle(animationPool).slice(0, count));
          if (Date.now() - started >= 2000) finishDraw(selected);
        }, 75);
      }

      function finishDraw(selected) {
        window.clearInterval(animationTimer);
        animationTimer = null;
        $("drawButton").disabled = false;
        renderResult(selected);
        $("notice").textContent = "";
        const record = {
          timestamp: new Date().toISOString(),
          mode: state.mode,
          names: selected.map((entry) => displayName(entry)),
          ids: selected.map((entry) => entry.id)
        };
        state.history.unshift(record);
        persist();
        renderHistory();
        updateRemaining();
        celebrate();
        playChime();
      }

      function renderHistory() {
        const list = $("historyList");
        list.replaceChildren();
        if (!state.history.length) {
          const empty = document.createElement("p");
          empty.className = "history-empty";
          empty.textContent = "尚無抽籤紀錄";
          list.append(empty);
          return;
        }
        state.history.forEach((record) => {
          const row = document.createElement("div");
          row.className = "history-entry";
          const time = document.createElement("time");
          time.className = "history-time";
          time.dateTime = record.timestamp;
          const date = new Date(record.timestamp);
          time.textContent = Number.isNaN(date.getTime()) ? "時間未知" : date.toLocaleString("zh-TW", { hour12: false });
          const result = document.createElement("div");
          result.className = "history-result";
          const prefix = record.mode === "groups" ? "分組" : record.mode === "name" ? "姓名" : "號碼";
          result.textContent = `${prefix}｜${Array.isArray(record.names) ? record.names.join("、") : ""}`;
          row.append(time, result);
          list.append(row);
        });
      }

      function addHistory(mode, names, ids = []) {
        state.history.unshift({ timestamp: new Date().toISOString(), mode, names, ids });
        persist();
        renderHistory();
      }

      function makeGroups() {
        const eligible = eligibleEntries("name");
        const size = Number(state.groupSize);
        if (!Number.isInteger(size) || size < 1 || size > 100) {
          showToast("請輸入 1 到 100 之間的每組人數。");
          return;
        }
        if (!eligible.length) {
          showToast("沒有可分組的學生，請確認名單與排除設定。");
          return;
        }
        const method = state.groupMethod;
        let groups = [];
        if (method === "separate") {
          const categories = [
            { label: "男生組", members: shuffle(eligible.filter((entry) => entry.gender === "male")) },
            { label: "女生組", members: shuffle(eligible.filter((entry) => entry.gender === "female")) },
            { label: "其他組", members: shuffle(eligible.filter((entry) => entry.gender === "other")) }
          ];
          categories.forEach(({ label, members }) => {
            for (let i = 0; i < members.length; i += size) {
              groups.push({ label, members: members.slice(i, i + size) });
            }
          });
        } else if (method === "mixed") {
          const groupCount = Math.ceil(eligible.length / size);
          groups = Array.from({ length: groupCount }, () => ({ label: "", members: [] }));
          const capacities = groups.map((_, index) => Math.min(size, eligible.length - index * size));
          const categories = [
            shuffle(eligible.filter((entry) => entry.gender === "male")),
            shuffle(eligible.filter((entry) => entry.gender === "female")),
            shuffle(eligible.filter((entry) => entry.gender === "other"))
          ];
          let pointer = Math.floor(Math.random() * groupCount);
          categories.forEach((members) => {
            members.forEach((member) => {
              let checked = 0;
              while (groups[pointer].members.length >= capacities[pointer] && checked < groupCount) {
                pointer = (pointer + 1) % groupCount;
                checked += 1;
              }
              groups[pointer].members.push(member);
              pointer = (pointer + 1) % groupCount;
            });
          });
          groups.forEach((group) => { group.label = "混合組"; });
        } else {
          const members = shuffle(eligible);
          for (let i = 0; i < members.length; i += size) {
            groups.push({ label: "隨機組", members: members.slice(i, i + size) });
          }
        }
        currentGroups = groups;
        leaders = new Map();
        renderGroups();
        $("allLeadersButton").disabled = false;
        addHistory("groups", groups.map((group, index) =>
          `${group.label} ${index + 1}：${group.members.map(displayName).join("、")}`
        ));
        $("notice").textContent = `已完成分組，共 ${groups.length} 組、${eligible.length} 位學生。`;
      }

      function drawLeader(index) {
        const group = currentGroups[index];
        if (!group || !group.members.length) return;
        leaders.set(index, shuffle(group.members)[0].id);
        renderGroups();
      }

      function renderGroups() {
        const grid = $("groupsGrid");
        grid.replaceChildren();
        if (!currentGroups.length) {
          const empty = document.createElement("p");
          empty.className = "group-empty";
          empty.textContent = "設定好每組人數與分組方式後，按「開始隨機分組」。";
          grid.append(empty);
          return;
        }
        currentGroups.forEach((group, index) => {
          const card = document.createElement("article");
          card.className = "group-card";
          const heading = document.createElement("h3");
          const title = document.createElement("span");
          const categoryCount = currentGroups.slice(0, index + 1).filter((item) => item.label === group.label).length;
          title.textContent = `${group.label} ${categoryCount}`;
          const leaderButton = document.createElement("button");
          leaderButton.type = "button";
          leaderButton.className = "small-button";
          leaderButton.textContent = leaders.has(index) ? "重抽組長" : "抽組長";
          leaderButton.addEventListener("click", () => drawLeader(index));
          heading.append(title, leaderButton);
          const list = document.createElement("ul");
          group.members.forEach((member) => {
            const item = document.createElement("li");
            const dot = document.createElement("span");
            dot.className = "member-dot";
            const name = document.createElement("span");
            name.textContent = displayName(member);
            if (leaders.get(index) === member.id) {
              name.className = "leader";
              const badge = document.createElement("span");
              badge.className = "leader-badge";
              badge.textContent = "組長";
              item.append(dot, name, badge);
            } else {
              item.append(dot, name);
            }
            list.append(item);
          });
          card.append(heading, list);
          grid.append(card);
        });
      }

      function chooseAllLeaders() {
        leaders = new Map();
        currentGroups.forEach((group, index) => {
          if (group.members.length) leaders.set(index, shuffle(group.members)[0].id);
        });
        renderGroups();
      }

      function playChime() {
        if (!state.sound) return;
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (!AudioContextClass) return;
          audioContext ||= new AudioContextClass();
          if (audioContext.state === "suspended") audioContext.resume();
          const now = audioContext.currentTime;
          [523.25, 659.25, 783.99].forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.0001, now + index * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.16, now + index * 0.12 + 0.025);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 0.28);
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            oscillator.start(now + index * 0.12);
            oscillator.stop(now + index * 0.12 + 0.3);
          });
        } catch (error) {
          console.error("無法播放抽籤提示音：", error);
        }
      }

      function celebrate() {
        const canvas = $("confetti");
        const context = canvas.getContext("2d");
        if (!context) return;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        context.scale(ratio, ratio);
        const colors = ["#83e0cf", "#ffd36e", "#ff8b92", "#9caeff", "#f7f5ff"];
        const particles = Array.from({ length: 105 }, () => ({
          x: Math.random() * window.innerWidth,
          y: -20 - Math.random() * window.innerHeight * 0.35,
          size: 4 + Math.random() * 7,
          speed: 2 + Math.random() * 4,
          drift: (Math.random() - 0.5) * 3,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.16,
          color: colors[Math.floor(Math.random() * colors.length)]
        }));
        const start = performance.now();
        function frame(now) {
          context.clearRect(0, 0, window.innerWidth, window.innerHeight);
          particles.forEach((particle) => {
            particle.y += particle.speed;
            particle.x += particle.drift;
            particle.rotation += particle.spin;
            context.save();
            context.translate(particle.x, particle.y);
            context.rotate(particle.rotation);
            context.fillStyle = particle.color;
            context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.65);
            context.restore();
          });
          if (now - start < 2400) requestAnimationFrame(frame);
          else context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
        requestAnimationFrame(frame);
      }

      function csvCell(value) {
        return `"${String(value ?? "").replace(/"/g, '""')}"`;
      }

      function exportCsv() {
        if (!state.history.length) {
          showToast("目前沒有可匯出的抽籤紀錄。");
          return;
        }
        const rows = [["抽籤時間", "模式", "中籤結果"]];
        state.history.slice().reverse().forEach((record) => {
          const date = new Date(record.timestamp);
          const mode = record.mode === "groups" ? "分組" : record.mode === "name" ? "姓名" : "號碼";
          rows.push([Number.isNaN(date.getTime()) ? record.timestamp : date.toLocaleString("zh-TW", { hour12: false }), mode,
            Array.isArray(record.names) ? record.names.join("、") : ""]);
        });
        const csv = "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `課堂抽籤紀錄-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.append(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }

      modeButtons.forEach((button) => button.addEventListener("click", () => {
        state.mode = button.dataset.mode;
        $("notice").textContent = "";
        renderMode();
        persist();
      }));
      $("numberStart").addEventListener("input", (event) => { state.start = event.target.value; persist(); updateRemaining(); });
      $("numberEnd").addEventListener("input", (event) => { state.end = event.target.value; persist(); updateRemaining(); });
      $("roster").addEventListener("input", (event) => { state.roster = event.target.value; persist(); updateRemaining(); });
      $("drawCount").addEventListener("input", (event) => { state.count = event.target.value; persist(); });
      $("noRepeat").addEventListener("change", (event) => { state.noRepeat = event.target.checked; persist(); updateRemaining(); });
      $("excludeList").addEventListener("input", (event) => { state.excluded = event.target.value; persist(); updateRemaining(); });
      $("soundToggle").addEventListener("click", () => {
        state.sound = !state.sound;
        $("soundToggle").setAttribute("aria-pressed", String(state.sound));
        $("soundToggle").textContent = state.sound ? "🔊 音效開啟" : "🔇 音效靜音";
        persist();
      });
      function updateGroupOptions(event) {
        state.groupSize = event.target.value;
        $("groupSize").value = state.groupSize;
        $("groupSizeInline").value = state.groupSize;
        persist();
      }
      $("groupSize").addEventListener("input", updateGroupOptions);
      $("groupSizeInline").addEventListener("input", updateGroupOptions);
      function updateGroupMethod(event) {
        state.groupMethod = event.target.value;
        $("groupMethod").value = state.groupMethod;
        $("groupMethodInline").value = state.groupMethod;
        persist();
      }
      $("groupMethod").addEventListener("change", updateGroupMethod);
      $("groupMethodInline").addEventListener("change", updateGroupMethod);
      $("drawButton").addEventListener("click", startDraw);
      $("makeGroupsButton").addEventListener("click", makeGroups);
      $("allLeadersButton").addEventListener("click", chooseAllLeaders);
      $("clearHistoryButton").addEventListener("click", () => {
        if (!state.history.length) return;
        if (!window.confirm("確定要清空所有抽籤紀錄嗎？")) return;
        state.history = [];
        persist();
        renderHistory();
        updateRemaining();
      });
      $("exportButton").addEventListener("click", exportCsv);
      document.addEventListener("keydown", (event) => {
        if (el.hidden) return;
        if (event.code !== "Space" || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
        const target = event.target;
        if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName))) return;
        if (state.mode !== "groups") {
          event.preventDefault();
          startDraw();
        }
      });

      syncControls();
      if (state.history.length && state.history[0].mode !== "groups") {
        const latest = state.history[0];
        const latestEntries = (latest.mode === "number" ? numberEntries() : parseRoster())
          .filter((entry) => (latest.ids || []).includes(entry.id));
        if (latestEntries.length) {
          state.mode = latest.mode;
          renderMode();
          renderResult(latestEntries);
        }
      }
    })();
  }
});
