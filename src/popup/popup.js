// Generate a simple beep tone using Web Audio API
function createAlarmTone() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 0.3;
    const frequency = 800;

    function beep(startTime) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    // Create repeating beep pattern
    let currentTime = audioContext.currentTime;
    for (let i = 0; i < 10; i++) {
        beep(currentTime + i * 0.5);
    }

    // Schedule next round
    setTimeout(() => {
        if (!document.hidden && alarmPlaying) {
            createAlarmTone();
        }
    }, 5000);
}

// Start alarm sound
let alarmPlaying = false;

function startAlarm() {
    if (!alarmPlaying) {
        alarmPlaying = true;
        createAlarmTone();
    }
}

function stopAlarm() {
    alarmPlaying = false;
}

// Start alarm on load
startAlarm();

// Handle dismiss button
document.getElementById("dismissBtn").addEventListener("click", () => {
    stopAlarm();
    browser.runtime.sendMessage({ action: "dismiss" }).then(() => {
        window.close();
    });
});

// Handle snooze button
document.getElementById("snoozeBtn").addEventListener("click", () => {
    stopAlarm();
    browser.runtime.sendMessage({ action: "snooze" }).then(() => {
        window.close();
    });
});
