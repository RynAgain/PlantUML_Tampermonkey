// PlantUML Helper - Visual Editor Module
// This module provides the drag-and-drop visual diagram editor

(function() {
    'use strict';

    console.log('[PlantUML Visual Editor] Module loaded');

    // Visual Editor State
    let editorState = {
        nodes: [],
        connections: [],
        selectedNode: null,
        nodeCounter: 0,
        diagramType: 'sequence',
        connectionMode: false,
        connectionStart: null
    };

    // Make editor functions globally accessible
    window.PlantUMLEditor = {
        createVisualEditorTab: createVisualEditorTab,
        initializeVisualEditor: initializeVisualEditor,
        getEditorState: () => editorState
    };

    /**
     * Create the visual editor tab content
     * @returns {HTMLElement} The editor tab element
     */
    function createVisualEditorTab() {
        const tabContent = document.createElement('div');
        tabContent.className = 'plantuml-tab-content active';
        tabContent.dataset.tab = 'editor';

        tabContent.innerHTML = `
            <div class="plantuml-editor-container">
                <div class="plantuml-editor-controls">
                    <label class="plantuml-editor-label">Type:</label>
                    <select class="plantuml-editor-select" id="diagram-type">
                        <option value="sequence">Sequence</option>
                        <option value="class">Class</option>
                        <option value="usecase">Use Case</option>
                        <option value="component">Component</option>
                    </select>
                </div>

                <div class="plantuml-editor-toolbar">
                    <button class="plantuml-editor-btn" id="add-node">+ Node</button>
                    <button class="plantuml-editor-btn" id="add-actor">+ Actor</button>
                    <button class="plantuml-editor-btn" id="add-class">+ Class</button>
                    <button class="plantuml-editor-btn" id="add-component">+ Component</button>
                    <button class="plantuml-editor-btn" id="add-database">+ DB</button>
                    <button class="plantuml-editor-btn secondary" id="connect-mode">🔗 Connect</button>
                    <button class="plantuml-editor-btn secondary" id="clear-canvas">🗑️ Clear</button>
                </div>

                <div class="plantuml-canvas-container">
                    <svg class="plantuml-connection" id="connection-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
                    </svg>
                    <div class="plantuml-canvas" id="plantuml-canvas"></div>
                </div>

                <div class="plantuml-editor-toolbar">
                    <button class="plantuml-editor-btn" id="generate-code">⚡ Generate Code</button>
                    <button class="plantuml-editor-btn secondary" id="copy-generated">📋 Copy</button>
                </div>

                <div class="plantuml-output-code" id="output-code">Click "Generate Code" to create PlantUML from your diagram...</div>
            </div>
        `;

        return tabContent;
    }

    /**
     * Initialize the visual editor with event listeners
     */
    function initializeVisualEditor() {
        const canvas = document.getElementById('plantuml-canvas');
        if (!canvas) {
            console.log('[PlantUML Visual Editor] Canvas not found, will retry');
            return;
        }

        console.log('[PlantUML Visual Editor] Initializing editor');

        // Add node buttons
        document.getElementById('add-node')?.addEventListener('click', () => addNode('node'));
        document.getElementById('add-actor')?.addEventListener('click', () => addNode('actor'));
        document.getElementById('add-class')?.addEventListener('click', () => addNode('class'));
        document.getElementById('add-component')?.addEventListener('click', () => addNode('component'));
        document.getElementById('add-database')?.addEventListener('click', () => addNode('database'));

        // Clear canvas
        document.getElementById('clear-canvas')?.addEventListener('click', clearCanvas);

        // Generate code
        document.getElementById('generate-code')?.addEventListener('click', generatePlantUMLCode);

        // Copy generated code
        document.getElementById('copy-generated')?.addEventListener('click', copyGeneratedCode);

        // Connection mode
        document.getElementById('connect-mode')?.addEventListener('click', toggleConnectionMode);

        // Diagram type change
        document.getElementById('diagram-type')?.addEventListener('change', (e) => {
            editorState.diagramType = e.target.value;
        });
    }

    /**
     * Add a node to the canvas
     * @param {string} type - Type of node (node, actor, class, component, database)
     */
    function addNode(type) {
        const canvas = document.getElementById('plantuml-canvas');
        if (!canvas) return;

        const node = document.createElement('div');
        node.className = `plantuml-node ${type}`;
        node.dataset.id = `node-${editorState.nodeCounter++}`;
        node.dataset.type = type;

        const label = document.createElement('div');
        label.className = 'plantuml-node-label';
        label.contentEditable = true;
        label.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}${editorState.nodeCounter}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'plantuml-node-delete';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeNode(node);
        });

        node.appendChild(label);
        node.appendChild(deleteBtn);

        // Position randomly but visible
        node.style.left = `${30 + Math.random() * 150}px`;
        node.style.top = `${30 + Math.random() * 100}px`;

        canvas.appendChild(node);

        // Make draggable
        makeDraggableNode(node);

        // Add click handler for connections
        node.addEventListener('click', (e) => {
            if (editorState.connectionMode) {
                handleNodeConnectionClick(node);
            } else {
                selectNode(node);
            }
        });

        // Store in state
        editorState.nodes.push({
            id: node.dataset.id,
            type: type,
            element: node
        });
    }

    /**
     * Make a node draggable
     * @param {HTMLElement} node - Node element to make draggable
     */
    function makeDraggableNode(node) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        node.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target.contentEditable === 'true') return;
            e.preventDefault();
            e.stopPropagation();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            node.style.top = (node.offsetTop - pos2) + "px";
            node.style.left = (node.offsetLeft - pos1) + "px";
            updateConnections();
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    /**
     * Select a node
     * @param {HTMLElement} node - Node to select
     */
    function selectNode(node) {
        document.querySelectorAll('.plantuml-node').forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');
        editorState.selectedNode = node;
    }

    /**
     * Remove a node from the canvas
     * @param {HTMLElement} node - Node to remove
     */
    function removeNode(node) {
        const nodeId = node.dataset.id;

        // Remove from state
        editorState.nodes = editorState.nodes.filter(n => n.id !== nodeId);

        // Remove connections
        editorState.connections = editorState.connections.filter(c =>
            c.from !== nodeId && c.to !== nodeId
        );

        // Remove from DOM
        node.remove();
        updateConnections();
    }

    /**
     * Toggle connection mode
     */
    function toggleConnectionMode() {
        editorState.connectionMode = !editorState.connectionMode;
        const btn = document.getElementById('connect-mode');

        if (editorState.connectionMode) {
            btn.classList.add('active');
            btn.textContent = '✓ Connecting...';
        } else {
            btn.classList.remove('active');
            btn.textContent = '🔗 Connect';
            editorState.connectionStart = null;
            // Reset border colors
            document.querySelectorAll('.plantuml-node').forEach(n => {
                n.style.borderColor = '';
            });
        }
    }

    /**
     * Handle node click in connection mode
     * @param {HTMLElement} node - Node that was clicked
     */
    function handleNodeConnectionClick(node) {
        if (!editorState.connectionStart) {
            editorState.connectionStart = node;
            node.style.borderColor = '#27ae60';
        } else {
            if (editorState.connectionStart !== node) {
                createConnection(editorState.connectionStart, node);
            }
            editorState.connectionStart.style.borderColor = '';
            editorState.connectionStart = null;
        }
    }

    /**
     * Create a connection between two nodes
     * @param {HTMLElement} fromNode - Source node
     * @param {HTMLElement} toNode - Target node
     */
    function createConnection(fromNode, toNode) {
        const connection = {
            from: fromNode.dataset.id,
            to: toNode.dataset.id,
            fromElement: fromNode,
            toElement: toNode
        };

        editorState.connections.push(connection);
        updateConnections();
    }

    /**
     * Update all connection lines on the canvas
     */
    function updateConnections() {
        const svg = document.getElementById('connection-svg');
        if (!svg) return;

        svg.innerHTML = '';

        // Add arrowhead marker
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '10');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3');
        marker.setAttribute('orient', 'auto');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3, 0 6');
        polygon.setAttribute('fill', '#4a9eff');

        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.appendChild(defs);

        editorState.connections.forEach(conn => {
            const fromRect = conn.fromElement.getBoundingClientRect();
            const toRect = conn.toElement.getBoundingClientRect();
            const canvasRect = document.getElementById('plantuml-canvas').getBoundingClientRect();

            const x1 = fromRect.left - canvasRect.left + fromRect.width / 2;
            const y1 = fromRect.top - canvasRect.top + fromRect.height / 2;
            const x2 = toRect.left - canvasRect.left + toRect.width / 2;
            const y2 = toRect.top - canvasRect.top + toRect.height / 2;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#4a9eff');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('marker-end', 'url(#arrowhead)');

            svg.appendChild(line);
        });
    }

    /**
     * Clear the canvas
     */
    function clearCanvas() {
        if (confirm('Clear all nodes and connections?')) {
            editorState.nodes = [];
            editorState.connections = [];
            editorState.selectedNode = null;
            editorState.nodeCounter = 0;

            const canvas = document.getElementById('plantuml-canvas');
            if (canvas) {
                canvas.innerHTML = '';
            }

            const svg = document.getElementById('connection-svg');
            if (svg) {
                svg.innerHTML = '';
            }

            document.getElementById('output-code').textContent = 'Click "Generate Code" to create PlantUML from your diagram...';
        }
    }

    /**
     * Generate PlantUML code from the visual diagram
     */
    function generatePlantUMLCode() {
        const type = editorState.diagramType;
        let code = '@startuml\n';

        if (type === 'sequence') {
            code += generateSequenceDiagram();
        } else if (type === 'class') {
            code += generateClassDiagram();
        } else if (type === 'usecase') {
            code += generateUseCaseDiagram();
        } else if (type === 'component') {
            code += generateComponentDiagram();
        }

        code += '@enduml';

        document.getElementById('output-code').textContent = code;
    }

    /**
     * Generate sequence diagram code
     * @returns {string} PlantUML code
     */
    function generateSequenceDiagram() {
        let code = '';

        // Add participants
        editorState.nodes.forEach(node => {
            const label = node.element.querySelector('.plantuml-node-label').textContent;
            const type = node.type === 'actor' ? 'actor' : 'participant';
            code += `${type} "${label}" as ${node.id}\n`;
        });

        code += '\n';

        // Add interactions
        editorState.connections.forEach(conn => {
            code += `${conn.from} -> ${conn.to}: Message\n`;
        });

        return code;
    }

    /**
     * Generate class diagram code
     * @returns {string} PlantUML code
     */
    function generateClassDiagram() {
        let code = '';

        // Add classes
        editorState.nodes.forEach(node => {
            const label = node.element.querySelector('.plantuml-node-label').textContent;
            code += `class ${label} {\n`;
            code += `  +field1\n`;
            code += `  +method1()\n`;
            code += `}\n\n`;
        });

        // Add relationships
        editorState.connections.forEach(conn => {
            const fromLabel = conn.fromElement.querySelector('.plantuml-node-label').textContent;
            const toLabel = conn.toElement.querySelector('.plantuml-node-label').textContent;
            code += `${fromLabel} --> ${toLabel}\n`;
        });

        return code;
    }

    /**
     * Generate use case diagram code
     * @returns {string} PlantUML code
     */
    function generateUseCaseDiagram() {
        let code = '';

        // Add actors and use cases
        editorState.nodes.forEach(node => {
            const label = node.element.querySelector('.plantuml-node-label').textContent;
            if (node.type === 'actor') {
                code += `actor "${label}" as ${node.id}\n`;
            } else {
                code += `usecase "${label}" as ${node.id}\n`;
            }
        });

        code += '\n';

        // Add relationships
        editorState.connections.forEach(conn => {
            code += `${conn.from} --> ${conn.to}\n`;
        });

        return code;
    }

    /**
     * Generate component diagram code
     * @returns {string} PlantUML code
     */
    function generateComponentDiagram() {
        let code = '';

        // Add components
        editorState.nodes.forEach(node => {
            const label = node.element.querySelector('.plantuml-node-label').textContent;
            const type = node.type === 'database' ? 'database' : 'component';
            code += `${type} "${label}" as ${node.id}\n`;
        });

        code += '\n';

        // Add connections
        editorState.connections.forEach(conn => {
            code += `${conn.from} --> ${conn.to}\n`;
        });

        return code;
    }

    /**
     * Copy the generated code to clipboard
     */
    function copyGeneratedCode() {
        const code = document.getElementById('output-code').textContent;
        if (code && !code.includes('Click "Generate Code"')) {
            if (window.PlantUMLHelpers && window.PlantUMLHelpers.copyToClipboard) {
                window.PlantUMLHelpers.copyToClipboard(code);
                const btn = document.getElementById('copy-generated');
                const originalText = btn.textContent;
                btn.textContent = '✓ Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            }
        }
    }

    // Export for testing
    try {
        module.exports = {
            createVisualEditorTab,
            initializeVisualEditor,
            getEditorState: () => editorState
        };
    } catch (e) {
        // Browser environment
    }
})();
