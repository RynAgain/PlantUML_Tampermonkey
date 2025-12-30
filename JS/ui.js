// PlantUML Helper - UI Components Module
// This module creates and manages the main panel, tabs, and reference content

(function() {
    'use strict';

    console.log('[PlantUML UI] Module loaded');

    let panel = null;
    let toggleBtn = null;

    // Make UI functions globally accessible
    window.PlantUMLUI = {
        initializeUI: initializeUI,
        togglePanel: togglePanel
    };

    /**
     * Initialize the main UI components
     */
    function initializeUI() {
        console.log('[PlantUML UI] Initializing UI components');

        // Create toggle button
        createToggleButton();

        // Create main panel
        createMainPanel();

        // Generate tab contents
        generateTabContents();

        // Setup event listeners
        setupEventListeners();

        // Make panel draggable
        if (window.PlantUMLHelpers && window.PlantUMLHelpers.makeDraggable) {
            const header = panel.querySelector('.plantuml-header');
            window.PlantUMLHelpers.makeDraggable(panel, header);
        }

        // Initialize visual editor after a short delay
        setTimeout(() => {
            if (window.PlantUMLEditor && window.PlantUMLEditor.initializeVisualEditor) {
                window.PlantUMLEditor.initializeVisualEditor();
            }
        }, 100);

        // Load saved state
        loadSavedState();

        // Save state on close
        window.addEventListener('beforeunload', saveState);

        console.log('[PlantUML UI] UI initialization complete');
    }

    /**
     * Create the toggle button
     */
    function createToggleButton() {
        if (document.getElementById('plantuml-toggle-btn')) {
            console.log('[PlantUML UI] Toggle button already exists');
            return;
        }

        toggleBtn = document.createElement('button');
        toggleBtn.id = 'plantuml-toggle-btn';
        toggleBtn.className = 'plantuml-toggle-btn';
        toggleBtn.textContent = '📊 PlantUML Helper';
        toggleBtn.addEventListener('click', togglePanel);
        document.body.appendChild(toggleBtn);
    }

    /**
     * Create the main panel
     */
    function createMainPanel() {
        if (document.getElementById('plantuml-helper-panel')) {
            console.log('[PlantUML UI] Panel already exists');
            panel = document.getElementById('plantuml-helper-panel');
            return;
        }

        panel = document.createElement('div');
        panel.id = 'plantuml-helper-panel';
        panel.innerHTML = `
            <div class="plantuml-header">
                <h3>📊 PlantUML Helper</h3>
                <button class="plantuml-close-btn" id="plantuml-close">×</button>
            </div>
            <div class="plantuml-content">
                <input type="text" class="plantuml-search" id="plantuml-search" placeholder="Search syntax...">
                <div class="plantuml-tabs">
                    <button class="plantuml-tab active" data-tab="editor">✏️ Editor</button>
                    <button class="plantuml-tab" data-tab="basics">Basics</button>
                    <button class="plantuml-tab" data-tab="sequence">Sequence</button>
                    <button class="plantuml-tab" data-tab="class">Class</button>
                    <button class="plantuml-tab" data-tab="usecase">UseCase</button>
                    <button class="plantuml-tab" data-tab="activity">Activity</button>
                    <button class="plantuml-tab" data-tab="state">State</button>
                    <button class="plantuml-tab" data-tab="component">Component</button>
                    <button class="plantuml-tab" data-tab="styling">Style</button>
                </div>
                <div id="plantuml-tab-contents"></div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    /**
     * Generate tab contents from PlantUML data
     */
    function generateTabContents() {
        const tabContents = document.getElementById('plantuml-tab-contents');
        if (!tabContents) return;

        // Add Visual Editor tab first
        if (window.PlantUMLEditor && window.PlantUMLEditor.createVisualEditorTab) {
            const editorTab = window.PlantUMLEditor.createVisualEditorTab();
            tabContents.appendChild(editorTab);
        }

        // Add reference tabs from data
        if (!window.PlantUMLData) {
            console.error('[PlantUML UI] PlantUMLData not available');
            return;
        }

        const plantUMLData = window.PlantUMLData;
        const helpers = window.PlantUMLHelpers;

        Object.keys(plantUMLData).forEach((category) => {
            const tabContent = document.createElement('div');
            tabContent.className = 'plantuml-tab-content';
            tabContent.dataset.tab = category;

            const section = document.createElement('div');
            section.className = 'plantuml-section';
            section.innerHTML = `<h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>`;

            plantUMLData[category].forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'plantuml-item';
                itemDiv.innerHTML = `
                    <div class="plantuml-item-title">${item.title}</div>
                    <div class="plantuml-code">${helpers ? helpers.escapeHtml(item.code) : item.code}</div>
                    <div class="plantuml-description">${item.description}</div>
                    <button class="plantuml-copy-btn" data-code="${helpers ? helpers.escapeHtml(item.code) : item.code}">Copy Code</button>
                `;
                section.appendChild(itemDiv);
            });

            tabContent.appendChild(section);
            tabContents.appendChild(tabContent);
        });
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Close button
        const closeBtn = document.getElementById('plantuml-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', togglePanel);
        }

        // Tab switching
        document.querySelectorAll('.plantuml-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.dataset.tab;

                // Update active tab
                document.querySelectorAll('.plantuml-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Update active content
                document.querySelectorAll('.plantuml-tab-content').forEach(c => c.classList.remove('active'));
                const targetContent = document.querySelector(`.plantuml-tab-content[data-tab="${tabName}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });

        // Copy button functionality
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('plantuml-copy-btn')) {
                const code = e.target.dataset.code;
                const helpers = window.PlantUMLHelpers;
                
                if (helpers && helpers.copyToClipboard && helpers.unescapeHtml) {
                    helpers.copyToClipboard(helpers.unescapeHtml(code));

                    const originalText = e.target.textContent;
                    e.target.textContent = '✓ Copied!';
                    setTimeout(() => {
                        e.target.textContent = originalText;
                    }, 2000);
                }
            }
        });

        // Search functionality
        const searchInput = document.getElementById('plantuml-search');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const items = document.querySelectorAll('.plantuml-item');

                items.forEach(item => {
                    const title = item.querySelector('.plantuml-item-title')?.textContent.toLowerCase() || '';
                    const code = item.querySelector('.plantuml-code')?.textContent.toLowerCase() || '';
                    const description = item.querySelector('.plantuml-description')?.textContent.toLowerCase() || '';

                    if (title.includes(searchTerm) || code.includes(searchTerm) || description.includes(searchTerm)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    }

    /**
     * Toggle panel visibility
     */
    function togglePanel() {
        if (!panel) return;

        panel.classList.toggle('visible');
        if (panel.classList.contains('visible')) {
            toggleBtn.style.display = 'none';
        } else {
            toggleBtn.style.display = 'block';
        }
    }

    /**
     * Load saved state from GM_getValue
     */
    function loadSavedState() {
        try {
            if (typeof GM_getValue !== 'undefined') {
                const savedState = GM_getValue('panelVisible', false);
                if (savedState) {
                    togglePanel();
                }
            }
        } catch (e) {
            console.log('[PlantUML UI] Could not load saved state:', e);
        }
    }

    /**
     * Save state using GM_setValue
     */
    function saveState() {
        try {
            if (typeof GM_setValue !== 'undefined' && panel) {
                GM_setValue('panelVisible', panel.classList.contains('visible'));
            }
        } catch (e) {
            console.log('[PlantUML UI] Could not save state:', e);
        }
    }

    /**
     * Wait for UI to be ready and initialize
     */
    function waitForUIReady() {
        if (document.body) {
            initializeUI();
        } else {
            const observer = new MutationObserver(() => {
                if (document.body) {
                    initializeUI();
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForUIReady);
    } else {
        waitForUIReady();
    }

    // Export for testing
    try {
        module.exports = { initializeUI, togglePanel };
    } catch (e) {
        // Browser environment
    }
})();
