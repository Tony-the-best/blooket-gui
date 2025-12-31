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
  const emojify = t => { for(const k in emojis) t=t.split(k).join(emojis[k]); return t; };

  const loadScript = (src, cb) => { const s=document.createElement("script"); s.src=src; s.onload=cb; document.head.appendChild(s); };
  loadScript("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js", () => {
    loadScript("https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js", startChat);
  });

  async function startChat() {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const username = prompt("👋 Welcome! Enter your username:") || "Guest";

    const servers = ["server1","server2","server3"];
    let currentRoom = "server1";
    for(const srv of servers){
      const snap = await db.ref("rooms/"+srv).once("value");
      if(!snap.exists() || snap.numChildren()<1){ currentRoom=srv; break; }
    }

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    const ui = document.createElement("div");
    ui.innerHTML = `
      <div id="hdr">Blooket Chat<br><small>Made by Tony-the-best on GitHub</small><span id="x">✕</span></div>
      <div id="msgs"></div>
      <div id="bar"><input id="inp" placeholder="Type a message..." /><button id="send">Send</button></div>
      <div id="emojiBar"></div>
    `;
    document.body.appendChild(ui);

    Object.assign(ui.style,{
      position:"fixed",
      bottom:isMobile?"10px":"60px",
      right:isMobile?"5%":"60px",
      width:isMobile?"90%":"380px",
      maxWidth:isMobile?"360px":undefined,
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
      #hdr{background:#2d8cff;color:#fff;padding:8px;font-weight:900;cursor:move;border-top-left-radius:10px;border-top-right-radius:10px;font-size:14px}
      #hdr small{font-size:10px}
      #x{float:right;cursor:pointer}
      #msgs{flex:1;overflow:auto;background:#dbeaff;padding:6px;margin:2px;border-radius:4px;font-size:14px}
      #bar{display:flex;margin:2px}
      #inp{flex:1;padding:4px;border-radius:4px;border:1px solid #aaa;font-size:13px}
      #send{background:#7a3cff;color:#fff;border:0;border-radius:4px;margin-left:4px;padding:4px 8px;cursor:pointer;font-weight:600}
      #emojiBar{padding:4px 2px;margin:2px;background:#eef;margin-bottom:2px;border-radius:6px;display:flex;flex-wrap:wrap}
      #emojiBar span{cursor:pointer;margin:2px;font-size:${isMobile?"22px":"18px"}}
    `;
    document.head.appendChild(style);

    const msgs = ui.querySelector("#msgs"),
          input = ui.querySelector("#inp"),
          emojiBar = ui.querySelector("#emojiBar");

    for(const k in emojis){
      const e=document.createElement("span");
      e.textContent = emojis[k];
      e.onclick = ()=>{ input.value += emojis[k]; input.focus(); };
      emojiBar.appendChild(e);
    }

    let drag=false, dx=0, dy=0;
    ui.querySelector("#hdr").onmousedown=e=>{drag=true;dx=e.clientX-ui.offsetLeft;dy=e.clientY-ui.offsetTop};
    document.onmousemove=e=>{if(drag){ui.style.left=e.clientX-dx+"px";ui.style.top=e.clientY-dy+"px"}};
    document.onmouseup=()=>drag=false;

    ui.querySelector("#x").onclick=()=>ui.remove();

    const listen=()=>{msgs.innerHTML="";db.ref("rooms/"+currentRoom).limitToLast(100).on("child_added",snap=>{
      const t=snap.val();
      if(Date.now()-t.time>1800000){snap.ref.remove();return;}
      const n=document.createElement("div");
      n.innerHTML=`<b>${t.user}</b>: ${emojify(t.text)}`;
      msgs.appendChild(n);
      msgs.scrollTop=msgs.scrollHeight;
    })};
    listen();

    const sendMsg=()=>{if(!input.value)return;db.ref("rooms/"+currentRoom).push({user:username,text:input.value,time:Date.now()});input.value=""};
    ui.querySelector("#send").onclick=sendMsg;
    input.onkeydown=e=>{if(e.key==="Enter")sendMsg()};
  }
})();
