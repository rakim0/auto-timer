# X.com 10-Minute Timer Extension

A minimalist Firefox browser extension that automatically starts a 10-minute timer whenever you open x.com (Twitter). Features a clean terminal-style UI with green text on black background and animated progress bars.

## Features

-   ⏱️ **Auto-start timer** - Automatically begins countdown when visiting x.com
-   🔔 **Alarm notification** - Plays sound and shows popup when timer expires
-   🎯 **Minimalist UI** - Terminal-style green-on-black interface
-   📊 **Visual progress** - 5 animated bars showing elapsed time
-   🔄 **Snooze option** - Add another 10 minutes with one click
-   ⚙️ **Easy customization** - Change timer duration in one central file

## Installation

### Firefox (Temporary)

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file from this directory

### Firefox (Permanent)

For permanent installation, package and sign the extension:

```fish
cd /Users/rakim/Programming-Stuff/my-repos/10minTimer
zip -r x-timer.zip manifest.json src/ assets/
```

Then submit to [Firefox Add-ons](https://addons.mozilla.org/developers/)

## Usage

1. **Install the extension** following the instructions above
2. **Visit x.com** - Timer starts automatically
3. **Click the extension icon** - View elapsed time and progress bars
4. **When timer expires** - Dismiss or snooze for 10 more minutes

## File Structure

```
10minTimer/
├── manifest.json              # Extension configuration
├── src/
│   ├── constants.js          # Timer duration configuration
│   ├── background/
│   │   └── background.js     # Timer logic and tab monitoring
│   ├── popup/
│   │   ├── popup.html        # Alarm popup structure
│   │   ├── popup.js          # Alarm popup behavior
│   │   └── popup.css         # Alarm popup styling
│   └── status/
│       ├── status.html       # Status display structure
│       ├── status.js         # Status display logic
│       └── status.css        # Minimalist terminal styling
├── assets/
│   └── icon.svg              # Extension icon
└── README.md                 # This file
```

## Customization

### Change Timer Duration

Edit `src/constants.js`:

```javascript
const TIMER_DURATION = 10 * 60 * 1000; // Change 10 to desired minutes
```

Examples:

-   **5 minutes**: `5 * 60 * 1000`
-   **15 minutes**: `15 * 60 * 1000`
-   **30 minutes**: `30 * 60 * 1000`

### Modify UI Colors

Edit `src/status/status.css` to change the color scheme:

```css
body {
    background: #000; /* Background color */
    color: #0f0; /* Text color */
}

.bar {
    background: #0f0; /* Progress bar color */
}
```

## How It Works

1. **Background Script** (`src/background/background.js`)

    - Monitors tab creation and URL changes
    - Detects when x.com is opened
    - Creates alarms for 10-minute intervals
    - Manages timer state per tab

2. **Status Display** (`src/status/`)

    - Shows when clicking extension icon
    - Displays elapsed time in MM:SS format
    - Animates 5 progress bars (20% each)
    - Updates every second

3. **Alarm Popup** (`src/popup/`)
    - Opens in new window when timer expires
    - Plays audio alarm
    - Offers "Dismiss" or "Snooze (10 min)" options

## Permissions

-   **tabs** - Monitor tab creation and URL changes
-   **alarms** - Create timer alarms
-   **storage** - Store timer state
-   **notifications** - (Reserved for future features)

## Browser Compatibility

-   **Firefox**: 57.0+
-   **Chrome/Edge**: Not yet supported (uses Firefox WebExtensions API)

## Development

To modify and test:

1. Make changes to files in `src/`
2. Reload extension in `about:debugging`
3. Test on x.com

No build process required - pure JavaScript/CSS/HTML.

## License

MIT
