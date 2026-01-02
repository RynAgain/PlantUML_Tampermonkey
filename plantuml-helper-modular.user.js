// ==UserScript==
// @name         PlantUML Helper - Reference Guide & GUI Aid (Modular)
// @namespace    http://tampermonkey.net/
// @version      2.4.0
// @description  Comprehensive reference guide and visual GUI editor for PlantUML diagrams with syntax help, examples, and drag-and-drop diagram builder (Alexa Design Theme + Save/Load + Resizable)
// @author       RynAgain
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://github.com/RynAgain/PlantUML_Tampermonkey/raw/main/JS/helpers.js
// @require      https://github.com/RynAgain/PlantUML_Tampermonkey/raw/main/JS/styles.js
// @require      https://github.com/RynAgain/PlantUML_Tampermonkey/raw/main/JS/data.js
// @require      https://github.com/RynAgain/PlantUML_Tampermonkey/raw/main/JS/visualEditor.js
// @require      https://github.com/RynAgain/PlantUML_Tampermonkey/raw/main/JS/ui.js
// @updateURL    https://github.com/RynAgain/PlantUML_Tampermonkey/raw/main/plantuml-helper-modular.user.js
// @downloadURL  https://github.com/RynAgain/PlantUML_Tampermonkey/raw/main/plantuml-helper-modular.user.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('PlantUML Helper (Modular) - Main script started');
    console.log('Version: 2.4.0 - Alexa Design Theme + Save/Load + Resizable UI');

    // All modules are loaded via @require directives and self-initialize
    // The loading order is:
    // 1. helpers.js - Utility functions (escapeHtml, copyToClipboard, makeDraggable)
    // 2. styles.js - CSS injection
    // 3. data.js - PlantUML reference data
    // 4. visualEditor.js - Visual diagram editor
    // 5. ui.js - Main UI components (auto-initializes)

    // Verify all modules loaded
    const modulesLoaded = {
        helpers: typeof window.PlantUMLHelpers !== 'undefined',
        data: typeof window.PlantUMLData !== 'undefined',
        editor: typeof window.PlantUMLEditor !== 'undefined',
        ui: typeof window.PlantUMLUI !== 'undefined'
    };

    console.log('Module status:', modulesLoaded);

    // Check if all modules loaded successfully
    const allLoaded = Object.values(modulesLoaded).every(loaded => loaded);
    
    if (allLoaded) {
        console.log('✓ All PlantUML Helper modules loaded successfully!');
    } else {
        console.error('✗ Some PlantUML Helper modules failed to load:', modulesLoaded);
    }

    // The UI module auto-initializes, but we can also manually trigger it if needed
    // Uncomment the line below if you need to manually initialize:
    // if (window.PlantUMLUI && window.PlantUMLUI.initializeUI) {
    //     window.PlantUMLUI.initializeUI();
    // }

})();
