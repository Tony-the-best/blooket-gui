(() => {
  // Prevent running twice
  if (window.__BLOOKET_CHAT__) return;
  window.__BLOOKET_CHAT__ = true;

  // ====== CONFIG ======
  const SIGNAL_SERVER = "wss://blooket-lan-chat-signaling.glitch.me";
  const MESSAGE_TTL = 30 * 60 * 1000; // 30 minutes
  const STUN_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" }
  ];

  // ====== USER ======
  const username = prompt("Username?") || "Guest";
  let currentRoom = "server1";

  // ====== STATE ======
  const peerConnections = {};
  const dataChannels = {};
  const userColors = {};
  const myId = Math.random().toString(36).slice(2, 7);

  // Sound when message arrives
  const messageSound = new Audio(
    "https://actions.google.com/sounds/v1/cartoon/pop.ogg"
  );

  function getUserColor(name) {
    if (!userColors[name]) {
      userColors[name] = `hsl(${Math.random() * 360}, 80%, 55%)`;
    }
    return userColors[name];
  }

  // ====== UI ======
  const chat = document.createElement("div");
  chat.innerHTML = `
    <div id="header">
      Blooket LAN Chat
      <br><small>Made by Tony-the-best on GitHub</small>
      <span id="close">✕</span>
    </div>

    <div id="status">🟡 Connecting...</div>

    <div id="rooms">
      <button data-room="server1" class="active">Server 1</button>
      <button data-room="server2">Server 2</button>
      <button data-room="server3">Server 3</button>
    </div>

    <div id="messages"></div>

    <div id="inputBar">
      <input id="input" placeholder="Type a message..." />
      <button id="send">Send</button>
    </div>
  `;

  document.body.appendChild(chat);

  // ====== STYLES ======
  const style = document.createElement("style");
  style.textContent = `
    #header {
      background: #2d8cff;
      color: white;
      padding: 8px;
      font-weight: bold;
      cursor: move;
    }
    #header small { font-size: 10px; }
    #close { float: right; cursor: pointer; }
    #status { font-size: 12px; padding: 4px; }
    #rooms button {
      background: #7a3cff;
      color: white;
      border: none;
      margin: 2px;
      padding: 4px;
    }
    #rooms .active { background: #a56bff; }
    #messages {
      flex: 1;
      overflow-y: auto;
      background: #dbeaff;
      padding: 6px;
    }
    #inputBar { display: flex; }
    #input { flex: 1; }
    #send { background: #7a3cff; color: white; border: none; }
    div { font-family: sans-serif; }
  `;
  document.head.appendChild(style);

  Object.assign(chat.style, {
    position: "fixed",
    top: "60px",
    left: "60px",
    width: "360px",
    height: "520px",
    display: "flex",
    flexDirection: "column",
    zIndex: 999999,
    border: "3px solid black",
    borderRadius: "12px",
    background: "white"
  });

  // ====== DRAGGING ======
  let dragging = false, offsetX = 0, offsetY = 0;

  chat.querySelector("#header").onmousedown = e => {
    dragging = true;
    offsetX = e.clientX - chat.offsetLeft;
    offsetY = e.clientY - chat.offsetTop;
  };

  document.onmousemove = e => {
    if (!dragging) return;
    chat.style.left = e.clientX - offsetX + "px";
    chat.style.top = e.clientY - offsetY + "px";
  };

  document.onmouseup = () => dragging = false;

  // ====== ROOMS ======
  chat.querySelectorAll("#rooms button").forEach(btn => {
    btn.onclick = () => {
      chat.querySelectorAll("#rooms button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentRoom = btn.dataset.room;
      messages.innerHTML = "";
    };
  });

  // ====== MESSAGING ======
  const messages = chat.querySelector("#messages");
  const input = chat.querySelector("#input");

  function showMessage(msg) {
    if (Date.now() - msg.time > MESSAGE_TTL) return;
    if (msg.room !== currentRoom) return;

    const line = document.createElement("div");
    line.innerHTML = `<b style="color:${getUserColor(msg.user)}">${msg.user}</b>: ${msg.text}`;
    messages.appendChild(line);
    messages.scrollTop = messages.scrollHeight;
    messageSound.play();
  }

  function broadcast(msg) {
    showMessage(msg);
    Object.values(dataChannels).forEach(dc => {
      if (dc.readyState === "open") {
        dc.send(JSON.stringify(msg));
      }
    });
  }

  // ====== SIGNALING ======
  const socket = new WebSocket(SIGNAL_SERVER);

  socket.onopen = () => {
    chat.querySelector("#status").textContent = "🟢 Online";
    socket.send(JSON.stringify({ join: myId }));
  };

  socket.onmessage = async e => {
    const data = JSON.parse(e.data);
    if (data.from === myId) return;

    if (data.offer) {
      const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });
      peerConnections[data.from] = pc;

      pc.ondatachannel = ev => {
        dataChannels[data.from] = ev.channel;
        ev.channel.onmessage = m => showMessage(JSON.parse(m.data));
      };

      await pc.setRemoteDescription(data.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.send(JSON.stringify({
        answer,
        to: data.from,
        from: myId
      }));
    }

    if (data.answer) {
      await peerConnections[data.from]?.setRemoteDescription(data.answer);
    }
  };

  // ====== INIT PEER ======
  const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });
  const dc = pc.createDataChannel("chat");

  dataChannels[myId] = dc;
  dc.onmessage = e => showMessage(JSON.parse(e.data));

  pc.onicecandidate = e => {
    if (e.candidate) {
      socket.send(JSON.stringify({ ice: e.candidate, from: myId }));
    }
  };

  pc.createOffer().then(offer => {
    pc.setLocalDescription(offer);
    socket.send(JSON.stringify({ offer, from: myId }));
  });

  // ====== INPUT ======
  chat.querySelector("#send").onclick = () => {
    if (!input.value) return;
    broadcast({
      user: username,
      text: input.value,
      time: Date.now(),
      room: currentRoom
    });
    input.value = "";
  };

  input.onkeydown = e => e.key === "Enter" && chat.querySelector("#send").click();
  chat.querySelector("#close").onclick = () => chat.remove();
})();
