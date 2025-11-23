# X.com 10-Minute Timer Extension

A Firefox browser extension that automatically starts a 10-minute timer whenever you open a tab on x.com (Twitter). When the timer expires, you'll get an alarm notification with options to dismiss or snooze for another 10 minutes.

## Features

- ⏱️ Automatically starts a 10-minute countdown when you visit x.com
- 🔔 Plays an alarm sound when the timer expires
- 🪟 Shows a popup with "Dismiss" and "Snooze" options
- 🔄 Snooze adds another 10 minutes to the timer
- 🎨 Clean, modern UI with visual timer display

## Installation

### Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to the extension directory and select `manifest.json`

### Firefox (Permanent Installation)

To install permanently, you'll need to package and sign the extension:

1. Zip all files: `zip -r x-timer.zip manifest.json background.js popup.html popup.js popup.css icon.svg`
2. Submit to [Firefox Add-ons](https://addons.mozilla.org/developers/)

## Development

### File Structure

```
.
├── manifest.json       # Extension configuration
├── background.js       # Tab monitoring and timer logic
├── popup.html         # Timer UI structure
├── popup.js           # Timer UI logic
├── popup.css          # Styling
├── icon.svg           # Extension icon
└── README.md          # This file
```

### How It Works

1. **background.js** monitors tab creation and URL changes
2. When x.com is detected, a 10-minute timer starts
3. Timer state is stored per tab ID
4. When timer expires, alarm plays and popup notification appears
5. User can dismiss (closes timer) or snooze (adds 10 more minutes)

## Permissions

- `tabs` - Monitor tab creation and URL changes
- `storage` - Store timer state
- `notifications` - (Optional) Could be used for system notifications

## Customization

To change the timer duration, edit `background.js`:

```javascript
const TIMER_DURATION = 10 * 60 * 1000; // Change to desired milliseconds
```

## License

MIT
