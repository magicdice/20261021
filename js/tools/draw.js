App.register({
  id: "draw",
  title: "抽籤與分組",
  icon: "🎲",
  init(el) {
    const frame = document.createElement("iframe");
    frame.className = "tool-frame";
    frame.title = "課堂多功能抽籤與分組機";
    frame.src = "index_1.html";
    frame.loading = "eager";
    el.append(frame);
  }
});
