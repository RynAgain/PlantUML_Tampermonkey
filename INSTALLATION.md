# PlantUML Helper - Installation Guide

## Prerequisites

1. **Browser**: Chrome, Firefox, Edge, or any modern browser
2. **Tampermonkey Extension**: Install from:
   - Chrome: [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - Edge: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

## Installation Steps

### Method 1: Direct Installation

1. **Install Tampermonkey** in your browser (see links above)
2. **Open the script file**:
   - Click on [`plantuml-helper.user.js`](plantuml-helper.user.js)
3. **Install the script**:
   - Tampermonkey should automatically detect it and show an installation page
   - Click "Install" to add the script
4. **Verify installation**:
   - Navigate to any webpage
   - You should see a "📊 PlantUML Helper" button in the top-right corner

### Method 2: Manual Installation

1. **Install Tampermonkey** in your browser
2. **Open Tampermonkey Dashboard**:
   - Click the Tampermonkey icon in your browser toolbar
   - Select "Dashboard"
3. **Create new script**:
   - Click the "+" tab or "Create a new script"
4. **Copy the script**:
   - Open [`plantuml-helper.user.js`](plantuml-helper.user.js)
   - Copy all the content
   - Paste it into the Tampermonkey editor
5. **Save**:
   - Press `Ctrl+S` (or `Cmd+S` on Mac)
   - Or click File → Save
6. **Verify**:
   - Navigate to any webpage
   - Look for the "📊 PlantUML Helper" button

## Configuration

### Enabling/Disabling the Script

1. Click the Tampermonkey icon in your browser
2. Toggle the switch next to "PlantUML Helper"

### Script Permissions

The script requires:
- `@match *://*/*` - Works on all websites
- `GM_addStyle` - Adds custom styling
- `GM_getValue` / `GM_setValue` - Saves panel state

### Updating the Script

Tampermonkey will automatically check for updates if you installed from a URL. For manual installations:

1. Open Tampermonkey Dashboard
2. Find "PlantUML Helper"
3. Click "Edit"
4. Replace the content with the new version
5. Save

## Troubleshooting

### Button Not Appearing

1. **Check if Tampermonkey is enabled**:
   - Click the Tampermonkey icon
   - Ensure it's not disabled
2. **Check if script is enabled**:
   - Open Tampermonkey Dashboard
   - Verify "PlantUML Helper" has a green indicator
3. **Refresh the page**:
   - Press `F5` or `Ctrl+R`
4. **Check browser console**:
   - Press `F12` to open Developer Tools
   - Look for any error messages

### Panel Not Opening

1. **Clear browser cache**:
   - Press `Ctrl+Shift+Delete`
   - Clear cached data
2. **Check for conflicts**:
   - Disable other userscripts temporarily
   - Test if the panel opens
3. **Reinstall the script**:
   - Remove the script from Tampermonkey
   - Reinstall following the steps above

### Visual Editor Not Working

1. **Ensure you're on the Editor tab**:
   - Click "✏️ Editor" tab at the top
2. **Check browser compatibility**:
   - Use a modern browser (Chrome 90+, Firefox 88+, Edge 90+)
3. **Try clearing the canvas**:
   - Click "🗑️ Clear" button
   - Add nodes again

## Uninstallation

1. Open Tampermonkey Dashboard
2. Find "PlantUML Helper"
3. Click the trash icon or "Remove"
4. Confirm deletion

## Support

For issues or questions:
- Check the [README.md](README.md) for usage instructions
- Review the [USAGE.md](USAGE.md) for detailed features
- Open an issue on the project repository
