(() => {
if(window.__BLOOKET_LAN_CHAT_CONSOLE__) return; window.__BLOOKET_LAN_CHAT_CONSOLE__=true;

const TTL=30*60*1000;
const user=prompt("Username?")||"Guest";
let room="server1"; const pcs={},dcs={},peers=[];

const chatBox=document.createElement("div");
chatBox.id="chatBox";
chatBox.innerHTML=`
<div id="header">Blooket LAN Chat <span id="close">✕</span></div>
<div id="rooms">
  <button data-r="server1" class="on">Server 1</button>
  <button data-r="server2">Server 2</button>
  <button data-r="server3">Server 3</button>
</div>
<div id="msgs"></div>
<input id="inp" placeholder="Type message..." />
`;
document.body.appendChild(chatBox);

const css=document.createElement("style");
css.textContent=`
#chatBox{position:fixed;top:50px;left:50px;width:420px;height:520px;background:linear-gradient(180deg,#4a90e2,#357ABD);border:3px solid #333;border-radius:12px;display:flex;flex-direction:column;box-shadow:0 5px 20px rgba(0,0,0,0.3);z-index:999999;}
#header{padding:12px;background:#357ABD;cursor:move;display:flex;justify-content:space-between;font-weight:bold;border-radius:9px 9px 0 0;color:#fff;}
#rooms button{margin:2px;background:#6a0dad;color:#fff;border:none;cursor:pointer;border-radius:6px;flex:1;}
#rooms .on{background:#9b30ff;color:#fff;}
#msgs{flex:1;padding:8px;overflow-y:auto;font-size:13px;background:#cce0ff;border-top:2px solid #333;border-bottom:2px solid #333;}
#inp{border:none;padding:10px;outline:none;border-top:1px solid #333;border-radius:0 0 9px 9px;background:#e6f0ff;}
button{cursor:pointer;border-radius:6px;padding:6px;font-weight:bold;}
`;
document.head.appendChild(css);

const header=document.getElementById("header");
const msgs=document.getElementById("msgs");
const inp=document.getElementById("inp");

let drag=false,ox,oy;
header.onmousedown=e=>{drag=true;ox=e.clientX-chatBox.offsetLeft;oy=e.clientY-chatBox.offsetTop;};
document.onmouseup=()=>drag=false;
document.onmousemove=e=>{if(drag){chatBox.style.left=e.clientX-ox+"px";chatBox.style.top=e.clientY-oy+"px";}};

document.querySelectorAll("#rooms button").forEach(b=>{
  b.onclick=()=>{document.querySelectorAll("#rooms button").forEach(x=>x.classList.remove("on"));b.classList.add("on");room=b.dataset.r;msgs.innerHTML="";}
});

function show(m){if(Date.now()-m.t>TTL||m.room!==room)return;const d=document.createElement("div");d.textContent=`[${m.u}] ${m.m}`;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
function send(m){show(m);for(const id in dcs){const dc=dcs[id];if(dc.readyState==="open")dc.send(JSON.stringify(m));}}

// ===== ONE-CODE SIGNALING =====
const SIGNAL_SERVER="wss://blooket-lan-chat-signaling.glitch.me";
const ws=new WebSocket(SIGNAL_SERVER);
const peerId=Math.random().toString(36).substring(2,8);

ws.onopen=()=>ws.send(JSON.stringify({type:"join",id:peerId}));
ws.onmessage=async e=>{
  const msg=JSON.parse(e.data);
  if(msg.from===peerId)return;
  if(msg.type==="offer"){
    const pc=new RTCPeerConnection();
    pcs[msg.from]=pc;
    pc.ondatachannel=ev=>{dcs[msg.from]=ev.channel;ev.channel.onmessage=f=>show(JSON.parse(f.data));};
    await pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
    const answer=await pc.createAnswer();await pc.setLocalDescription(answer);
    ws.send(JSON.stringify({type:"answer",answer,from:peerId,to:msg.from}));
  } else if(msg.type==="answer"){
    const pc=pcs[msg.from];if(!pc)return;await pc.setRemoteDescription(new RTCSessionDescription(msg.answer));
  }
};

const pc=new RTCPeerConnection();
const dc=pc.createDataChannel("chat");dcs["self"]=dc;pcs["self"]=pc;
dc.onmessage=e=>show(JSON.parse(e.data));
pc.onicecandidate=e=>{if(e.candidate) return; ws.send(JSON.stringify({type:"ice",candidate:e.candidate,from:peerId}));};
pc.createOffer().then(offer=>pc.setLocalDescription(offer).then(()=>ws.send(JSON.stringify({type:"offer",offer,from:peerId}))));

inp.onkeydown=e=>{if(e.key!=="Enter"||!inp.value)return;send({u:user,m:inp.value,t:Date.now(),room});inp.value="";}
document.getElementById("close").onclick=()=>chatBox.remove();
})();
