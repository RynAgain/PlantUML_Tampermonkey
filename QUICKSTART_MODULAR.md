# PlantUML Helper - Quick Start Guide (Modular Version)

## 🚀 Quick Installation

### Option 1: Local Development (Current Setup)

1. **Install the main script** in Tampermonkey:
   - Open Tampermonkey dashboard
   - Click "+" to create new script
   - Copy contents of [`plantuml-helper-modular.user.js`](plantuml-helper-modular.user.js)
   - Save

2. **Verify file paths** match your system:
   ```javascript
   // Current paths in the script:
   // @require file://C:/Users/kryasatt/Documents/Source/PlantUML_Tampermonkey/JS/helpers.js
   // @require file://C:/Users/kryasatt/Documents/Source/PlantUML_Tampermonkey/JS/styles.js
   // @require file://C:/Users/kryasatt/Documents/Source/PlantUML_Tampermonkey/JS/data.js
   // @require file://C:/Users/kryasatt/Documents/Source/PlantUML_Tampermonkey/JS/visualEditor.js
   // @require file://C:/Users/kryasatt/Documents/Source/PlantUML_Tampermonkey/JS/ui.js
   ```

3. **Reload any webpage** - You should see the "📊 PlantUML Helper" button

### Option 2: GitHub Hosting (For Distribution)

1. **Update the main script** to use GitHub URLs:
   ```javascript
   // @require https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/JS/helpers.js
   // @require https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/JS/styles.js
   // @require https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/JS/data.js
   // @require https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/JS/visualEditor.js
   // @require https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/JS/ui.js
   ```

2. **Share the main script URL** with users:
   ```
   https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/plantuml-helper-modular.user.js
   ```

## 📂 File Structure

```
PlantUML_Tampermonkey/
├── plantuml-helper-modular.user.js    ← Install this in Tampermonkey
└── JS/
    ├── helpers.js                      ← Utility functions
    ├── styles.js                       ← CSS styles
    ├── data.js                         ← PlantUML reference data
    ├── visualEditor.js                 ← Visual diagram editor
    └── ui.js                           ← Main UI components
```

## ✅ Verification

After installation, open browser console (F12) and look for:

```
[PlantUML Helpers] Module loaded
[PlantUML Styles] Module loaded
[PlantUML Styles] Styles injected successfully
[PlantUML Data] Module loaded
[PlantUML Visual Editor] Module loaded
[PlantUML UI] Module loaded
[PlantUML UI] Initializing UI components
[PlantUML UI] UI initialization complete
PlantUML Helper (Modular) - Main script started
Module status: {helpers: true, data: true, editor: true, ui: true}
✓ All PlantUML Helper modules loaded successfully!
```

## 🎯 Usage

1. **Click the button** in the top-right corner: "📊 PlantUML Helper"
2. **Browse tabs**:
   - **✏️ Editor** - Visual drag-and-drop diagram builder
   - **Basics** - Basic PlantUML syntax
   - **Sequence** - Sequence diagram examples
   - **Class** - Class diagram examples
   - **UseCase** - Use case diagram examples
   - **Activity** - Activity diagram examples
   - **State** - State diagram examples
   - **Component** - Component diagram examples
   - **Style** - Styling and customization

3. **Use the visual editor**:
   - Click "+ Node", "+ Actor", etc. to add elements
   - Drag elements to position them
   - Click "🔗 Connect" then click two nodes to connect them
   - Click "⚡ Generate Code" to create PlantUML code
   - Click "📋 Copy" to copy the generated code

4. **Use the reference tabs**:
   - Browse syntax examples
   - Click "Copy Code" on any example
   - Paste into your PlantUML editor

## 🔧 Customization

### Changing Button Position

Edit [`JS/styles.js`](JS/styles.js) and modify:

```css
.plantuml-toggle-btn {
    position: fixed;
    top: 20px;        /* Change this */
    right: 20px;      /* Change this */
    /* ... */
}
```

### Adding New PlantUML Examples

Edit [`JS/data.js`](JS/data.js) and add to the appropriate category:

```javascript
window.PlantUMLData = {
    sequence: [
        // ... existing examples
        {
            title: "My New Example",
            code: "Alice -> Bob: Hello",
            description: "Description of the example"
        }
    ]
};
```

### Changing Colors/Theme

Edit [`JS/styles.js`](JS/styles.js) and modify color values:

```css
#plantuml-helper-panel {
    background: #2b2b2b;           /* Panel background */
    border: 2px solid #4a9eff;     /* Panel border */
    /* ... */
}

.plantuml-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* Header gradient */
    /* ... */
}
```

## 🐛 Troubleshooting

### Button doesn't appear

1. Check browser console for errors
2. Verify all file paths are correct
3. Ensure Tampermonkey is enabled
4. Check if script matches the page URL pattern (`*://*/*`)

### Modules not loading

1. Check file paths in `@require` directives
2. Verify all `.js` files exist in the `JS/` folder
3. Check browser console for specific error messages
4. Try refreshing the page

### Visual editor not working

1. Verify `visualEditor.js` loaded successfully
2. Check console for "[PlantUML Visual Editor] Module loaded"
3. Try clicking the "✏️ Editor" tab
4. Check for JavaScript errors in console

### Styles not applying

1. Verify `styles.js` loaded successfully
2. Check console for "[PlantUML Styles] Styles injected successfully"
3. Inspect element to see if styles are present
4. Check for CSS conflicts with page styles

## 📚 Documentation

- **[MODULAR_ARCHITECTURE.md](MODULAR_ARCHITECTURE.md)** - Detailed architecture documentation
- **[multi-tampermonkey-guide.md](multi-tampermonkey-guide.md)** - Guide for multi-file Tampermonkey scripts
- **[README.md](README.md)** - General project information

## 🆚 Modular vs Original

| Feature | Original | Modular |
|---------|----------|---------|
| File count | 1 file | 6 files |
| Lines of code | 1213 lines | ~200-400 per file |
| Maintainability | Difficult | Easy |
| Testability | Hard | Easy |
| Reusability | Low | High |
| Functionality | ✅ Same | ✅ Same |

## 💡 Tips

1. **Keep the original** [`plantuml-helper.user.js`](plantuml-helper.user.js) as a backup
2. **Test locally first** before deploying to GitHub
3. **Use version tags** on GitHub for stable releases
4. **Document changes** when modifying modules
5. **Check console logs** when debugging

## 🔄 Updating

### Local Development

1. Edit the module file(s) in [`JS/`](JS/)
2. Save changes
3. Reload the webpage
4. Changes take effect immediately

### GitHub Hosted

1. Edit and commit changes to GitHub
2. Users need to reload the page
3. Tampermonkey may cache files (clear cache if needed)
4. Consider using version numbers in URLs for cache busting

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Review the [MODULAR_ARCHITECTURE.md](MODULAR_ARCHITECTURE.md) documentation
3. Verify all file paths are correct
4. Ensure all modules are loading in the correct order

---

**Version**: 2.0.0  
**Type**: Modular Multi-File Architecture  
**Status**: ✅ Ready for use
