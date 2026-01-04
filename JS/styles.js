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
                min-width: 300px;
                max-width: 90vw;
                height: 600px;
                min-height: 400px;
                max-height: 85vh;
                background: #232F3E;
                border: 2px solid #35485E;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                z-index: 999999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #FAFAFA;
                display: none;
                flex-direction: column;
                resize: both;
                overflow: hidden;
            }

            #plantuml-helper-panel.visible {
                display: flex;
            }

            .plantuml-header {
                background: linear-gradient(135deg, #35485E 0%, #232F3E 100%);
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
                flex: 1;
                min-height: 0;
            }

            #plantuml-helper-panel::after {
                content: '⋰';
                position: absolute;
                bottom: 2px;
                right: 2px;
                font-size: 16px;
                color: #35485E;
                pointer-events: none;
                line-height: 1;
            }

            .plantuml-tabs {
                display: flex;
                gap: 5px;
                margin-bottom: 15px;
                border-bottom: 2px solid #35485E;
                padding-bottom: 5px;
                overflow-x: auto;
                flex-wrap: wrap;
            }

            .plantuml-tab {
                padding: 6px 10px;
                background: #1E2222;
                border: none;
                color: #DADADA;
                cursor: pointer;
                border-radius: 4px 4px 0 0;
                font-size: 11px;
                transition: all 0.2s;
                white-space: nowrap;
                flex-shrink: 0;
            }

            .plantuml-tab:hover {
                background: #35485E;
                color: #FAFAFA;
            }

            .plantuml-tab.active {
                background: #35485E;
                color: #FFFFFF;
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
                color: #FAFAFA;
                font-size: 14px;
                margin: 0 0 10px 0;
                padding-bottom: 5px;
                border-bottom: 1px solid #35485E;
            }

            .plantuml-item {
                background: #1E2222;
                padding: 10px;
                margin-bottom: 8px;
                border-radius: 4px;
                border-left: 3px solid #35485E;
            }

            .plantuml-item-title {
                font-weight: 600;
                color: #FAFAFA;
                margin-bottom: 5px;
                font-size: 13px;
            }

            .plantuml-code {
                background: #0F0F0F;
                padding: 8px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                color: #DADADA;
                overflow-x: auto;
                white-space: pre;
                margin: 5px 0;
            }

            .plantuml-description {
                font-size: 11px;
                color: #DADADA;
                margin-top: 5px;
            }

            .plantuml-copy-btn {
                background: #35485E;
                border: none;
                color: #FFFFFF;
                padding: 4px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
                margin-top: 5px;
                transition: background 0.2s;
            }

            .plantuml-copy-btn:hover {
                background: #4A5F7F;
            }

            .plantuml-toggle-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #35485E 0%, #232F3E 100%);
                border: 2px solid #35485E;
                color: #FFFFFF;
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
                background: #1E2222;
                border: 1px solid #35485E;
                border-radius: 4px;
                color: #FAFAFA;
                font-size: 12px;
            }

            .plantuml-search:focus {
                outline: none;
                border-color: #35485E;
            }

            .plantuml-highlight {
                background-color: #FAFAFA;
                color: #232F3E;
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
                background: #1E2222;
                border-radius: 4px;
            }

            .plantuml-editor-btn {
                padding: 5px 10px;
                background: #35485E;
                border: none;
                color: #FFFFFF;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: background 0.2s;
            }

            .plantuml-editor-btn:hover {
                background: #4A5F7F;
            }

            .plantuml-editor-btn.secondary {
                background: #1E2222;
                border: 1px solid #35485E;
            }

            .plantuml-editor-btn.secondary:hover {
                background: #35485E;
            }

            .plantuml-editor-btn.active {
                background: #34581B;
            }

            /* Zoom Controls */
            .plantuml-zoom-controls {
                display: flex;
                gap: 8px;
                align-items: center;
                padding: 8px;
                background: #1E2222;
                border-radius: 4px;
                flex-wrap: wrap;
            }

            .plantuml-zoom-level {
                color: #00CAFF;
                font-size: 12px;
                font-weight: 600;
                min-width: 45px;
                text-align: center;
            }

            .plantuml-pan-hint {
                color: #DADADA;
                font-size: 10px;
                margin-left: auto;
                opacity: 0.7;
            }

            .plantuml-canvas-container {
                background: #0F0F0F;
                border: 2px solid #35485E;
                border-radius: 4px;
                min-height: 250px;
                position: relative;
                overflow: hidden;
            }

            .plantuml-canvas-viewport {
                position: relative;
                width: 2000px;
                height: 2000px;
                transform-origin: 0 0;
                transition: none;
            }

            .plantuml-canvas {
                width: 100%;
                height: 100%;
                min-height: 250px;
                position: relative;
                z-index: 1;
            }

            .plantuml-canvas.show-grid {
                background-image:
                    linear-gradient(to right, rgba(53, 72, 94, 0.3) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(53, 72, 94, 0.3) 1px, transparent 1px);
                background-size: 20px 20px;
                background-position: 0 0;
                background-repeat: repeat;
            }

            #connection-svg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                min-height: 250px;
                z-index: 100;
                pointer-events: none;
                overflow: visible;
            }

            #connection-svg line {
                pointer-events: stroke;
                stroke-width: 3;
            }

            #connection-svg line:hover {
                stroke-width: 5;
                filter: drop-shadow(0 0 4px #00CAFF);
            }

            .plantuml-node {
                position: absolute;
                background: #35485E;
                color: #FFFFFF;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: move;
                user-select: none;
                min-width: 80px;
                text-align: center;
                border: 2px solid #4A5F7F;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                z-index: 50;
            }

            .plantuml-node.actor {
                background: #3E3F68;
                border-color: #5A5B8C;
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
                background: #34581B;
                border-color: #4A7A28;
                border-radius: 4px;
            }

            .plantuml-node.component {
                background: #0A655E;
                border-color: #0E8A81;
                border-radius: 4px;
            }

            .plantuml-node.database {
                background: #65151E;
                border-color: #8A1D28;
                border-radius: 4px 4px 15px 15px;
            }

            .plantuml-node.selected {
                border-color: #FAFAFA;
                box-shadow: 0 0 10px rgba(250, 250, 250, 0.5);
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
                background: #65151E;
                color: #FFFFFF;
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

            .plantuml-node-color {
                position: absolute;
                top: -8px;
                left: -8px;
                background: #35485E;
                color: #FFFFFF;
                border: none;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                cursor: pointer;
                font-size: 10px;
                line-height: 1;
                display: none;
                padding: 0;
            }

            .plantuml-node-color:hover {
                background: #4A5F7F;
            }

            .plantuml-node:hover .plantuml-node-color {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .plantuml-connection {
                position: absolute;
                pointer-events: none;
                z-index: 10;
            }

            .plantuml-output-code {
                background: #0F0F0F;
                padding: 10px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                color: #DADADA;
                max-height: 150px;
                overflow-y: auto;
                white-space: pre;
            }

            .plantuml-editor-controls {
                display: flex;
                gap: 8px;
                align-items: center;
                padding: 8px;
                background: #1E2222;
                border-radius: 4px;
                flex-wrap: wrap;
            }

            .plantuml-editor-label {
                color: #DADADA;
                font-size: 11px;
            }

            .plantuml-editor-select {
                padding: 4px 8px;
                background: #232F3E;
                border: 1px solid #35485E;
                border-radius: 4px;
                color: #FAFAFA;
                font-size: 11px;
                cursor: pointer;
            }

            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #232F3E;
            }

            ::-webkit-scrollbar-thumb {
                background: #35485E;
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #4A5F7F;
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
