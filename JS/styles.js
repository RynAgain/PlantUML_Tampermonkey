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
                background: #3a3228;
                border: 2px solid #a67c52;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                z-index: 999999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #e8dcc8;
                display: none;
                flex-direction: column;
            }

            #plantuml-helper-panel.visible {
                display: flex;
            }

            .plantuml-header {
                background: linear-gradient(135deg, #8b6f47 0%, #6b5638 100%);
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
                border-bottom: 2px solid #5a4a3a;
                padding-bottom: 5px;
                overflow-x: auto;
                flex-wrap: wrap;
            }

            .plantuml-tab {
                padding: 6px 10px;
                background: #4a3f35;
                border: none;
                color: #c4b5a0;
                cursor: pointer;
                border-radius: 4px 4px 0 0;
                font-size: 11px;
                transition: all 0.2s;
                white-space: nowrap;
                flex-shrink: 0;
            }

            .plantuml-tab:hover {
                background: #5a4f45;
                color: #e8dcc8;
            }

            .plantuml-tab.active {
                background: #a67c52;
                color: #fff8e7;
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
                color: #d4a574;
                font-size: 14px;
                margin: 0 0 10px 0;
                padding-bottom: 5px;
                border-bottom: 1px solid #5a4a3a;
            }

            .plantuml-item {
                background: #4a3f35;
                padding: 10px;
                margin-bottom: 8px;
                border-radius: 4px;
                border-left: 3px solid #a67c52;
            }

            .plantuml-item-title {
                font-weight: 600;
                color: #d4a574;
                margin-bottom: 5px;
                font-size: 13px;
            }

            .plantuml-code {
                background: #2a2520;
                padding: 8px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                color: #c9b896;
                overflow-x: auto;
                white-space: pre;
                margin: 5px 0;
            }

            .plantuml-description {
                font-size: 11px;
                color: #b8a890;
                margin-top: 5px;
            }

            .plantuml-copy-btn {
                background: #a67c52;
                border: none;
                color: #fff8e7;
                padding: 4px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
                margin-top: 5px;
                transition: background 0.2s;
            }

            .plantuml-copy-btn:hover {
                background: #8b6f47;
            }

            .plantuml-toggle-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #8b6f47 0%, #6b5638 100%);
                border: 2px solid #a67c52;
                color: #fff8e7;
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
                background: #4a3f35;
                border: 1px solid #6b5638;
                border-radius: 4px;
                color: #e8dcc8;
                font-size: 12px;
            }

            .plantuml-search:focus {
                outline: none;
                border-color: #a67c52;
            }

            .plantuml-highlight {
                background-color: #d4a574;
                color: #2a2520;
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
                background: #4a3f35;
                border-radius: 4px;
            }

            .plantuml-editor-btn {
                padding: 5px 10px;
                background: #a67c52;
                border: none;
                color: #fff8e7;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: background 0.2s;
            }

            .plantuml-editor-btn:hover {
                background: #8b6f47;
            }

            .plantuml-editor-btn.secondary {
                background: #6b5638;
            }

            .plantuml-editor-btn.secondary:hover {
                background: #7a6547;
            }

            .plantuml-editor-btn.active {
                background: #6b8e23;
            }

            .plantuml-canvas-container {
                background: #2a2520;
                border: 2px solid #5a4a3a;
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
                background: #a67c52;
                color: #fff8e7;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: move;
                user-select: none;
                min-width: 80px;
                text-align: center;
                border: 2px solid #8b6f47;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            }

            .plantuml-node.actor {
                background: #9b7653;
                border-color: #7a5f42;
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
                background: #6b8e23;
                border-color: #556b1f;
                border-radius: 4px;
            }

            .plantuml-node.component {
                background: #cd853f;
                border-color: #a0652f;
            }

            .plantuml-node.database {
                background: #8b4513;
                border-color: #6b3410;
                border-radius: 4px 4px 15px 15px;
            }

            .plantuml-node.selected {
                border-color: #d4a574;
                box-shadow: 0 0 10px rgba(212, 165, 116, 0.5);
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
                background: #a0522d;
                color: #fff8e7;
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
                background: #2a2520;
                padding: 10px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                color: #c9b896;
                max-height: 150px;
                overflow-y: auto;
                white-space: pre;
            }

            .plantuml-editor-controls {
                display: flex;
                gap: 8px;
                align-items: center;
                padding: 8px;
                background: #4a3f35;
                border-radius: 4px;
                flex-wrap: wrap;
            }

            .plantuml-editor-label {
                color: #b8a890;
                font-size: 11px;
            }

            .plantuml-editor-select {
                padding: 4px 8px;
                background: #3a3228;
                border: 1px solid #6b5638;
                border-radius: 4px;
                color: #e8dcc8;
                font-size: 11px;
                cursor: pointer;
            }

            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #3a3228;
            }

            ::-webkit-scrollbar-thumb {
                background: #6b5638;
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #7a6547;
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
