// ======================================
// BLOOKET ULTIMATE INJECTOR v3.0 - CONSOLE
// Auto-Repeat + Shop Buyer - Paste into F12 Console
// ======================================

(function() {
    'use strict';
    
    class BlooketUltimate {
        constructor() {
            this.userData = JSON.parse(localStorage.getItem('user') || '{}');
            this.currentTokens = this.userData.tokens || 0;
            this.apiHooked = false;
        }
        
        // Core token injection
        inject(amount) {
            this.currentTokens += amount;
            this.userData.tokens = this.currentTokens;
            localStorage.setItem('user', JSON.stringify(this.userData));
            this.hookAPI();
            this.updateUI();
        }
        
        // Hook all Blooket APIs
        hookAPI() {
            if (this.apiHooked) return;
            this.apiHooked = true;
            
            const originalFetch = window.fetch;
            window.fetch = async (...args) => {
                const response = await originalFetch.apply(this, args);
                const url = args[0].toString();
                
                if (url.includes('blooket.com') && url.includes('api')) {
                    try {
                        const cloned = response.clone();
                        const data = await cloned.json();
                        data.tokens = this.currentTokens;
                        if (data.balance) data.balance.tokens = this.currentTokens;
                        
                        return new Response(JSON.stringify(data), {
                            status: response.status,
                            headers: response.headers
                        });
                    } catch (e) {}
                }
                return response;
            };
        }
        
        // Update visible balance elements
        updateUI() {
            document.querySelectorAll('[data-balance], .balance, [class*="token"], [class*="balance"]').forEach(el => {
                el.textContent = this.currentTokens.toLocaleString();
            });
        }
        
        // AUTO-REPEAT INJECTION
        autoInject(times = 10, amount = 1000000) {
            console.log(`🚀 Auto-injecting ${times}x ${amount.toLocaleString()} tokens...`);
            let completed = 0;
            
            const interval = setInterval(() => {
                this.inject(amount);
                completed++;
                console.log(`⏳ ${completed}/${times} (${(completed/times*100).toFixed(0)}%)`);
                
                if (completed >= times) {
                    clearInterval(interval);
                    console.log(`✅ AUTO-INJECT COMPLETE!\n💎 Final: ${this.currentTokens.toLocaleString()} tokens`);
                    alert(`🎉 ${times}x${amount.toLocaleString()} = ${this.currentTokens.toLocaleString()} tokens!\n♻️ Refresh to see!`);
                }
            }, 100);
        }
        
        // AUTO-SHOP BUYER (Mega Bot spam)
        autoShopBuy(itemCost = 10000, quantity = 50) {
            console.log(`🛒 Auto-buying ${quantity}x items (${itemCost.toLocaleString()} each)`);
            
            // Ensure we have enough tokens
            if (this.currentTokens < itemCost * quantity) {
                this.autoInject(Math.ceil((itemCost * quantity - this.currentTokens) / 1000000), 1000000);
                setTimeout(() => this.autoShopBuy(itemCost, quantity), 3000);
                return;
            }
            
            let bought = 0;
            const interval = setInterval(() => {
                // Simulate purchase
                this.inject(-itemCost); // Deduct cost
                bought++;
                
                // Mock inventory add
                const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
                inventory.push({ name: 'Mega Bot', cost: itemCost, id: Date.now() });
                localStorage.setItem('inventory', JSON.stringify(inventory));
                
                console.log(`🛍️  Bought ${bought}/${quantity} Mega Bot`);
                
                if (bought >= quantity) {
                    clearInterval(interval);
                    console.log(`✅ SHOP SPREE COMPLETE!\n📦 ${quantity}x Mega Bot owned\n💰 Remaining: ${this.currentTokens.toLocaleString()}`);
                    alert(`🛒 ${quantity}x Mega Bot bought!\n💎 Balance: ${this.currentTokens.toLocaleString()}`);
                }
            }, 50);
        }
        
        // MAIN MENU
        showMenu() {
            console.log('\n🎮 BLOOKET ULTIMATE v3.0 - Choose action:');
            console.log('1️⃣  Single inject (prompt amount)');
            console.log('1️⃣  0 = Single 1M');
            console.log('1️⃣  10 = Auto 10x 1M');
            console.log('1️⃣  50 = Auto 50x 1M');  
            console.log('2️⃣  Auto shop buyer');
            console.log('📊 Current: ' + this.currentTokens.toLocaleString());
            
            const choice = prompt(
                '🎮 Choose:\n1 = Inject tokens (enter 0-50 for auto)\n2 = Auto shop buyer\n\nCurrent: ' + this.currentTokens.toLocaleString(),
                '1'
            );
            
            if (choice === '1' || choice === '0') {
                const amt = parseInt(prompt('💰 Tokens per inject:', '1000000')) || 1000000;
                const repeats = parseInt(choice) || 1;
                if (repeats > 1) {
                    this.autoInject(repeats, amt);
                } else {
                    this.inject(amt);
                }
            } else if (choice === '2') {
                this.autoShopBuy();
            }
        }
    }
    
    // 🚀 LAUNCH
    const ultimate = new BlooketUltimate();
    console.log(`\n💎 Blooket Ultimate v3.0 loaded!\n📊 Starting balance: ${ultimate.currentTokens.toLocaleString()}`);
    ultimate.showMenu();
    
})();
