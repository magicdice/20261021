App.register({
  id: "irs",
  title: "即時問答",
  icon: "🙋",
  init(el) {
    el.classList.add("tool-root");
    el.dataset.toolRoot = "irs";
    el.innerHTML = "<main class=\"shell\">\n    <header class=\"topbar\">\n      <div class=\"brand\">\n        <div class=\"brand-mark\">IRS</div>\n        <div>\n          <h1>即時問答互動系統</h1>\n          <p class=\"subtitle\">Classroom live · 即時連線、即時回饋</p>\n        </div>\n      </div>\n      <nav class=\"role-switch\" aria-label=\"切換使用端\">\n        <button id=\"irs-teacherTab\" type=\"button\">老師端</button>\n        <button id=\"irs-studentTab\" type=\"button\">學生端</button>\n      </nav>\n    </header>\n    <div id=\"irs-globalNotice\" class=\"notice\" role=\"status\"></div>\n\n    <section id=\"irs-teacherView\" class=\"teacher-grid\">\n      <div class=\"panel\">\n        <div class=\"panel-inner\">\n          <p class=\"eyebrow\">Room setup</p>\n          <h2>教室連線</h2>\n          <div class=\"room-card\">\n            <div class=\"muted\">學生加入代碼</div>\n            <div id=\"irs-roomCode\" class=\"room-code\">----</div>\n            <div id=\"irs-roomUrl\" class=\"room-url\">建立教室後顯示加入網址</div>\n            <div id=\"irs-qrcode\" aria-label=\"教室加入 QR Code\"></div>\n            <div class=\"status-line\"><span id=\"irs-teacherDot\" class=\"dot\"></span><span id=\"irs-teacherStatus\">尚未建立教室</span></div>\n            <div class=\"button-row\">\n              <button id=\"irs-createRoomBtn\" class=\"button block\" type=\"button\">建立教室</button>\n              <button id=\"irs-restoreRoomBtn\" class=\"button secondary block hidden\" type=\"button\">恢復上次教室</button>\n            </div>\n          </div>\n          <div style=\"height: 15px\"></div>\n          <div class=\"button-row\">\n            <button id=\"irs-exportBtn\" class=\"button secondary\" type=\"button\">匯出作答紀錄 CSV</button>\n            <button id=\"irs-clearDataBtn\" class=\"button secondary\" type=\"button\">清除本機紀錄</button>\n          </div>\n          <p class=\"footer-note\">使用 PeerJS 進行瀏覽器點對點連線。請確保老師與學生裝置都能連上網際網路。</p>\n        </div>\n      </div>\n\n      <div class=\"panel\">\n        <div class=\"panel-inner\">\n          <p class=\"eyebrow\">Live interaction</p>\n          <h2>題目與即時回饋 <span id=\"irs-questionState\" class=\"count-pill\">待命</span></h2>\n          <div class=\"mode-tabs\" role=\"tablist\" aria-label=\"互動模式\">\n            <button type=\"button\" data-mode=\"choice\" class=\"active\">選擇題</button>\n            <button type=\"button\" data-mode=\"text\">文字簡答</button>\n            <button type=\"button\" data-mode=\"buzz\">課堂搶答</button>\n          </div>\n          <form id=\"irs-questionForm\">\n            <div class=\"field\">\n              <label for=\"irs-questionInput\">題目內容</label>\n              <textarea id=\"irs-questionInput\" maxlength=\"500\" placeholder=\"輸入要和全班互動的題目\" required></textarea>\n            </div>\n            <div id=\"irs-choiceFields\" class=\"option-fields\">\n              <div class=\"field\"><label for=\"irs-optionA\">選項 A</label><input id=\"irs-optionA\" maxlength=\"150\" required placeholder=\"輸入選項 A\"></div>\n              <div class=\"field\"><label for=\"irs-optionB\">選項 B</label><input id=\"irs-optionB\" maxlength=\"150\" required placeholder=\"輸入選項 B\"></div>\n              <div class=\"field\"><label for=\"irs-optionC\">選項 C</label><input id=\"irs-optionC\" maxlength=\"150\" required placeholder=\"輸入選項 C\"></div>\n              <div class=\"field\"><label for=\"irs-optionD\">選項 D</label><input id=\"irs-optionD\" maxlength=\"150\" required placeholder=\"輸入選項 D\"></div>\n            </div>\n            <div id=\"irs-buzzSettings\" class=\"field hidden\">\n              <label for=\"irs-buzzDuration\">搶答時間（秒）</label>\n              <input id=\"irs-buzzDuration\" type=\"number\" min=\"3\" max=\"120\" value=\"15\">\n            </div>\n            <p id=\"irs-formHint\" class=\"form-hint\">學生選擇 A、B、C 或 D 後，答案即送出並鎖定。</p>\n            <div class=\"button-row\">\n              <button id=\"irs-publishBtn\" class=\"button\" type=\"submit\">發布選擇題</button>\n              <button id=\"irs-endQuestionBtn\" class=\"button danger\" type=\"button\" disabled>結束作答</button>\n            </div>\n          </form>\n          <hr style=\"border:0;border-top:1px solid var(--line);margin:20px 0\">\n          <div id=\"irs-liveResults\"><div class=\"empty-state\">建立教室並發布題目後，<br>即時統計會顯示在這裡。</div></div>\n        </div>\n      </div>\n\n      <div class=\"panel roster-panel\">\n        <div class=\"panel-inner\">\n          <p class=\"eyebrow\">Participants</p>\n          <h2>學生名單 <span id=\"irs-studentCount\" class=\"count-pill\">0</span></h2>\n          <div id=\"irs-roster\" class=\"roster\"><div class=\"muted\">等待學生加入教室…</div></div>\n        </div>\n      </div>\n    </section>\n\n    <section id=\"irs-studentView\" class=\"student-wrap hidden\">\n      <div class=\"panel student-card\">\n        <div class=\"panel-inner\">\n          <p class=\"eyebrow\">Join classroom</p>\n          <h2>加入課堂</h2>\n          <div id=\"irs-studentStatus\" class=\"student-status\">請輸入姓名與教室代碼</div>\n          <div id=\"irs-joinForm\" style=\"margin-top:17px\">\n            <div class=\"field\"><label for=\"irs-studentName\">你的姓名</label><input id=\"irs-studentName\" maxlength=\"30\" autocomplete=\"name\" placeholder=\"輸入姓名\"></div>\n            <div class=\"field\"><label for=\"irs-studentRoom\">4 位數教室代碼</label><input id=\"irs-studentRoom\" inputmode=\"numeric\" maxlength=\"4\" placeholder=\"例如 2486\"></div>\n            <button id=\"irs-joinBtn\" class=\"button block\" type=\"button\">加入教室</button>\n          </div>\n          <div id=\"irs-studentActivity\" class=\"hidden\">\n            <div class=\"status-line\"><span id=\"irs-studentDot\" class=\"dot\"></span><span id=\"irs-studentConnectionLabel\">尚未連線</span></div>\n            <div id=\"irs-studentQuestion\" class=\"hidden\"></div>\n            <p id=\"irs-studentFeedback\" class=\"student-feedback\"></p>\n            <button id=\"irs-reconnectBtn\" class=\"button block hidden\" type=\"button\">重新連線</button>\n          </div>\n          <p class=\"footer-note\">若連線中斷，請確認網路狀態後點選「重新連線」。</p>\n        </div>\n      </div>\n    </section>\n  </main>";
    (() => {
      "use strict";


      const STORAGE_KEY = 'irs-classroom-state-v1';
      const byId = (id) => el.querySelector(`#irs-${CSS.escape(id)}`);
      const teacherView = byId('teacherView');
      const studentView = byId('studentView');
      const globalNotice = byId('globalNotice');
      const peerLibraryAvailable = typeof window.Peer === 'function';
      let state = {
        roomCode: '',
        mode: 'choice',
        current: null,
        history: [],
        participants: {},
        teacherPeer: null,
        studentPeer: null,
        studentConn: null,
        studentId: '',
        studentName: '',
        currentStudentAnswer: null,
        reconnectTimer: null,
        studentConnectTimer: null,
        buzzTimer: null,
        buzzDeadline: 0,
        buzzOpen: false,
        teacherConnections: new Map()
      };

      function loadState() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        try {
          const saved = JSON.parse(raw);
          if (saved && typeof saved === 'object') {
            state.roomCode = typeof saved.roomCode === 'string' ? saved.roomCode : '';
            state.mode = ['choice', 'text', 'buzz'].includes(saved.mode) ? saved.mode : 'choice';
            state.current = saved.current && typeof saved.current === 'object' ? saved.current : null;
            state.history = Array.isArray(saved.history) ? saved.history : [];
            state.participants = saved.participants && typeof saved.participants === 'object' ? saved.participants : {};
            if (state.current && state.current.id) {
              const matchingQuestion = state.history.find((item) => item && item.id === state.current.id);
              if (matchingQuestion) state.current = matchingQuestion;
              else state.history.push(state.current);
            }
          }
        } catch (error) {
          showNotice(`無法讀取已保存的課堂紀錄：${error.message}`);
        }
      }

      function saveState() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            roomCode: state.roomCode,
            mode: state.mode,
            current: state.current,
            history: state.history,
            participants: state.participants
          }));
        } catch (error) {
          showNotice(`課堂資料無法保存至此裝置：${error.message}`);
        }
      }

      function showNotice(message) {
        globalNotice.textContent = message;
        globalNotice.classList.add('show');
      }

      function clearNotice() {
        globalNotice.textContent = '';
        globalNotice.classList.remove('show');
      }

      function setTeacherStatus(text, kind) {
        byId('teacherStatus').textContent = text;
        byId('teacherDot').className = `dot${kind === 'online' ? ' online' : kind === 'error' ? ' error' : ''}`;
      }

      function setStudentStatus(text, kind) {
        byId('studentStatus').textContent = text;
        byId('studentStatus').className = `student-status${kind === 'connected' ? ' connected' : kind === 'error' ? ' error' : ''}`;
        byId('studentDot').className = `dot${kind === 'connected' ? ' online' : kind === 'error' ? ' error' : ''}`;
        byId('studentConnectionLabel').textContent = text;
      }

      function setRole(role) {
        const student = role === 'student';
        teacherView.classList.toggle('hidden', student);
        studentView.classList.toggle('hidden', !student);
        byId('teacherTab').classList.toggle('active', !student);
        byId('studentTab').classList.toggle('active', student);
      }

      function renderRoom() {
        byId('roomCode').textContent = state.roomCode || '----';
        const qr = byId('qrcode');
        qr.replaceChildren();
        if (!state.roomCode) {
          byId('roomUrl').textContent = '建立教室後顯示加入網址';
          return;
        }
        const url = new URL(window.location.href);
        url.search = '';
        url.searchParams.set('room', state.roomCode);
        url.hash = '';
        byId('roomUrl').textContent = url.toString();
        if (typeof window.QRCode === 'function') {
          new window.QRCode(qr, { text: url.toString(), width: 150, height: 150, colorDark: '#0b1020', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.M });
        } else {
          qr.textContent = 'QR Code 函式庫載入失敗';
          showNotice('無法載入 QR Code 函式庫，請檢查網路連線並重新載入頁面。');
        }
        byId('restoreRoomBtn').classList.toggle('hidden', !state.roomCode || Boolean(state.teacherPeer));
      }

      function renderRoster() {
        const students = Object.values(state.participants).filter((person) => person.online);
        byId('studentCount').textContent = String(students.length);
        const roster = byId('roster');
        roster.replaceChildren();
        if (!students.length) {
          const empty = document.createElement('div');
          empty.className = 'muted';
          empty.textContent = '等待學生加入教室…';
          roster.append(empty);
          return;
        }
        students.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'));
        for (const person of students) {
          const item = document.createElement('div');
          item.className = 'roster-item';
          const avatar = document.createElement('span');
          avatar.className = 'avatar';
          avatar.textContent = person.name.slice(0, 1) || '?';
          const name = document.createElement('span');
          name.className = 'roster-name';
          name.textContent = person.name;
          const activity = document.createElement('span');
          activity.className = 'roster-state';
          activity.textContent = state.current && state.current.answers[person.id] ? '已作答' : '在線';
          item.append(avatar, name, activity);
          roster.append(item);
        }
      }

      function modeName(mode) {
        return mode === 'choice' ? '選擇題' : mode === 'text' ? '文字簡答' : '課堂搶答';
      }

      function renderResults() {
        const host = byId('liveResults');
        const current = state.current;
        byId('questionState').textContent = current ? (current.open ? '進行中' : '已結束') : '待命';
        byId('endQuestionBtn').disabled = !current || !current.open;
        if (!current) {
          host.innerHTML = '<div class="empty-state">建立教室並發布題目後，<br>即時統計會顯示在這裡。</div>';
          renderRoster();
          return;
        }
        const header = document.createElement('div');
        const type = document.createElement('p');
        type.className = 'eyebrow';
        type.textContent = `${modeName(current.qType)} · ${current.open ? '作答中' : '已結束'}`;
        const title = document.createElement('h3');
        title.className = 'question-title';
        title.textContent = current.question;
        header.append(type, title);
        host.replaceChildren(header);

        const answers = Object.values(current.answers || {});
        if (current.qType === 'choice') {
          const total = answers.length;
          current.options.forEach((option, index) => {
            const label = String.fromCharCode(65 + index);
            const votes = answers.filter((answer) => answer.payload === label).length;
            const row = document.createElement('div');
            row.className = 'bar-row';
            const letter = document.createElement('div');
            letter.className = 'bar-label';
            letter.textContent = label;
            const track = document.createElement('div');
            track.className = 'bar-track';
            const fill = document.createElement('div');
            fill.className = 'bar-fill';
            fill.style.width = `${total ? votes / total * 100 : 0}%`;
            track.append(fill);
            const count = document.createElement('div');
            count.className = 'bar-count';
            count.textContent = `${votes} 票 · ${total ? Math.round(votes / total * 100) : 0}%`;
            row.append(letter, track, count);
            const optionLine = document.createElement('div');
            optionLine.className = 'muted';
            optionLine.style.cssText = 'margin:-9px 0 0 47px;font-size:.78rem';
            optionLine.textContent = option;
            host.append(row, optionLine);
          });
          const online = Object.values(state.participants).filter((person) => person.online);
          const responded = new Set(answers.map((answer) => answer.studentId));
          const listWrap = document.createElement('div');
          listWrap.className = 'response-lists';
          listWrap.append(makeNameList('已作答', online.filter((person) => responded.has(person.id)).map((person) => person.name), false));
          listWrap.append(makeNameList('尚未作答', online.filter((person) => !responded.has(person.id)).map((person) => person.name), true));
          host.append(listWrap);
        } else if (current.qType === 'text') {
          const grid = document.createElement('div');
          grid.className = 'answer-grid';
          if (!answers.length) {
            const empty = document.createElement('p');
            empty.className = 'muted';
            empty.textContent = '尚無學生回答';
            grid.append(empty);
          }
          for (const answer of answers) {
            const card = document.createElement('article');
            card.className = 'answer-card';
            const name = document.createElement('strong');
            name.textContent = answer.name;
            const text = document.createElement('p');
            text.textContent = answer.payload;
            card.append(name, text);
            grid.append(card);
          }
          host.append(grid);
        } else {
          const countdown = document.createElement('p');
          countdown.className = 'countdown';
          const deadline = Number(current.deadlineAt) || state.buzzDeadline;
          countdown.textContent = current.open ? `搶答進行中 · 剩餘 ${Math.max(0, Math.ceil((deadline - Date.now()) / 1000))} 秒` : '本輪搶答已結束';
          host.append(countdown);
          const ranking = document.createElement('div');
          ranking.className = 'rank-list';
          const sorted = answers.slice().sort((a, b) => a.at - b.at || a.sequence - b.sequence).slice(0, 3);
          sorted.forEach((answer, index) => {
            const item = document.createElement('div');
            item.className = 'rank-item';
            const place = document.createElement('span');
            place.className = 'rank-number';
            place.textContent = String(index + 1);
            const name = document.createElement('strong');
            name.textContent = answer.name;
            const time = document.createElement('span');
            time.className = 'rank-time';
            time.textContent = `+${(answer.elapsedMs / 1000).toFixed(3)} 秒`;
            item.append(place, name, time);
            ranking.append(item);
          });
          if (!sorted.length) {
            const empty = document.createElement('p');
            empty.className = 'muted';
            empty.textContent = '等待第一位學生搶答…';
            ranking.append(empty);
          }
          host.append(ranking);
        }
        renderRoster();
      }

      function makeNameList(title, names, pending) {
        const section = document.createElement('div');
        section.className = 'mini-list';
        const heading = document.createElement('h3');
        heading.textContent = `${title} (${names.length})`;
        const chips = document.createElement('div');
        chips.className = 'name-chips';
        if (!names.length) {
          const none = document.createElement('span');
          none.className = 'muted';
          none.textContent = '—';
          chips.append(none);
        }
        names.forEach((name) => {
          const chip = document.createElement('span');
          chip.className = `chip${pending ? ' pending' : ''}`;
          chip.textContent = name;
          chips.append(chip);
        });
        section.append(heading, chips);
        return section;
      }

      function updateMode(mode) {
        state.mode = mode;
        saveState();
        el.querySelectorAll('.mode-tabs button').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
        const choice = mode === 'choice';
        const buzz = mode === 'buzz';
        byId('choiceFields').classList.toggle('hidden', !choice);
        byId('buzzSettings').classList.toggle('hidden', !buzz);
        byId('optionA').required = choice;
        byId('optionB').required = choice;
        byId('optionC').required = choice;
        byId('optionD').required = choice;
        byId('publishBtn').textContent = buzz ? '開始搶答' : choice ? '發布選擇題' : '發布簡答題';
        byId('formHint').textContent = choice
          ? '學生選擇 A、B、C 或 D 後，答案即送出並鎖定。'
          : buzz ? '開始後倒數計時，老師端依收到訊息的時間記錄前 3 名。'
          : '學生每題可送出一次文字回答，回答會即時顯示於卡片牆。';
      }

      function openTeacherPeer(roomCode) {
        if (!peerLibraryAvailable) {
          showNotice('PeerJS 函式庫載入失敗，請檢查網路連線後重新載入頁面。');
          setTeacherStatus('無法載入 PeerJS', 'error');
          return;
        }
        if (state.roomCode && state.roomCode !== roomCode) {
          if (state.current && state.current.open) endQuestion();
          state.current = null;
          window.clearInterval(state.buzzTimer);
        }
        if (state.teacherPeer) state.teacherPeer.destroy();
        state.teacherConnections.clear();
        state.roomCode = roomCode;
        state.participants = {};
        saveState();
        renderRoom();
        setTeacherStatus('正在連線至 PeerJS…', '');
        byId('createRoomBtn').disabled = true;
        byId('restoreRoomBtn').classList.add('hidden');
        const peer = new window.Peer(`class-${roomCode}`);
        state.teacherPeer = peer;
        peer.on('open', () => {
          clearNotice();
          setTeacherStatus('教室已建立，等待學生加入', 'online');
          byId('createRoomBtn').disabled = false;
          renderRoom();
          if (state.current && state.current.qType === 'buzz' && state.current.open) {
            state.buzzDeadline = Number(state.current.deadlineAt) || Date.now();
            if (state.buzzDeadline <= Date.now()) {
              endQuestion();
            } else {
              state.buzzOpen = true;
              window.clearInterval(state.buzzTimer);
              state.buzzTimer = window.setInterval(() => {
                if (Date.now() >= state.buzzDeadline) endQuestion();
                else renderResults();
              }, 200);
            }
          }
        });
        peer.on('connection', (conn) => {
          state.teacherConnections.set(conn.peer, conn);
          conn.on('data', (message) => handleTeacherMessage(conn, message));
          conn.on('close', () => {
            state.teacherConnections.delete(conn.peer);
            for (const person of Object.values(state.participants)) {
              if (person.peerId === conn.peer) person.online = false;
            }
            saveState();
            renderRoster();
          });
          conn.on('error', (error) => showNotice(`與學生的連線發生問題：${error.message}`));
        });
        peer.on('disconnected', () => {
          setTeacherStatus('訊號伺服器中斷，正在嘗試恢復…', 'error');
          try { if (!peer.destroyed) peer.reconnect(); }
          catch (error) { showNotice(`教室訊號連線無法恢復：${error.message}`); }
        });
        peer.on('error', (error) => {
          byId('createRoomBtn').disabled = false;
          setTeacherStatus(`連線失敗：${error.type || error.message}`, 'error');
          showNotice(`教室連線失敗（${error.type || '未知錯誤'}）。請稍後重新建立教室。`);
        });
      }

      function handleTeacherMessage(conn, message) {
        if (!message || typeof message !== 'object' || typeof message.type !== 'string') return;
        if (message.type === 'join' && typeof message.name === 'string' && typeof message.studentId === 'string') {
          const name = message.name.trim().slice(0, 30);
          const id = message.studentId.slice(0, 80);
          if (!name || !id) return;
          state.participants[id] = { id, name, online: true, peerId: conn.peer };
          conn.studentId = id;
          conn.send({ type: 'roster', students: Object.values(state.participants).filter((person) => person.online).map(({ id: studentId, name: studentName }) => ({ id: studentId, name: studentName })) });
          if (state.current) {
            conn.send({
              type: 'question',
              qType: state.current.qType,
              question: state.current.question,
              options: state.current.options,
              open: state.current.open,
              remaining: state.current.qType === 'buzz' && state.current.open ? Math.max(0, (Number(state.current.deadlineAt) || state.buzzDeadline) - Date.now()) : 0
            });
            const previousAnswer = state.current.answers[id];
            if (previousAnswer) conn.send({ type: 'accepted', answer: previousAnswer.payload });
          }
          saveState();
          renderRoster();
          return;
        }
        if (message.type === 'answer' && state.current && state.current.open && typeof message.payload === 'string') {
          const studentId = typeof message.studentId === 'string' ? message.studentId : '';
          const person = state.participants[studentId];
          if (!person || person.peerId !== conn.peer || state.current.answers[studentId]) return;
          if (state.current.qType === 'buzz') return;
          if (state.current.qType === 'choice' && !['A', 'B', 'C', 'D'].slice(0, state.current.options.length).includes(message.payload)) return;
          if (state.current.qType === 'text' && !message.payload.trim()) return;
          state.current.answers[studentId] = {
            studentId,
            name: person.name,
            payload: message.payload.slice(0, 1000),
            at: Date.now()
          };
          conn.send({ type: 'accepted', answer: message.payload });
          saveState();
          renderResults();
          return;
        }
        if (message.type === 'buzz' && state.current && state.current.qType === 'buzz' && state.current.open && state.buzzOpen) {
          const studentId = typeof message.studentId === 'string' ? message.studentId : '';
          const person = state.participants[studentId];
          if (!person || person.peerId !== conn.peer || state.current.answers[studentId]) return;
          const at = Date.now();
          state.current.answers[studentId] = {
            studentId,
            name: person.name,
            payload: '搶答',
            at,
            sequence: Object.keys(state.current.answers).length,
            elapsedMs: Math.max(0, at - state.current.startedAt)
          };
          conn.send({ type: 'accepted', answer: '搶答' });
          saveState();
          renderResults();
        }
      }

      function publishQuestion(event) {
        event.preventDefault();
        if (!state.teacherPeer || !state.teacherPeer.open) {
          showNotice('請先建立教室並等待連線完成，再發布題目。');
          return;
        }
        const question = byId('questionInput').value.trim();
        if (!question) return;
        const options = state.mode === 'choice'
          ? ['optionA', 'optionB', 'optionC', 'optionD'].map((id) => byId(id).value.trim())
          : [];
        if (state.mode === 'choice' && options.some((option) => !option)) return;
        const duration = Math.min(120, Math.max(3, Number(byId('buzzDuration').value) || 15));
        const item = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          qType: state.mode,
          question,
          options,
          startedAt: Date.now(),
          deadlineAt: state.mode === 'buzz' ? Date.now() + duration * 1000 : null,
          endedAt: null,
          open: true,
          answers: {}
        };
        state.current = item;
        state.history.push(item);
        state.buzzOpen = state.mode === 'buzz';
        if (state.buzzOpen) {
          state.buzzDeadline = item.deadlineAt;
          window.clearInterval(state.buzzTimer);
          state.buzzTimer = window.setInterval(() => {
            if (Date.now() >= state.buzzDeadline) endQuestion();
            else renderResults();
          }, 200);
        } else {
          window.clearInterval(state.buzzTimer);
        }
        const packet = { type: 'question', qType: item.qType, question: item.question, options: item.options, open: true, remaining: duration * 1000 };
        broadcast(packet);
        saveState();
        renderResults();
      }

      function broadcast(message) {
        for (const conn of state.teacherConnections.values()) {
          if (conn.open) conn.send(message);
        }
      }

      function endQuestion() {
        if (!state.current || !state.current.open) return;
        state.current.open = false;
        state.current.endedAt = Date.now();
        state.buzzOpen = false;
        window.clearInterval(state.buzzTimer);
        broadcast({ type: 'ended' });
        saveState();
        renderResults();
      }

      function createRoom() {
        clearNotice();
        const roomCode = String(Math.floor(1000 + Math.random() * 9000));
        openTeacherPeer(roomCode);
      }

      function studentStorageId() {
        let id = localStorage.getItem('irs-student-id');
        if (!id) {
          id = window.crypto && typeof window.crypto.randomUUID === 'function'
            ? window.crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          localStorage.setItem('irs-student-id', id);
        }
        return id;
      }

      function joinRoom() {
        const roomCode = byId('studentRoom').value.trim();
        const name = byId('studentName').value.trim();
        if (!/^\d{4}$/.test(roomCode)) {
          setStudentStatus('請輸入有效的 4 位數教室代碼', 'error');
          return;
        }
        if (!name) {
          setStudentStatus('請先輸入姓名', 'error');
          byId('studentName').focus();
          return;
        }
        if (!peerLibraryAvailable) {
          setStudentStatus('PeerJS 載入失敗，請重新載入頁面', 'error');
          return;
        }
        window.clearTimeout(state.reconnectTimer);
        if (state.studentPeer) state.studentPeer.destroy();
        state.studentId = studentStorageId();
        state.studentName = name.slice(0, 30);
        state.currentStudentAnswer = null;
        byId('studentRoom').value = roomCode;
        byId('joinForm').classList.add('hidden');
        byId('studentActivity').classList.remove('hidden');
        byId('reconnectBtn').classList.add('hidden');
        setStudentStatus('連線中…', '');
        connectStudent(roomCode);
      }

      function connectStudent(roomCode) {
        if (!peerLibraryAvailable) return;
        window.clearTimeout(state.studentConnectTimer);
        if (state.studentPeer && !state.studentPeer.destroyed) state.studentPeer.destroy();
        const peer = new window.Peer();
        state.studentPeer = peer;
        state.studentConnectTimer = window.setTimeout(() => {
          if (state.studentPeer !== peer || (state.studentConn && state.studentConn.open)) return;
          setStudentStatus('連線逾時，請確認代碼與老師端教室狀態後重試', 'error');
          byId('reconnectBtn').classList.remove('hidden');
        }, 20000);
        peer.on('open', () => {
          if (state.studentPeer !== peer) return;
          state.studentConn = peer.connect(`class-${roomCode}`, { reliable: true });
          if (!state.studentConn) {
            setStudentStatus('無法建立連線，請重新連線', 'error');
            byId('reconnectBtn').classList.remove('hidden');
            return;
          }
          state.studentConn.on('open', () => {
            if (state.studentPeer !== peer) return;
            window.clearTimeout(state.studentConnectTimer);
            setStudentStatus('已連線至教室', 'connected');
            byId('reconnectBtn').classList.add('hidden');
            state.studentConn.send({ type: 'join', name: state.studentName, studentId: state.studentId });
          });
          state.studentConn.on('data', handleStudentMessage);
          const connection = state.studentConn;
          connection.on('close', () => {
            if (state.studentConn === connection && state.studentPeer === peer) studentDisconnected();
          });
          state.studentConn.on('error', (error) => {
            if (state.studentPeer !== peer) return;
            window.clearTimeout(state.studentConnectTimer);
            setStudentStatus(`連線錯誤：${error.message}`, 'error');
            byId('reconnectBtn').classList.remove('hidden');
          });
        });
        peer.on('disconnected', () => {
          if (state.studentPeer !== peer) return;
          setStudentStatus('訊號連線中斷，正在重新連線…', 'error');
          try { if (!peer.destroyed) peer.reconnect(); }
          catch (error) {
            setStudentStatus(`重新連線失敗：${error.message}`, 'error');
            byId('reconnectBtn').classList.remove('hidden');
          }
        });
        peer.on('error', (error) => {
          if (state.studentPeer !== peer) return;
          window.clearTimeout(state.studentConnectTimer);
          setStudentStatus(`連線失敗：${error.type || error.message}`, 'error');
          byId('reconnectBtn').classList.remove('hidden');
          byId('joinForm').classList.remove('hidden');
        });
      }

      function studentDisconnected() {
        window.clearTimeout(state.studentConnectTimer);
        setStudentStatus('與教室的連線已中斷，請重新連線', 'error');
        byId('reconnectBtn').classList.remove('hidden');
        state.reconnectTimer = window.setTimeout(() => {
          if (state.studentPeer && !state.studentPeer.destroyed) state.studentPeer.destroy();
        }, 100);
      }

      function handleStudentMessage(message) {
        if (!message || typeof message !== 'object' || typeof message.type !== 'string') return;
        if (message.type === 'question') {
          state.currentStudentAnswer = null;
          renderStudentQuestion(message);
        } else if (message.type === 'accepted') {
          state.currentStudentAnswer = message.answer;
          byId('studentFeedback').textContent = '答案已送出';
          setStudentStatus('已連線 · 作答已送出', 'connected');
          lockStudentAnswer();
        } else if (message.type === 'ended') {
          byId('studentFeedback').textContent = '本題作答已結束';
          lockStudentAnswer();
        }
      }

      function renderStudentQuestion(question) {
        const host = byId('studentQuestion');
        host.classList.remove('hidden');
        host.replaceChildren();
        const title = document.createElement('h3');
        title.className = 'student-question';
        title.textContent = question.question;
        host.append(title);
        if (!question.open) {
          byId('studentFeedback').textContent = '本題作答已結束';
          return;
        }
        byId('studentFeedback').textContent = '';
        if (question.qType === 'choice') {
          const list = document.createElement('div');
          list.className = 'student-options';
          (Array.isArray(question.options) ? question.options : []).slice(0, 4).forEach((option, index) => {
            const label = String.fromCharCode(65 + index);
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.type = 'button';
            const letter = document.createElement('span');
            letter.className = 'choice-letter';
            letter.textContent = label;
            const text = document.createElement('span');
            text.textContent = option;
            button.append(letter, text);
            button.addEventListener('click', () => sendStudentAnswer(label));
            list.append(button);
          });
          host.append(list);
        } else if (question.qType === 'text') {
          const field = document.createElement('div');
          field.className = 'field';
          const textarea = document.createElement('textarea');
          textarea.id = 'irs-studentTextAnswer';
          textarea.className = 'text-answer';
          textarea.maxLength = 1000;
          textarea.placeholder = '輸入你的回答…';
          const send = document.createElement('button');
          send.type = 'button';
          send.className = 'button block';
          send.textContent = '送出回答';
          send.addEventListener('click', () => {
            const answer = textarea.value.trim();
            if (!answer) {
              byId('studentFeedback').textContent = '請先輸入回答';
              return;
            }
            sendStudentAnswer(answer);
          });
          field.append(textarea, send);
          host.append(field);
        } else if (question.qType === 'buzz') {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'buzz-button';
          button.textContent = '搶答！';
          button.addEventListener('click', () => sendBuzz());
          host.append(button);
          const countdown = document.createElement('p');
          countdown.className = 'countdown';
          countdown.style.textAlign = 'center';
          host.append(countdown);
          const deadline = Date.now() + Math.max(0, Number(question.remaining) || 0);
          const interval = window.setInterval(() => {
            if (!host.isConnected || host.querySelector('.buzz-button') !== button) {
              window.clearInterval(interval);
              return;
            }
            const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            countdown.textContent = `剩餘 ${seconds} 秒`;
            if (seconds === 0) {
              button.disabled = true;
              window.clearInterval(interval);
            }
          }, 250);
        }
      }

      function sendStudentAnswer(payload) {
        if (!state.studentConn || !state.studentConn.open || state.currentStudentAnswer !== null) return;
        state.studentConn.send({ type: 'answer', name: state.studentName, studentId: state.studentId, payload });
        byId('studentFeedback').textContent = '正在送出…';
      }

      function sendBuzz() {
        if (!state.studentConn || !state.studentConn.open || state.currentStudentAnswer !== null) return;
        state.studentConn.send({ type: 'buzz', name: state.studentName, studentId: state.studentId, timestamp: Date.now() });
        byId('studentFeedback').textContent = '搶答訊號已送出，等待確認…';
        const button = byId('studentQuestion').querySelector('.buzz-button');
        if (button) button.disabled = true;
      }

      function lockStudentAnswer() {
        byId('studentQuestion').querySelectorAll('button, textarea').forEach((control) => { control.disabled = true; });
      }

      function exportCsv() {
        const rows = [['題目編號', '題型', '題目', '學生姓名', '作答內容', '作答時間', '搶答名次']];
        for (const item of state.history) {
          const answers = Object.values(item.answers || {}).sort((a, b) => (a.at || 0) - (b.at || 0));
          const rank = new Map();
          if (item.qType === 'buzz') answers.forEach((answer, index) => rank.set(answer.studentId, index + 1));
          if (!answers.length) {
            rows.push([item.id, modeName(item.qType), item.question, '', '', '', '']);
          }
          for (const answer of answers) {
            const response = item.qType === 'choice'
              ? `${answer.payload}${item.options[answer.payload.charCodeAt(0) - 65] ? `：${item.options[answer.payload.charCodeAt(0) - 65]}` : ''}`
              : answer.payload;
            rows.push([
              item.id,
              modeName(item.qType),
              item.question,
              answer.name,
              response,
              new Date(answer.at).toLocaleString('zh-TW'),
              item.qType === 'buzz' && rank.get(answer.studentId) <= 3 ? String(rank.get(answer.studentId)) : ''
            ]);
          }
        }
        const csv = '\uFEFF' + rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `IRS_作答紀錄_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
      }

      function clearLocalData() {
        if (!window.confirm('確定清除這台裝置保存的題目與作答紀錄？目前教室連線不會自動中斷。')) return;
        state.history = [];
        state.current = null;
        state.participants = {};
        saveState();
        renderResults();
        showNotice('本機課堂紀錄已清除。');
      }

      byId('teacherTab').addEventListener('click', () => setRole('teacher'));
      byId('studentTab').addEventListener('click', () => setRole('student'));
      byId('createRoomBtn').addEventListener('click', createRoom);
      byId('restoreRoomBtn').addEventListener('click', () => {
        if (state.roomCode) openTeacherPeer(state.roomCode);
      });
      byId('questionForm').addEventListener('submit', publishQuestion);
      byId('endQuestionBtn').addEventListener('click', endQuestion);
      byId('exportBtn').addEventListener('click', exportCsv);
      byId('clearDataBtn').addEventListener('click', clearLocalData);
      byId('joinBtn').addEventListener('click', joinRoom);
      byId('reconnectBtn').addEventListener('click', () => {
        const code = byId('studentRoom').value.trim();
        if (code && state.studentName) {
          byId('reconnectBtn').classList.add('hidden');
          setStudentStatus('重新連線中…', '');
          connectStudent(code);
        } else {
          byId('joinForm').classList.remove('hidden');
        }
      });
      el.querySelectorAll('.mode-tabs button').forEach((button) => button.addEventListener('click', () => updateMode(button.dataset.mode)));

      loadState();
      for (const person of Object.values(state.participants)) person.online = false;
      updateMode(state.mode);
      renderRoom();
      renderResults();
      const params = new URLSearchParams(window.location.search);
      const requestedRoom = params.get('room');
      if (requestedRoom) {
        byId('studentRoom').value = requestedRoom;
        setRole('student');
      } else {
        setRole('teacher');
      }
      if (state.roomCode && !requestedRoom) byId('restoreRoomBtn').classList.remove('hidden');
    })();
  }
});
