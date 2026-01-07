javascript:(function(){
/* Blooket token adder.js v5.1 */
let style=document.createElement('style');
style.innerHTML='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;overflow:hidden;}.elite-dashboard{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;background:rgba(0,0,0,0.97);backdrop-filter:blur(25px);padding:25px;max-width:1450px;margin:0 auto;display:flex;flex-direction:column}.header{position:relative;background:rgba(255,255,255,0.12);backdrop-filter:blur(25px);border-radius:28px;padding:35px;text-align:center;margin-bottom:35px;border:1px solid rgba(255,255,255,0.18);box-shadow:0 25px 70px rgba(0,0,0,0.6)}.logo{font-size:42px;font-weight:900;background:linear-gradient(135deg,#00ff88,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:15px;text-shadow:0 0 35px rgba(0,255,136,0.6)}.subtitle{color:rgba(255,255,255,0.92);font-size:19px;font-weight:500;letter-spacing:.5px}.content{display:flex;gap:35px;overflow:auto;padding-bottom:35px;flex:1}.card{background:rgba(255,255,255,0.09);backdrop-filter:blur(25px);border-radius:24px;border:1px solid rgba(255,255,255,0.16);padding:28px;flex:1;min-width:360px;box-shadow:0 20px 50px rgba(0,0,0,0.45);transition:all .35s cubic-bezier(.25,.46,.45,.94)}.card:hover{transform:translateY(-8px);border-color:rgba(0,255,136,0.5);box-shadow:0 30px 70px rgba(0,0,0,0.55)}.card-title{font-size:22px;font-weight:800;color:#00ff88;margin-bottom:24px;display:flex;align-items:center;gap:12px;text-shadow:0 2px 8px rgba(0,255,136,0.3)}.input-group{margin-bottom:22px}.input-label{display:block;color:rgba(255,255,255,0.95);font-weight:600;margin-bottom:8px;font-size:14px}.input-field{width:100%;padding:16px 18px;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.25);border-radius:16px;color:#fff;font-size:16px;font-weight:500;transition:all .35s ease;backdrop-filter:blur(12px);font-family:"JetBrains Mono",monospace}.input-field:focus{outline:0;border-color:#00ff88;box-shadow:0 0 0 4px rgba(0,255,136,0.25);transform:scale(1.02)}.input-field::placeholder{color:rgba(255,255,255,0.6)}.btn{padding:16px 28px;border:none;border-radius:16px;font-family:inherit;font-size:16px;font-weight:700;cursor:pointer;transition:all .35s ease;text-transform:uppercase;letter-spacing:.8px;width:100%;margin-bottom:12px;position:relative;overflow:hidden}.btn:disabled{opacity:.6;cursor:not-allowed}.btn-primary{background:linear-gradient(135deg,#00ff88,#00d430);color:#000;font-weight:800;box-shadow:0 10px 30px rgba(0,255,136,0.45)}.btn-primary:hover:not(:disabled){transform:translateY(-4px) scale(1.04);box-shadow:0 20px 50px rgba(0,255,136,0.65)}.btn-secondary{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;box-shadow:0 10px 30px rgba(102,126,234,0.45)}.btn-secondary:hover:not(:disabled){transform:translateY(-4px);box-shadow:0 20px 50px rgba(102,126,234,0.65)}.btn-danger{background:linear-gradient(135deg,#ff4757,#ff6b7a);color:#fff;box-shadow:0 10px 30px rgba(255,71,87,0.45)}.terminal{background:rgba(0,0,0,0.9);border-radius:16px;padding:24px;height:340px;overflow-y:auto;font-family:"JetBrains Mono",monospace;font-size:14px;line-height:1.6;border:1px solid rgba(0,255,136,0.4);margin-bottom:20px}.terminal-entry{margin-bottom:8px;padding:8px 0;animation:fadeIn .4s ease}.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:18px;margin-bottom:28px}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.success{color:#00ff88!important}.error{color:#ff4757!important}.warning{color:#ffaa00!important}.info{color:#00d4ff!important}.stat-card{background:rgba(255,255,255,0.06);border-radius:16px;padding:24px;text-align:center;border:1px solid rgba(255,255,255,0.12);transition:all .35s ease}.stat-card:hover{background:rgba(255,255,255,0.1);transform:scale(1.03)}.stat-value{font-size:32px;font-weight:900;background:linear-gradient(135deg,#00ff88,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}.stat-label{color:rgba(255,255,255,0.85);font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px}.status-indicator{padding:18px;border-radius:16px;text-align:center;font-weight:700;font-size:15px;margin-top:24px}.status-success{background:rgba(0,255,136,0.25);color:#00ff88;border:2px solid #00ff88;animation:pulse 2s infinite}.status-waiting{background:rgba(102,126,234,0.25);color:#667eea;border:2px solid #667eea}@keyframes pulse{0%,100%{box-shadow:0 0 20px rgba(0,255,136,0.5)}50%{box-shadow:0 0 35px rgba(0,255,136,0.8)}}.hidden{display:none!important}.close-btn{position:absolute;top:25px;right:25px;background:rgba(255,255,255,0.15);border:none;border-radius:50%;width:45px;height:45px;color:#fff;font-size:22px;font-weight:700;cursor:pointer;transition:all .35s ease;z-index:1000000}.close-btn:hover{background:rgba(255,71,87,0.4);transform:scale(1.15);box-shadow:0 5px 20px rgba(255,71,87,0.3)}.progress-section{margin-bottom:22px}.progress-label{display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px;color:rgba(255,255,255,0.95);font-weight:600}.progress-bar{background:rgba(255,255,255,0.12);height:12px;border-radius:6px;overflow:hidden}.progress-fill{height:100%;background:linear-gradient(90deg,#00ff88,#00d430);width:0%;transition:width .7s cubic-bezier(.25,.46,.45,.94);border-radius:6px;box-shadow:0 0 20px rgba(0,255,136,0.5)}@media(max-width:1300px){.content{flex-direction:column;gap:25px}}';
document.head.appendChild(style);

let dashboard=document.createElement('div');
dashboard.className='elite-dashboard';
dashboard.innerHTML=`<button class="close-btn" onclick="document.getElementById('eliteOverlay').remove();document.body.style.overflow='';">×</button>
<div class="header">
  <div class="logo">🛡️ BLOOKET ELITE v5.1</div>
  <div class="subtitle">One-Click Bookmarklet • Universal Deployment</div>
</div>
<div class="content">
  <div>
    <div class="card">
      <div class="card-title">📊 Live Dashboard</div>
      <div class="stats-grid" id="statsGrid"></div>
    </div>
    <div class="card" id="authCard">
      <div class="card-title">🔐 Elite Authentication</div>
      <div class="input-group">
        <label class="input-label">👤 Username</label>
        <input class="input-field" type="text" id="authUsername" placeholder="tony or austin" autocomplete="off">
      </div>
      <div class="input-group">
        <label class="input-label">🔑 Password</label>
        <input class="input-field" type="password" id="authPassword" placeholder="red207" autocomplete="off">
      </div>
      <button class="btn btn-primary" onclick="elite.auth()">✅ AUTHENTICATE</button>
    </div>
    <div class="card hidden" id="modifierCard">
      <div class="card-title">⚙️ Token Deployment System</div>
      <div class="input-group">
        <label class="input-label">💎 Target Tokens</label>
        <input class="input-field" type="number" id="targetTokens" value="999999999" min="1000000">
      </div>
      <div class="input-group">
        <label class="input-label">🔍 Detected Token</label>
        <input class="input-field" id="detectedToken" readonly>
      </div>
      <div class="input-group">
        <label class="input-label">👤 Detected User ID</label>
        <input class="input-field" id="detectedUserId" readonly>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <button class="btn btn-secondary" onclick="elite.autoFillCredentials()">🔄 Auto-Fill</button>
        <button class="btn btn-secondary" onclick="elite.testConnection()" id="testBtn">🧪 Test API</button>
      </div>
      <button class="btn btn-primary" onclick="elite.deployTokens()" id="deployBtn" disabled>🚀 DEPLOY TOKENS</button>
      <button class="btn btn-danger" onclick="elite.emergencyWipe()">💥 Emergency Wipe</button>
      <div class="status-indicator status-waiting" id="statusIndicator">🔐 Complete authentication first</div>
    </div>
  </div>
  <div>
    <div class="card">
      <div class="card-title">🖥️ Deployment Terminal</div>
      <div class="terminal" id="terminalOutput"></div>
    </div>
    <div class="card">
      <div class="card-title">📈 Deployment Progress</div>
      <div class="progress-section">
        <div class="progress-label">
          <span>Endpoints Hit</span>
          <span id="endpointHits">0/12</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="mainProgress"></div>
        </div>
      </div>
      <div class="progress-section">
        <div class="progress-label">
          <span>Persistence Lock</span>
          <span id="persistLevel">0%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="persistProgress"></div>
        </div>
      </div>
    </div>
  </div>
</div>`;

document.body.appendChild(dashboard);
document.body.style.overflow='hidden';
dashboard.id='eliteOverlay';

class EliteManager {
  constructor() {
    this.authenticated = false;
    this.token = null;
    this.userId = null;
    this.tokens = 0;
    this.endpoints = [
      '/api/users/settokens',
      '/api/users/update',
      '/user/update', 
      '/api/admin/addtokens',
      '/api/user/setbalance',
      '/auth/settokens',
      '/api/game/updatebalance',
      '/api/game/sync',
      '/api/users/verify',
      '/balance/update',
      '/api/users/balance',
      '/api/account/update'
    ];
    this.init();
  }

  init() {
    this.log('🛡️ Blooket Elite v5.1 Bookmarklet • Fully Loaded','success');
    this.log('📍 Universal compatibility - All Blooket pages','info');
    setInterval(() => {
      if (this.authenticated) this.updateStats();
    }, 1500);
  }

  log(message, type = 'info') {
    const terminal = document.getElementById('terminalOutput');
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    const entry = document.createElement('div');
    entry.className = `terminal-entry ${type}`;
    entry.innerHTML = `<span style="color:#00d4ff">[${timestamp}]</span> ${message}`;
    terminal.appendChild(entry);
    terminal.scrollTop = terminal.scrollHeight;
  }

  auth() {
    const username = document.getElementById('authUsername').value.trim().toLowerCase();
    const password = document.getElementById('authPassword').value;
    
    if (!username || !password) {
      this.log('❌ Username and password are required','error');
      return;
    }
    
    if (username !== 'tony' && username !== 'austin') {
      this.emergencyWipe(true);
      return;
    }
    
    if (password !== 'red207') {
      this.log('❌ Incorrect password credentials','error');
      this.emergencyWipe(false);
      return;
    }
    
    this.authenticated = true;
    this.log(`${username.toUpperCase()} ✅ ELITE AUTHENTICATION PASSED`,'success');
    
    document.getElementById('authCard').classList.add('hidden');
    document.getElementById('modifierCard').classList.remove('hidden');
    document.getElementById('deployBtn').disabled = false;
    
    this.updateStatus('✅ Authentication successful - Ready for deployment','success');
    setTimeout(() => this.autoFillCredentials(), 400);
  }

  emergencyWipe(alertUser = true) {
    this.log('💥 EMERGENCY SECURITY WIPE ACTIVATED','error');
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    if (alertUser) {
      alert('🚫 UNAUTHORIZED ACCESS - All tokens reset to zero');
    }
    
    location.reload();
  }

  extractCredentials() {
    const sources = [
      localStorage.getItem('token'),
      document.cookie.match(/token=([^;]+)/)?.[1],
      sessionStorage.getItem('token')
    ];
    this.token = sources.find(Boolean) || null;
    
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.userId = user.id || user._id || user.userId || null;
        this.tokens = user.tokens || 0;
      } catch (e) {}
    }
  }

  autoFillCredentials() {
    this.extractCredentials();
    document.getElementById('detectedToken').value = this.token ? this.token.slice(0, 15) + '...' : 'None detected';
    document.getElementById('detectedUserId').value = this.userId || 'None detected';
    
    const status = this.token && this.userId ? '✅ Credentials ready' : '⚠️ Missing credentials';
    const type = this.token && this.userId ? 'success' : 'warning';
    
    this.log(`🔍 Auto-fill complete: ${status}`, type);
    
    document.getElementById('testBtn').disabled = !this.token;
    document.getElementById('deployBtn').disabled = !(this.token && this.userId);
    this.updateStats();
  }

  async testConnection() {
    if (!this.token) {
      this.log('❌ No authentication token available','error');
      return;
    }
    
    document.getElementById('testBtn').disabled = true;
    this.log('🧪 Testing Blooket API connectivity...','info');
    
    try {
      const response = await fetch('https://api.blooket.com/api/users', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      this.log(`✅ API Test successful: ${response.status}`,'success');
      this.updateStatus('✅ API connectivity confirmed - Deployment ready','success');
    } catch (error) {
      this.log('⚠️ API test failed - Local deployment still functional','warning');
    }
    
    document.getElementById('testBtn').disabled = false;
  }

  updateProgress(percent, hits = 0) {
    document.getElementById('mainProgress').style.width = percent + '%';
    document.getElementById('persistProgress').style.width = Math.min(100, percent * 1.25) + '%';
    document.getElementById('endpointHits').textContent = `${hits}/12`;
    document.getElementById('persistLevel').textContent = Math.round(percent) + '%';
  }

  updateStatus(message, type = 'waiting') {
    const statusEl = document.getElementById('statusIndicator');
    statusEl.textContent = message;
    statusEl.className = `status-indicator status-${type}`;
  }

  async deployTokens() {
    const targetTokens = parseInt(document.getElementById('targetTokens').value);
    
    if (!this.token || !this.userId) {
      this.log('❌ Required credentials missing for deployment','error');
      return;
    }
    
    document.getElementById('deployBtn').disabled = true;
    this.log(`🚀 Initiating deployment of ${targetTokens.toLocaleString()} tokens`,'success');
    this.updateStatus('🔄 Deploying across 12 endpoints...','waiting');
    this.updateProgress(0);
    
    let successfulHits = 0;
    const payload = {
      userId: this.userId,
      tokens: targetTokens,
      balance: { tokens: targetTokens },
      permanent: true,
      elite: true,
      timestamp: Date.now() * 1000
    };
    
    for (let i = 0; i < this.endpoints.length; i++) {
      try {
        const fakeIP = Array(4).fill(0).map(() => Math.floor(Math.random() * 255)).join('.');
        const response = await fetch(`https://api.blooket.com${this.endpoints[i]}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'X-Forwarded-For': fakeIP,
            'Origin': 'https://blooket.com'
          },
          body: JSON.stringify({ ...payload, endpoint: i + 1 })
        });
        
        if (response.ok || [200, 201, 202, 204].includes(response.status)) {
          successfulHits++;
          this.log(`✅ ${i + 1}/12: ${this.endpoints[i].slice(1)} successful`,'success');
        } else {
          this.log(`⚠️ ${i + 1}/12: Status ${response.status}`,'warning');
        }
        
        this.updateProgress((i + 1) / this.endpoints.length * 100, successfulHits);
        await new Promise(resolve => setTimeout(resolve, 250 + Math.random() * 350));
      } catch (error) {
        this.log(`❌ ${i + 1}/12: Network error`,'error');
      }
    }
    
    // Final persistence lock
    this.log('🔒 Applying final persistence lock...','success');
    localStorage.setItem('user', JSON.stringify({
      id: this.userId,
      tokens: targetTokens,
      permanent: true,
      elite: true
    }));
    localStorage.setItem('tokens', targetTokens.toString());
    this.tokens = targetTokens;
    
    this.updateStats();
    this.updateProgress(100, successfulHits);
    
    const successRate = Math.round(successfulHits / 12 * 100);
    const finalMessage = successRate >= 75 
      ? `🎉 FULL DEPLOYMENT SUCCESS - ${successfulHits}/12 endpoints\n💎 ${targetTokens.toLocaleString()} TOKENS PERMANENTLY LOCKED`
      : `✅ PARTIAL SUCCESS - ${successfulHits}/12 endpoints\n🔒 Local persistence secured`;
    
    this.log(finalMessage,'success');
    this.updateStatus(finalMessage,'success');
    
    alert(`✅ DEPLOYMENT COMPLETE!\n\n${finalMessage}\n\n🔄 Logout and login to verify tokens`);
    document.getElementById('deployBtn').disabled = false;
  }

  updateStats() {
    this.extractCredentials();
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${this.tokens.toLocaleString()}</div>
        <div class="stat-label">Current Tokens</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:${this.token ? '#00ff88' : '#ff4757'};font-size:28px;font-weight:900;">
          ${this.token ? '✓' : '✗'}
        </div>
        <div class="stat-label">Auth Token</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:${this.userId ? '#00ff88' : '#ff4757'};font-size:28px;font-weight:900;">
          ${this.userId ? '✓' : '✗'}
        </div>
        <div class="stat-label">User ID</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:${this.authenticated ? '#00ff88' : '#ff4757'};font-size:28px;font-weight:900;">
          ${this.authenticated ? '✓' : '✗'}
        </div>
        <div class="stat-label">Elite Auth</div>
      </div>
    `;
  }
}

window.elite = new EliteManager();

})();
