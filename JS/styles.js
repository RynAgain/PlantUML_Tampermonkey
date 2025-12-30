// PlantUML Helper - Styles Module
// This module injects all CSS styles for the application

(function() {
    'use strict';

    console.log('[PlantUML Styles] Module loaded');

    // Inject styles immediately
    injectStyles();

    /**
     * Inject all CSS styles into the document head
     */
    function injectStyles() {
        // Check if styles already injected
        if (document.getElementById('plantuml-helper-styles')) {
            console.log('[PlantUML Styles] Styles already injected');
            return;
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'plantuml-helper-styles';
        styleElement.textContent = `
            #plantuml-helper-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 450px;
                max-height: 85vh;
                background: #2b2b2b;
                border: 2px solid #4a9eff;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                z-index: 999999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #e0e0e0;
                display: none;
                flex-direction: column;
            }

            #plantuml-helper-panel.visible {
                display: flex;
            }

            .plantuml-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 12px 15px;
                border-radius: 6px 6px 0 0;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            }

            .plantuml-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: white;
            }

            .plantuml-close-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 18px;
                line-height: 1;
                transition: background 0.2s;
            }

            .plantuml-close-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            .plantuml-content {
                padding: 15px;
                overflow-y: auto;
                max-height: calc(85vh - 100px);
            }

            .plantuml-tabs {
                display: flex;
                gap: 5px;
                margin-bottom: 15px;
                border-bottom: 2px solid #444;
                padding-bottom: 5px;
                overflow-x: auto;
                flex-wrap: wrap;
            }

            .plantuml-tab {
                padding: 6px 10px;
                background: #3a3a3a;
                border: none;
                color: #b0b0b0;
                cursor: pointer;
                border-radius: 4px 4px 0 0;
                font-size: 11px;
                transition: all 0.2s;
                white-space: nowrap;
                flex-shrink: 0;
            }

            .plantuml-tab:hover {
                background: #4a4a4a;
                color: #e0e0e0;
            }

            .plantuml-tab.active {
                background: #4a9eff;
                color: white;
                font-weight: 600;
            }

            .plantuml-tab-content {
                display: none;
            }

            .plantuml-tab-content.active {
                display: block;
            }

            .plantuml-section {
                margin-bottom: 20px;
            }

            .plantuml-section h4 {
                color: #4a9eff;
                font-size: 14px;
                margin: 0 0 10px 0;
                padding-bottom: 5px;
                border-bottom: 1px solid #444;
            }

            .plantuml-item {
                background: #3a3a3a;
                padding: 10px;
                margin-bottom: 8px;
                border-radius: 4px;
                border-left: 3px solid #4a9eff;
            }

            .plantuml-item-title {
                font-weight: 600;
                color: #4a9eff;
                margin-bottom: 5px;
                font-size: 13px;
            }

            .plantuml-code {
                background: #1e1e1e;
                padding: 8px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                color: #9cdcfe;
                overflow-x: auto;
                white-space: pre;
                margin: 5px 0;
            }

            .plantuml-description {
                font-size: 11px;
                color: #b0b0b0;
                margin-top: 5px;
            }

            .plantuml-copy-btn {
                background: #4a9eff;
                border: none;
                color: white;
                padding: 4px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
                margin-top: 5px;
                transition: background 0.2s;
            }

            .plantuml-copy-btn:hover {
                background: #3a8eef;
            }

            .plantuml-toggle-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: 2px solid #4a9eff;
                color: white;
                padding: 10px 15px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                z-index: 999998;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                transition: transform 0.2s;
            }

            .plantuml-toggle-btn:hover {
                transform: scale(1.05);
            }

            .plantuml-search {
                width: 100%;
                padding: 8px;
                margin-bottom: 15px;
                background: #3a3a3a;
                border: 1px solid #555;
                border-radius: 4px;
                color: #e0e0e0;
                font-size: 12px;
            }

            .plantuml-search:focus {
                outline: none;
                border-color: #4a9eff;
            }

            .plantuml-highlight {
                background-color: #ffd700;
                color: #000;
                padding: 2px 4px;
                border-radius: 2px;
            }

            /* Visual Editor Styles */
            .plantuml-editor-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .plantuml-editor-toolbar {
                display: flex;
                gap: 5px;
                flex-wrap: wrap;
                padding: 8px;
                background: #3a3a3a;
                border-radius: 4px;
            }

            .plantuml-editor-btn {
                padding: 5px 10px;
                background: #4a9eff;
                border: none;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: background 0.2s;
            }

            .plantuml-editor-btn:hover {
                background: #3a8eef;
            }

            .plantuml-editor-btn.secondary {
                background: #666;
            }

            .plantuml-editor-btn.secondary:hover {
                background: #777;
            }

            .plantuml-editor-btn.active {
                background: #27ae60;
            }

            .plantuml-canvas-container {
                background: #1e1e1e;
                border: 2px solid #444;
                border-radius: 4px;
                min-height: 250px;
                position: relative;
                overflow: auto;
            }

            .plantuml-canvas {
                width: 100%;
                min-height: 250px;
                position: relative;
            }

            .plantuml-node {
                position: absolute;
                background: #4a9eff;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: move;
                user-select: none;
                min-width: 80px;
                text-align: center;
                border: 2px solid #3a8eef;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            }

            .plantuml-node.actor {
                background: #9b59b6;
                border-color: #8e44ad;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 5px;
                min-width: 50px;
            }

            .plantuml-node.class {
                background: #27ae60;
                border-color: #229954;
                border-radius: 4px;
            }

            .plantuml-node.component {
                background: #e67e22;
                border-color: #d35400;
            }

            .plantuml-node.database {
                background: #c0392b;
                border-color: #a93226;
                border-radius: 4px 4px 15px 15px;
            }

            .plantuml-node.selected {
                border-color: #ffd700;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }

            .plantuml-node-label {
                font-size: 11px;
                font-weight: 600;
                word-wrap: break-word;
            }

            .plantuml-node-delete {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #e74c3c;
                color: white;
                border: none;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                cursor: pointer;
                font-size: 11px;
                line-height: 1;
                display: none;
            }

            .plantuml-node:hover .plantuml-node-delete {
                display: block;
            }

            .plantuml-connection {
                position: absolute;
                pointer-events: none;
            }

            .plantuml-output-code {
                background: #1e1e1e;
                padding: 10px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                color: #9cdcfe;
                max-height: 150px;
                overflow-y: auto;
                white-space: pre;
            }

            .plantuml-editor-controls {
                display: flex;
                gap: 8px;
                align-items: center;
                padding: 8px;
                background: #3a3a3a;
                border-radius: 4px;
                flex-wrap: wrap;
            }

            .plantuml-editor-label {
                color: #b0b0b0;
                font-size: 11px;
            }

            .plantuml-editor-select {
                padding: 4px 8px;
                background: #2b2b2b;
                border: 1px solid #555;
                border-radius: 4px;
                color: #e0e0e0;
                font-size: 11px;
                cursor: pointer;
            }

            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #2b2b2b;
            }

            ::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #666;
            }
        `;

        document.head.appendChild(styleElement);
        console.log('[PlantUML Styles] Styles injected successfully');
    }

    // Export for testing
    try {
        module.exports = { injectStyles };
    } catch (e) {
        // Browser environment
    }
})();
