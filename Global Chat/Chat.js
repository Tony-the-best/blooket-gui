(() => {
  if (window.blooketChatLoaded) return;
  window.blooketChatLoaded = true;

  const firebaseConfig = {
    apiKey: "AIzaSyBBqdCXK6X_kNn3ybkJDaasRZ7amxVJqc",
    authDomain: "blooket-chat.firebaseapp.com",
    databaseURL: "https://blooket-chat-default-rtdb.firebaseio.com",
    projectId: "blooket-chat",
    storageBucket: "blooket-chat.firebasestorage.app",
    messagingSenderId: "1012332349320",
    appId: "1:1012332349320:web:cf9a2a7632421b1e591c3d"
  };

  const emojis = {":smile:":"😄",":heart:":"❤️",":thumbsup:":"👍",":star:":"⭐",":fire:":"🔥"};
  const emojify = t => { for (const k in emojis) t = t.split(k).join(emojis[k]); return t; };

  const load = (src, cb) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  };

  load("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js", () => {
    load("https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js", start);
  });

  async function start() {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    const username = prompt("👋 Hey! Enter your username:") || "Guest";
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    /* -------- AUTO HOST (FIXED) -------- */
    const servers = ["server1", "server2", "server3"];
    let room = servers[0];

    for (const s of servers) {
      const snap = await db.ref("rooms/" + s).once("value");
      if (!snap.exists() || Object.values(snap.val()).every(m => Date.now() - m.time > 1800000)) {
        room = s;
        break;
      }
    }

    /* -------- UI -------- */
    const ui = document.createElement("div");
    ui.innerHTML = `
      <div id="hdr">Blooket Chat<br><small>Made by Tony-the-best on GitHub</small><span id="x">✕</span></div>
      <div id="msgs"></div>
      <div id="emojiBar"></div>
      <div id="bar">
        <input id="inp" placeholder="Type a message..." />
        <button id="send">Send</button>
      </div>
    `;
    document.body.appendChild(ui);

    Object.assign(ui.style,{
      position:"fixed",
      bottom:isMobile?"10px":"60px",
      right:isMobile?"5%":"60px",
      width:isMobile?"90%":"380px",
      height:isMobile?"50%":"550px",
      display:"flex",
      flexDirection:"column",
      zIndex:999999,
      background:"#fff",
      border:"3px solid #000",
      borderRadius:"12px",
      fontFamily:"Arial,sans-serif"
    });

    const style = document.createElement("style");
    style.textContent = `
      #hdr{background:#2d8cff;color:#fff;padding:8px;font-weight:900;cursor:move}
      #hdr small{font-size:10px}
      #x{float:right;cursor:pointer}
      #msgs{flex:1;overflow:auto;background:#dbeaff;padding:6px;margin:4px;border-radius:6px}
      #bar{display:flex;margin:4px}
      #inp{flex:1;padding:6px;border-radius:6px;border:1px solid #aaa}
      #send{background:#7a3cff;color:#fff;border:0;border-radius:6px;margin-left:4px;padding:6px 10px;font-weight:700}
      #emojiBar{padding:4px;margin:4px;background:#eef;border-radius:6px}
      #emojiBar span{cursor:pointer;font-size:${isMobile?"22px":"18px"};margin:3px}
    `;
    document.head.appendChild(style);

    const msgs = ui.querySelector("#msgs");
    const input = ui.querySelector("#inp");
    const emojiBar = ui.querySelector("#emojiBar");

    for (const k in emojis) {
      const s = document.createElement("span");
      s.textContent = emojis[k];
      s.onclick = () => input.value += emojis[k];
      emojiBar.appendChild(s);
    }

    /* -------- DRAG (MOUSE + TOUCH) -------- */
    let drag=false, ox=0, oy=0;
    const startDrag = e => {
      drag=true;
      const t=e.touches?e.touches[0]:e;
      ox=t.clientX-ui.offsetLeft; oy=t.clientY-ui.offsetTop;
    };
    const moveDrag = e => {
      if(!drag) return;
      const t=e.touches?e.touches[0]:e;
      ui.style.left=t.clientX-ox+"px";
      ui.style.top=t.clientY-oy+"px";
    };
    ui.querySelector("#hdr").addEventListener("mousedown",startDrag);
    ui.querySelector("#hdr").addEventListener("touchstart",startDrag);
    document.addEventListener("mousemove",moveDrag);
    document.addEventListener("touchmove",moveDrag);
    document.addEventListener("mouseup",()=>drag=false);
    document.addEventListener("touchend",()=>drag=false);

    ui.querySelector("#x").onclick=()=>ui.remove();

    /* -------- CHAT -------- */
    db.ref("rooms/"+room).limitToLast(100).on("child_added", snap => {
      const m = snap.val();
      if (Date.now() - m.time > 1800000) { snap.ref.remove(); return; }
      const d = document.createElement("div");
      d.innerHTML = `<b>${m.user}</b>: ${emojify(m.text)}`;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    });

    const send = () => {
      if (!input.value.trim()) return;
      db.ref("rooms/"+room).push({
        user: username,
        text: input.value,
        time: Date.now()
      });
      input.value="";
    };

    ui.querySelector("#send").onclick = send;
    input.onkeydown = e => e.key==="Enter" && send();
  }
})();
