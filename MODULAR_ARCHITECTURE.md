# PlantUML Helper - Modular Architecture

This document explains the modular structure of the PlantUML Helper userscript and how to use it.

## 📁 Project Structure

```
PlantUML_Tampermonkey/
├── plantuml-helper.user.js              # Original monolithic script (kept for reference)
├── plantuml-helper-modular.user.js      # New modular main script
├── multi-tampermonkey-guide.md          # Guide for multi-file Tampermonkey scripts
├── MODULAR_ARCHITECTURE.md              # This file
└── JS/                                   # Module directory
    ├── helpers.js                        # Utility functions
    ├── styles.js                         # CSS styles
    ├── data.js                           # PlantUML reference data
    ├── visualEditor.js                   # Visual diagram editor
    └── ui.js                             # Main UI components
```

## 🏗️ Module Overview

### 1. **helpers.js** - Utility Functions
**Purpose**: Provides shared helper functions used across all modules.

**Exports**: `window.PlantUMLHelpers`
- `escapeHtml(text)` - Escape HTML special characters
- `unescapeHtml(html)` - Unescape HTML entities
- `copyToClipboard(text)` - Copy text to clipboard
- `makeDraggable(element, handle)` - Make an element draggable

**Dependencies**: None

---

### 2. **styles.js** - CSS Injection
**Purpose**: Injects all CSS styles for the application.

**Exports**: None (auto-executes)

**Dependencies**: None

**Features**:
- Injects styles only once (checks for existing style element)
- Includes all panel, button, editor, and node styles
- Custom scrollbar styling

---

### 3. **data.js** - PlantUML Reference Data
**Purpose**: Contains all PlantUML syntax examples and reference information.

**Exports**: `window.PlantUMLData`
- `basics` - Basic diagram structure, comments, titles
- `sequence` - Sequence diagram syntax
- `class` - Class diagram syntax
- `usecase` - Use case diagram syntax
- `activity` - Activity diagram syntax
- `state` - State diagram syntax
- `component` - Component diagram syntax
- `styling` - Styling and customization

**Dependencies**: None

---

### 4. **visualEditor.js** - Visual Diagram Editor
**Purpose**: Provides the drag-and-drop visual diagram builder.

**Exports**: `window.PlantUMLEditor`
- `createVisualEditorTab()` - Creates the editor tab HTML
- `initializeVisualEditor()` - Initializes editor event listeners
- `getEditorState()` - Returns current editor state

**Dependencies**: 
- `window.PlantUMLHelpers` (for copyToClipboard)

**Features**:
- Add nodes (actor, class, component, database)
- Drag nodes around canvas
- Connect nodes with arrows
- Generate PlantUML code from visual diagram
- Support for multiple diagram types (sequence, class, usecase, component)

---

### 5. **ui.js** - Main UI Components
**Purpose**: Creates and manages the main panel, tabs, and reference content.

**Exports**: `window.PlantUMLUI`
- `initializeUI()` - Initialize all UI components
- `togglePanel()` - Toggle panel visibility

**Dependencies**:
- `window.PlantUMLHelpers` (for escapeHtml, copyToClipboard, makeDraggable)
- `window.PlantUMLData` (for reference content)
- `window.PlantUMLEditor` (for visual editor tab)

**Features**:
- Creates toggle button
- Creates main panel with tabs
- Generates reference content from data
- Search functionality
- Copy code buttons
- Saves/loads panel state using GM_getValue/GM_setValue
- Auto-initializes on page load

---

## 🔄 Module Loading Order

The modules are loaded in this specific order via `@require` directives:

1. **helpers.js** - Must load first (provides utilities for other modules)
2. **styles.js** - Loads early (injects CSS before UI creation)
3. **data.js** - Loads before UI (provides data for content generation)
4. **visualEditor.js** - Loads before UI (provides editor tab)
5. **ui.js** - Loads last (uses all other modules, auto-initializes)

## 🚀 Installation & Usage

### Local Development (file:// URLs)

The current main script uses `file://` URLs for local development:

```javascript
// @require file://C:/Users/kryasatt/Documents/Source/PlantUML_Tampermonkey/JS/helpers.js
// @require file://C:/Users/kryasatt/Documents/Source/PlantUML_Tampermonkey/JS/styles.js
// @require file://C:/Users/kryasatt/Documents/Source/PlantUML_Tampermonkey/JS/data.js
// @require file://C:/Users/kryasatt/Documents/Source/PlantUML_Tampermonkey/JS/visualEditor.js
// @require file://C:/Users/kryasatt/Documents/Source/PlantUML_Tampermonkey/JS/ui.js
```

**To use locally:**
1. Install [`plantuml-helper-modular.user.js`](plantuml-helper-modular.user.js) in Tampermonkey
2. Ensure the file paths match your local directory structure
3. Reload any webpage to see the PlantUML Helper button

### GitHub Hosting (for distribution)

To host on GitHub for easy distribution:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Modularize PlantUML Helper"
   git push origin main
   ```

2. **Update @require URLs** in [`plantuml-helper-modular.user.js`](plantuml-helper-modular.user.js):
   ```javascript
   // @require https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/JS/helpers.js
   // @require https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/JS/styles.js
   // @require https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/JS/data.js
   // @require https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/JS/visualEditor.js
   // @require https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/JS/ui.js
   ```

3. **Add update URLs**:
   ```javascript
   // @updateURL    https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/plantuml-helper-modular.user.js
   // @downloadURL  https://github.com/YOUR_USERNAME/PlantUML_Tampermonkey/raw/main/plantuml-helper-modular.user.js
   ```

## 🔧 Modifying the Script

### Adding New Features

**To add a new feature to an existing module:**

1. Edit the appropriate module file in [`JS/`](JS/)
2. Add your function/feature
3. Export it via the global namespace if needed
4. Reload the page to test

**To create a new module:**

1. Create a new file in [`JS/`](JS/) (e.g., `newFeature.js`)
2. Wrap in IIFE: `(function() { 'use strict'; ... })();`
3. Export via global namespace: `window.PlantUMLNewFeature = { ... };`
4. Add `@require` directive to [`plantuml-helper-modular.user.js`](plantuml-helper-modular.user.js)
5. Ensure proper loading order (dependencies load first)

### Example: Adding a New Helper Function

**In [`JS/helpers.js`](JS/helpers.js:1):**
```javascript
function myNewHelper(param) {
    // Your code here
    return result;
}

// Add to exports
window.PlantUMLHelpers = {
    escapeHtml: escapeHtml,
    unescapeHtml: unescapeHtml,
    copyToClipboard: copyToClipboard,
    makeDraggable: makeDraggable,
    myNewHelper: myNewHelper  // Add here
};
```

**Use in other modules:**
```javascript
if (window.PlantUMLHelpers && window.PlantUMLHelpers.myNewHelper) {
    window.PlantUMLHelpers.myNewHelper(someParam);
}
```

## 🐛 Debugging

### Check Module Loading

Open browser console and look for:
```
[PlantUML Helpers] Module loaded
[PlantUML Styles] Module loaded
[PlantUML Data] Module loaded
[PlantUML Visual Editor] Module loaded
[PlantUML UI] Module loaded
PlantUML Helper (Modular) - Main script started
Module status: {helpers: true, data: true, editor: true, ui: true}
✓ All PlantUML Helper modules loaded successfully!
```

### Common Issues

**Module not loading:**
- Check file paths in `@require` directives
- Verify file exists and has correct extension (.js)
- Check browser console for errors

**Functions not available:**
- Verify module exports to global namespace
- Check loading order (dependencies must load first)
- Ensure function is called after module loads

**Styles not applying:**
- Check if styles.js loaded successfully
- Verify no CSS conflicts with page styles
- Check z-index values for overlays

## 📊 Benefits of Modular Architecture

### ✅ Advantages

1. **Maintainability**: Each module has a single responsibility
2. **Reusability**: Modules can be used in other projects
3. **Testability**: Individual modules can be tested in isolation
4. **Collaboration**: Multiple developers can work on different modules
5. **Debugging**: Easier to locate and fix issues
6. **Organization**: Clear structure and separation of concerns
7. **Updates**: Update individual modules without touching others

### 📈 Comparison

| Aspect | Monolithic | Modular |
|--------|-----------|---------|
| File size | 1 large file (1213 lines) | 5 smaller files (avg 200-400 lines) |
| Maintainability | Difficult | Easy |
| Testing | Hard to isolate | Easy to test individually |
| Reusability | Low | High |
| Collaboration | Merge conflicts | Parallel development |
| Loading | All at once | Sequential, cacheable |

## 🔍 Module Communication

Modules communicate through:

1. **Global namespace**: `window.PlantUMLHelpers`, `window.PlantUMLData`, etc.
2. **DOM elements**: Shared elements with IDs
3. **Event listeners**: Standard DOM events
4. **Function calls**: Direct function invocation via global namespace

### Example Communication Flow

```
User clicks "Generate Code" button
    ↓
visualEditor.js generates code
    ↓
Calls window.PlantUMLHelpers.copyToClipboard()
    ↓
helpers.js copies to clipboard
    ↓
UI updates button text to "✓ Copied!"
```

## 📝 Best Practices

1. **Always use IIFE wrapper** to avoid global scope pollution
2. **Export only what's needed** via global namespace
3. **Check dependencies exist** before using them
4. **Add console.log statements** for debugging
5. **Document your functions** with JSDoc comments
6. **Use meaningful names** for functions and variables
7. **Keep modules focused** on single responsibility
8. **Test after changes** to ensure nothing breaks

## 🎯 Next Steps

1. **Test the modular version** thoroughly
2. **Update documentation** as needed
3. **Consider hosting on GitHub** for easy distribution
4. **Add version tags** for stable releases
5. **Create tests** for individual modules
6. **Gather feedback** from users

## 📚 Additional Resources

- [Multi-Tampermonkey Guide](multi-tampermonkey-guide.md) - Comprehensive guide on multi-file architecture
- [Tampermonkey Documentation](https://www.tampermonkey.net/documentation.php)
- [PlantUML Documentation](https://plantuml.com/)

---

**Version**: 2.0.0  
**Last Updated**: 2025-12-30  
**Architecture**: Modular Multi-File
