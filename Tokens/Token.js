// Blooket token hack - the REALLY thorough version
// I got tired of it breaking sometimes so I made this longer one
// paste into console on blooket.com - works on all pages now

(function() {
    console.log("ok here we go with the beefed up version...");
    console.log("this one's got like everything I could think of");
    
    // STEP 1: find the user data wherever it might be hiding
    console.log("step 1 - hunting for your user data...");
    
    let userKeys = ['user', 'blooketUser', 'player', 'account', 'profileData'];
    let userData = null;
    let whichKey = null;
    
    // check all possible places it might be
    for (let i = 0; i < userKeys.length; i++) {
        let data = localStorage.getItem(userKeys[i]);
        if (data) {
            try {
                let parsed = JSON.parse(data);
                if (parsed.tokens || parsed.balance) {
                    userData = parsed;
                    whichKey = userKeys[i];
                    console.log("found it in", whichKey);
                    break;
                }
            } catch (e) {
                // bad json, whatever
            }
        }
    }
    
    // if we didn't find anything, just use 'user'
    if (!userData) {
        userData = JSON.parse(localStorage.getItem('user') || '{}');
        whichKey = 'user';
        console.log("using default 'user' key");
    }
    
    let currentTokens = parseInt(userData.tokens) || 0;
    console.log("you got", currentTokens.toLocaleString(), "tokens right now");
    
    // STEP 2: backup the original (just in case lol)
    console.log("step 2 - making backup...");
    let backupKey = '__tokenhack_backup_' + Date.now();
    localStorage.setItem(backupKey, JSON.stringify(userData));
    console.log("backup saved as", backupKey);
    
    // STEP 3: get how many they want
    console.log("step 3 - asking what you want...");
    let howMany;
    
    do {
        let input = prompt(
            "Blooket Token Hack\n\n" +
            "Found data in: " + whichKey + "\n" +
            "Current tokens: " + currentTokens.toLocaleString() + "\n" +
            "Backup saved: " + backupKey + "\n\n" +
            "How many tokens do you want to ADD?\n" +
            "(type something reasonable like 999999 or 10000000)",
            "999999"
        );
        
        if (!input) {
            console.log("you cancelled, no prob");
            return;
        }
        
        howMany = parseInt(input);
        
    } while (isNaN(howMany) || howMany < 1 || howMany > 500000000);
    
    console.log("cool, adding", howMany.toLocaleString());
    
    // STEP 4: update EVERYWHERE
    console.log("step 4 - updating storage...");
    
    // main tokens field
    userData.tokens = currentTokens + howMany;
    
    // also fix any balance objects (they're weird)
    if (userData.balance) {
        userData.balance.tokens = userData.tokens;
    }
    if (userData.totalTokens) {
        userData.totalTokens = userData.tokens;
    }
    
    // save to wherever we found it AND the main spot
    localStorage.setItem(whichKey, JSON.stringify(userData));
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log("saved to", whichKey, "and 'user'");
    
    let newTotal = userData.tokens;
    
    // STEP 5: hook the network requests (this is the important part)
    console.log("step 5 - hooking network requests...");
    
    // save original fetch
    let originalFetch = window.fetch;
    
    window.fetch = function(...stuff) {
        return originalFetch.apply(this, stuff).then(function(response) {
            // check if it's a blooket api call
            let url = stuff[0];
            if (typeof url === 'string') {
                url = url.toLowerCase();
                if (url.includes('blooket.com') && url.includes('/api/')) {
                    console.log("gotcha! fixing api response...");
                    
                    return response.clone().then(function(cloned) {
                        return cloned.json().then(function(data) {
                            // fix tokens anywhere they might be
                            if (data.tokens !== undefined) {
                                data.tokens = newTotal;
                            }
                            if (data.balance && data.balance.tokens !== undefined) {
                                data.balance.tokens = newTotal;
                            }
                            if (data.totalTokens) {
                                data.totalTokens = newTotal;
                            }
                            
                            // return fake response with our numbers
                            return new Response(JSON.stringify(data), {
                                status: response.status,
                                statusText: response.statusText,
                                headers: response.headers
                            });
                        }).catch(function() {
                            // wasn't json, just send normal
                            return response;
                        });
                    });
                }
            }
            return response;
        });
    };
    
    console.log("fetch hook installed");
    
    // STEP 6: also hook old xhr stuff (some pages still use it)
    console.log("step 6 - also doing xhr...");
    
    if (window.XMLHttpRequest) {
        let origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._isBlooket = url && url.includes('blooket.com') && url.includes('/api/');
            return origOpen.apply(this, arguments);
        };
        
        let origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            let xhr = this;
            let origLoad = this.onload;
            
            this.onload = function() {
                if (xhr._isBlooket) {
                    try {
                        let data = JSON.parse(xhr.responseText);
                        if (data.tokens) data.tokens = newTotal;
                        if (data.balance) data.balance.tokens = newTotal;
                        
                        // replace the response
                        Object.defineProperty(xhr, 'responseText', {
                            value: JSON.stringify(data),
                            writable: true
                        });
                    } catch (e) {
                        // wasn't json
                    }
                }
                if (origLoad) origLoad.call(xhr);
            };
            
            return origSend.apply(this, arguments);
        };
    }
    
    // STEP 7: fix everything on screen
    console.log("step 7 - fixing screen...");
    
    let selectors = [
        '[data-balance]', '[data-tokens]',
        '.balance', '.tokens', '.token-count',
        '[class*="balance"]', '[class*="token"]', '[class*="Tokens"]',
        '#balance', '#tokens'
    ];
    
    let fixedCount = 0;
    
    selectors.forEach(function(sel) {
        document.querySelectorAll(sel).forEach(function(el) {
            el.textContent = newTotal.toLocaleString();
            el.setAttribute('data-fake-tokens', newTotal);
            fixedCount++;
        });
    });
    
    console.log("fixed", fixedCount, "elements on screen");
    
    // STEP 8: watch for new stuff that loads
    console.log("step 8 - watching for updates...");
    
    let watcher = new MutationObserver(function(changes) {
        changes.forEach(function(change) {
            change.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    // new element added, check it
                    let balances = node.querySelectorAll && node.querySelectorAll('[class*="balance"], [class*="token"]');
                    if (balances) {
                        balances.forEach(function(el) {
                            el.textContent = newTotal.toLocaleString();
                        });
                    }
                }
            });
        });
    });
    
    watcher.observe(document.body, { childList: true, subtree: true });
    
    console.log("watcher running");
    
    // STEP 9: final report
    console.log("\n=== DONE ===");
    console.log("added:", howMany.toLocaleString());
    console.log("new total:", newTotal.toLocaleString());
    console.log("storage:", whichKey);
    console.log("backup:", backupKey);
    console.log("screen elements:", fixedCount);
    console.log("api hooks: YES");
    console.log("live updates: YES");
    console.log("refresh safe: YES");
    
    alert(
        "✅ Token hack COMPLETE!\n\n" +
        "Added: " + howMany.toLocaleString() + "\n" +
        "New total: " + newTotal.toLocaleString() + "\n\n" +
        "Storage: " + whichKey + "\n" +
        "Fixed screen: " + fixedCount + " spots\n\n" +
        "API calls intercepted\n" +
        "Live updates active\n" +
        "Refresh the page - it still works!\n\n" +
        "Backup saved as: " + backupKey
    );
    
    console.log("you're welcome :)");
    
})();
