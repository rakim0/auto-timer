// Track active timers per tab
const activeTimers = new Map();

// Check if URL is x.com
function isXcomUrl(url) {
    if (!url) return false;
    try {
        const urlObj = new URL(url);
        return urlObj.hostname === "x.com" || urlObj.hostname === "www.x.com";
    } catch (e) {
        return false;
    }
}

// Start timer for a tab
function startTimer(tabId, url) {
    // Don't start if already running
    if (activeTimers.has(tabId)) {
        console.log(`Timer already running for tab ${tabId}`);
        return;
    }

    console.log(`Starting 10-minute timer for tab ${tabId}`);

    const alarmName = `timer_${tabId}`;
    const startTime = Date.now();
    const endTime = startTime + TIMER_DURATION;

    // Store timer info
    activeTimers.set(tabId, {
        alarmName,
        startTime,
        endTime,
        url,
    });

    // Create alarm
    browser.alarms.create(alarmName, {
        when: endTime,
    });
}

// Stop timer for a tab
function stopTimer(tabId) {
    const timer = activeTimers.get(tabId);
    if (timer) {
        console.log(`Stopping timer for tab ${tabId}`);
        browser.alarms.clear(timer.alarmName);
        activeTimers.delete(tabId);
    }
}

// Show notification popup when timer expires
function showTimerNotification(tabId) {
    // Store the tab ID for the popup to access
    browser.storage.local
        .set({
            expiredTabId: tabId,
            timerExpired: true,
        })
        .then(() => {
            // Open the popup window
            browser.windows.create({
                url: "popup.html",
                type: "popup",
                width: 400,
                height: 300,
            });
        });
}

// Listen for alarm events
browser.alarms.onAlarm.addListener((alarm) => {
    console.log("Alarm triggered:", alarm.name);

    // Find tab ID from alarm name
    for (const [tabId, timer] of activeTimers.entries()) {
        if (timer.alarmName === alarm.name) {
            console.log(`Timer expired for tab ${tabId}`);
            showTimerNotification(tabId);
            activeTimers.delete(tabId);
            break;
        }
    }
});

// Listen for tab updates (URL changes, page loads)
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url || changeInfo.status === "complete") {
        const url = changeInfo.url || tab.url;

        if (isXcomUrl(url)) {
            // Start timer when x.com is loaded
            startTimer(tabId, url);
        } else if (activeTimers.has(tabId)) {
            // Stop timer if navigated away from x.com
            stopTimer(tabId);
        }
    }
});

// Listen for tab removal
browser.tabs.onRemoved.addListener((tabId) => {
    stopTimer(tabId);
});

// Listen for messages from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "dismiss") {
        // Just close the notification, timer is already removed
        browser.storage.local.remove(["expiredTabId", "timerExpired"]);
        sendResponse({ success: true });
    } else if (message.action === "snooze") {
        // Restart timer for the tab
        browser.storage.local.get(["expiredTabId"]).then((result) => {
            const tabId = result.expiredTabId;
            if (tabId) {
                browser.tabs
                    .get(tabId)
                    .then((tab) => {
                        if (isXcomUrl(tab.url)) {
                            startTimer(tabId, tab.url);
                        }
                    })
                    .catch((err) => {
                        console.error("Tab no longer exists:", err);
                    });
            }
            browser.storage.local.remove(["expiredTabId", "timerExpired"]);
            sendResponse({ success: true });
        });
        return true; // Keep message channel open for async response
    } else if (message.action === "getTimerStatus") {
        // Return timer status for the requested tab
        const timer = activeTimers.get(message.tabId);
        if (timer) {
            sendResponse({
                active: true,
                startTime: timer.startTime,
                endTime: timer.endTime,
            });
        } else {
            sendResponse({ active: false });
        }
    }
});

// Check existing tabs on extension load
browser.tabs.query({}).then((tabs) => {
    tabs.forEach((tab) => {
        if (isXcomUrl(tab.url)) {
            startTimer(tab.id, tab.url);
        }
    });
});
