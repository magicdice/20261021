App.register({
  id: "clock",
  title: "時間管理",
  icon: "⏰",
  init(el) {
    const frame = document.createElement("iframe");
    frame.className = "tool-frame";
    frame.title = "課堂時間管理系統";
    frame.src = "index_2.html";
    frame.loading = "eager";
    el.append(frame);
  }
});
