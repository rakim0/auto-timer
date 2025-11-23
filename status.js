function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function updateBars(progress) {
    const bars = document.querySelectorAll(".bar");
    const activeBars = Math.ceil((progress / 100) * 5);

    bars.forEach((bar, index) => {
        if (index < activeBars) {
            bar.classList.add("active");
        } else {
            bar.classList.remove("active");
        }
    });
}

function updateTimerDisplay() {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs.length === 0) return;

        const currentTab = tabs[0];
        const url = currentTab.url;

        // Check if current tab is x.com
        const isXcom = url && url.includes("x.com");

        if (!isXcom) {
            document.getElementById("timerDisplay").textContent = "--:--";
            updateBars(0);
            return;
        }

        // Request timer info from background script
        browser.runtime
            .sendMessage({
                action: "getTimerStatus",
                tabId: currentTab.id,
            })
            .then((response) => {
                if (response && response.active) {
                    const elapsed = Date.now() - response.startTime;
                    const remaining = TIMER_DURATION - elapsed;
                    const progress = (elapsed / TIMER_DURATION) * 100;

                    if (remaining > 0) {
                        document.getElementById("timerDisplay").textContent =
                            formatTime(elapsed);
                        updateBars(Math.min(progress, 100));
                    } else {
                        document.getElementById("timerDisplay").textContent = "10:00";
                        updateBars(100);
                    }
                } else {
                    document.getElementById("timerDisplay").textContent = "0:00";
                    updateBars(0);
                }
            });
    });
}

// Update display on load
updateTimerDisplay();

// Update every second
setInterval(updateTimerDisplay, 1000);
