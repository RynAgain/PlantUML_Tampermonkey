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
        connectionStart: null,
        currentArrowType: '->',  // Default arrow type
        isFullPage: false,       // Full page mode
        gridSize: 20             // Grid size for snap
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
                    <button class="plantuml-editor-btn secondary" id="save-diagram" style="margin-left: auto;">💾 Save</button>
                    <button class="plantuml-editor-btn secondary" id="load-diagram">📂 Load</button>
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

                <div class="plantuml-editor-controls">
                    <label class="plantuml-editor-label">Arrow Type:</label>
                    <select class="plantuml-editor-select" id="arrow-type">
                        <option value="->">→ Solid Right (->)</option>
                        <option value="<-">← Solid Left (<-)</option>
                        <option value="<->">↔ Solid Both (<->)</option>
                        <option value="-->">⇢ Dashed Right (-->)</option>
                        <option value="<--">⇠ Dashed Left (<--)</option>
                        <option value="<-->">⇔ Dashed Both (<-->)</option>
                        <option value="->>">⇉ Async Right (->>)</option>
                        <option value="<<-">⇇ Async Left (<<-)</option>
                    </select>
                    <button class="plantuml-editor-btn secondary" id="manage-nodes">📋 Nodes</button>
                    <button class="plantuml-editor-btn secondary" id="snap-to-grid">📐 Snap Grid</button>
                    <button class="plantuml-editor-btn secondary" id="full-page-mode">⛶ Full Page</button>
                    <button class="plantuml-editor-btn" id="export-png">📷 Export PNG</button>
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

        // Arrow type change
        document.getElementById('arrow-type')?.addEventListener('change', (e) => {
            editorState.currentArrowType = e.target.value;
            console.log('[PlantUML Visual Editor] Arrow type changed to:', e.target.value);
        });

        // Manage nodes
        document.getElementById('manage-nodes')?.addEventListener('click', showNodeManager);

        // Snap to grid
        document.getElementById('snap-to-grid')?.addEventListener('click', snapNodesToGrid);

        // Full page mode
        document.getElementById('full-page-mode')?.addEventListener('click', toggleFullPageMode);

        // Export PNG
        document.getElementById('export-png')?.addEventListener('click', exportToPNG);

        // Save/Load
        document.getElementById('save-diagram')?.addEventListener('click', saveDiagram);
        document.getElementById('load-diagram')?.addEventListener('click', loadDiagram);

        // Diagram type change
        document.getElementById('diagram-type')?.addEventListener('change', (e) => {
            editorState.diagramType = e.target.value;
        });

        // Try to load saved diagram
        tryLoadSavedDiagram();
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
            toElement: toNode,
            arrowType: editorState.currentArrowType  // Store the arrow type
        };

        editorState.connections.push(connection);
        updateConnections();
        
        console.log('[PlantUML Visual Editor] Connection created with arrow type:', editorState.currentArrowType);
    }

    /**
     * Calculate the intersection point of a line from center to edge of a rectangle
     * @param {number} cx - Center X of rectangle
     * @param {number} cy - Center Y of rectangle
     * @param {number} w - Width of rectangle
     * @param {number} h - Height of rectangle
     * @param {number} targetX - Target X point
     * @param {number} targetY - Target Y point
     * @returns {Object} {x, y} intersection point
     */
    function getEdgeIntersection(cx, cy, w, h, targetX, targetY) {
        const dx = targetX - cx;
        const dy = targetY - cy;
        
        if (dx === 0 && dy === 0) return { x: cx, y: cy };
        
        const halfW = w / 2;
        const halfH = h / 2;
        
        // Calculate intersection with rectangle edges
        let t = Infinity;
        
        // Right edge
        if (dx > 0) {
            t = Math.min(t, halfW / dx);
        }
        // Left edge
        if (dx < 0) {
            t = Math.min(t, -halfW / dx);
        }
        // Bottom edge
        if (dy > 0) {
            t = Math.min(t, halfH / dy);
        }
        // Top edge
        if (dy < 0) {
            t = Math.min(t, -halfH / dy);
        }
        
        return {
            x: cx + dx * t,
            y: cy + dy * t
        };
    }

    /**
     * Update all connection lines on the canvas
     */
    function updateConnections() {
        const svg = document.getElementById('connection-svg');
        if (!svg) return;

        svg.innerHTML = '';

        // Add arrowhead markers - larger and more visible
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        
        // Right arrowhead (larger)
        const markerRight = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        markerRight.setAttribute('id', 'arrowhead-right');
        markerRight.setAttribute('markerWidth', '12');
        markerRight.setAttribute('markerHeight', '12');
        markerRight.setAttribute('refX', '10');
        markerRight.setAttribute('refY', '4');
        markerRight.setAttribute('orient', 'auto');
        const polygonRight = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygonRight.setAttribute('points', '0 0, 12 4, 0 8');
        polygonRight.setAttribute('fill', '#00CAFF');
        markerRight.appendChild(polygonRight);
        defs.appendChild(markerRight);

        // Left arrowhead (larger)
        const markerLeft = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        markerLeft.setAttribute('id', 'arrowhead-left');
        markerLeft.setAttribute('markerWidth', '12');
        markerLeft.setAttribute('markerHeight', '12');
        markerLeft.setAttribute('refX', '2');
        markerLeft.setAttribute('refY', '4');
        markerLeft.setAttribute('orient', 'auto');
        const polygonLeft = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygonLeft.setAttribute('points', '12 0, 0 4, 12 8');
        polygonLeft.setAttribute('fill', '#00CAFF');
        markerLeft.appendChild(polygonLeft);
        defs.appendChild(markerLeft);

        svg.appendChild(defs);

        editorState.connections.forEach((conn, index) => {
            const fromRect = conn.fromElement.getBoundingClientRect();
            const toRect = conn.toElement.getBoundingClientRect();
            const canvasRect = document.getElementById('plantuml-canvas').getBoundingClientRect();

            // Calculate centers
            const fromCX = fromRect.left - canvasRect.left + fromRect.width / 2;
            const fromCY = fromRect.top - canvasRect.top + fromRect.height / 2;
            const toCX = toRect.left - canvasRect.left + toRect.width / 2;
            const toCY = toRect.top - canvasRect.top + toRect.height / 2;
            
            // Calculate edge intersection points (so arrows don't go through nodes)
            const fromEdge = getEdgeIntersection(fromCX, fromCY, fromRect.width, fromRect.height, toCX, toCY);
            const toEdge = getEdgeIntersection(toCX, toCY, toRect.width, toRect.height, fromCX, fromCY);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromEdge.x);
            line.setAttribute('y1', fromEdge.y);
            line.setAttribute('x2', toEdge.x);
            line.setAttribute('y2', toEdge.y);
            line.setAttribute('stroke', '#00CAFF');
            
            // Determine line style and arrowheads based on arrow type
            const arrowType = conn.arrowType || '->';
            
            if (arrowType.includes('--')) {
                // Dashed line
                line.setAttribute('stroke-dasharray', '8,4');
            }
            
            line.setAttribute('stroke-width', '3');
            
            // Set arrowheads based on direction
            if (arrowType.startsWith('<')) {
                // Left-pointing (at start)
                line.setAttribute('marker-start', 'url(#arrowhead-left)');
            }
            if (arrowType.includes('>')) {
                // Right-pointing (at end)
                line.setAttribute('marker-end', 'url(#arrowhead-right)');
            }
            
            // Make line clickable for editing
            line.style.cursor = 'pointer';
            line.style.pointerEvents = 'stroke';
            line.dataset.connectionIndex = index;
            
            // Add click handler to edit connection
            line.addEventListener('click', (e) => {
                e.stopPropagation();
                showConnectionEditor(index, conn);
            });

            svg.appendChild(line);
        });
    }

    /**
     * Clear the canvas
     */
    function clearCanvas(skipConfirm = false) {
        if (skipConfirm || confirm('Clear all nodes and connections?')) {
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

            const outputCode = document.getElementById('output-code');
            if (outputCode) {
                outputCode.textContent = 'Click "Generate Code" to create PlantUML from your diagram...';
            }
        }
    }

    /**
     * Generate PlantUML code from the visual diagram
     */
    function generatePlantUMLCode() {
        console.log('[PlantUML Visual Editor] Generating code...');
        console.log('[PlantUML Visual Editor] Nodes:', editorState.nodes.length);
        console.log('[PlantUML Visual Editor] Connections:', editorState.connections.length);
        console.log('[PlantUML Visual Editor] Diagram type:', editorState.diagramType);
        
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

        console.log('[PlantUML Visual Editor] Generated code:', code);
        
        const outputElement = document.getElementById('output-code');
        if (outputElement) {
            outputElement.textContent = code;
        } else {
            console.error('[PlantUML Visual Editor] Output code element not found!');
        }
    }

    /**
     * Generate sequence diagram code
     * @returns {string} PlantUML code
     */
    function generateSequenceDiagram() {
        let code = '';

        // Add participants
        editorState.nodes.forEach(node => {
            const labelElement = node.element.querySelector('.plantuml-node-label');
            if (!labelElement) {
                console.error('[PlantUML Visual Editor] Label element not found for node:', node.id);
                return;
            }
            const label = sanitizePlantUMLLabel(labelElement.textContent.trim());
            const type = node.type === 'actor' ? 'actor' : 'participant';
            const alias = sanitizePlantUMLAlias(node.id);
            code += `${type} "${label}" as ${alias}\n`;
        });

        code += '\n';

        // Add interactions
        editorState.connections.forEach(conn => {
            const fromAlias = sanitizePlantUMLAlias(conn.from);
            const toAlias = sanitizePlantUMLAlias(conn.to);
            const arrowType = conn.arrowType || '->';
            code += `${fromAlias} ${arrowType} ${toAlias}: Message\n`;
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
            const labelElement = node.element.querySelector('.plantuml-node-label');
            if (!labelElement) {
                console.error('[PlantUML Visual Editor] Label element not found for node:', node.id);
                return;
            }
            const label = sanitizePlantUMLClassName(labelElement.textContent.trim());
            code += `class ${label} {\n`;
            code += `  +field1\n`;
            code += `  +method1()\n`;
            code += `}\n\n`;
        });

        // Add relationships
        editorState.connections.forEach(conn => {
            const fromLabelElement = conn.fromElement.querySelector('.plantuml-node-label');
            const toLabelElement = conn.toElement.querySelector('.plantuml-node-label');
            if (!fromLabelElement || !toLabelElement) {
                console.error('[PlantUML Visual Editor] Label element not found for connection');
                return;
            }
            const fromLabel = sanitizePlantUMLClassName(fromLabelElement.textContent.trim());
            const toLabel = sanitizePlantUMLClassName(toLabelElement.textContent.trim());
            const arrowType = conn.arrowType || '-->';
            code += `${fromLabel} ${arrowType} ${toLabel}\n`;
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
            const labelElement = node.element.querySelector('.plantuml-node-label');
            if (!labelElement) {
                console.error('[PlantUML Visual Editor] Label element not found for node:', node.id);
                return;
            }
            const label = sanitizePlantUMLLabel(labelElement.textContent.trim());
            const alias = sanitizePlantUMLAlias(node.id);
            if (node.type === 'actor') {
                code += `actor "${label}" as ${alias}\n`;
            } else {
                code += `usecase "${label}" as ${alias}\n`;
            }
        });

        code += '\n';

        // Add relationships
        editorState.connections.forEach(conn => {
            const fromAlias = sanitizePlantUMLAlias(conn.from);
            const toAlias = sanitizePlantUMLAlias(conn.to);
            const arrowType = conn.arrowType || '-->';
            code += `${fromAlias} ${arrowType} ${toAlias}\n`;
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
            const labelElement = node.element.querySelector('.plantuml-node-label');
            if (!labelElement) {
                console.error('[PlantUML Visual Editor] Label element not found for node:', node.id);
                return;
            }
            const label = sanitizePlantUMLLabel(labelElement.textContent.trim());
            const alias = sanitizePlantUMLAlias(node.id);
            const type = node.type === 'database' ? 'database' : 'component';
            code += `${type} "${label}" as ${alias}\n`;
        });

        code += '\n';

        // Add connections
        editorState.connections.forEach(conn => {
            const fromAlias = sanitizePlantUMLAlias(conn.from);
            const toAlias = sanitizePlantUMLAlias(conn.to);
            const arrowType = conn.arrowType || '-->';
            code += `${fromAlias} ${arrowType} ${toAlias}\n`;
        });

        return code;
    }

    /**
     * Sanitize label for PlantUML (for display names in quotes)
     * @param {string} label - Label to sanitize
     * @returns {string} Sanitized label
     */
    function sanitizePlantUMLLabel(label) {
        // Escape quotes and backslashes
        return label.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    /**
     * Sanitize alias for PlantUML (for identifiers without quotes)
     * @param {string} alias - Alias to sanitize
     * @returns {string} Sanitized alias
     */
    function sanitizePlantUMLAlias(alias) {
        // Replace invalid characters with underscores
        return alias.replace(/[^a-zA-Z0-9_]/g, '_');
    }

    /**
     * Sanitize class name for PlantUML (no quotes, no spaces)
     * @param {string} className - Class name to sanitize
     * @returns {string} Sanitized class name
     */
    function sanitizePlantUMLClassName(className) {
        // Remove spaces and special characters, keep only alphanumeric and underscores
        return className.replace(/[^a-zA-Z0-9_]/g, '');
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

    /**
     * Show node manager modal for reordering nodes
     */
    function showNodeManager() {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'node-manager-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.7);
            z-index: 1000000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: #232F3E;
            padding: 20px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            color: #FAFAFA;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Manage Node Order';
        title.style.cssText = 'margin: 0 0 15px 0; color: #4a9eff;';
        modal.appendChild(title);

        const description = document.createElement('p');
        description.textContent = 'Drag nodes to reorder them. This affects the order they appear in generated code.';
        description.style.cssText = 'margin: 0 0 15px 0; font-size: 12px; color: #DADADA;';
        modal.appendChild(description);

        const nodeList = document.createElement('div');
        nodeList.id = 'node-order-list';
        nodeList.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;';

        // Create draggable node items
        editorState.nodes.forEach((node, index) => {
            const nodeItem = document.createElement('div');
            nodeItem.draggable = true;
            nodeItem.dataset.nodeIndex = index;
            nodeItem.style.cssText = `
                background: #35485E;
                padding: 10px;
                border-radius: 4px;
                cursor: move;
                display: flex;
                align-items: center;
                gap: 10px;
                border: 2px solid transparent;
            `;

            const dragHandle = document.createElement('span');
            dragHandle.textContent = '☰';
            dragHandle.style.cssText = 'color: #DADADA; font-size: 16px;';
            nodeItem.appendChild(dragHandle);

            const label = node.element.querySelector('.plantuml-node-label').textContent;
            const labelSpan = document.createElement('span');
            labelSpan.textContent = `${index + 1}. ${label} (${node.type})`;
            labelSpan.style.cssText = 'flex: 1; color: #FAFAFA;';
            nodeItem.appendChild(labelSpan);

            // Drag and drop handlers
            nodeItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', index);
                nodeItem.style.opacity = '0.5';
            });

            nodeItem.addEventListener('dragend', (e) => {
                nodeItem.style.opacity = '1';
            });

            nodeItem.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                nodeItem.style.borderColor = '#4a9eff';
            });

            nodeItem.addEventListener('dragleave', (e) => {
                nodeItem.style.borderColor = 'transparent';
            });

            nodeItem.addEventListener('drop', (e) => {
                e.preventDefault();
                nodeItem.style.borderColor = 'transparent';
                
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = parseInt(nodeItem.dataset.nodeIndex);
                
                if (fromIndex !== toIndex) {
                    // Reorder nodes array
                    const [movedNode] = editorState.nodes.splice(fromIndex, 1);
                    editorState.nodes.splice(toIndex, 0, movedNode);
                    
                    // Refresh the list
                    showNodeManager();
                    
                    // Close the old overlay
                    overlay.remove();
                }
            });

            nodeList.appendChild(nodeItem);
        });

        modal.appendChild(nodeList);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            background: #4a9eff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        closeBtn.addEventListener('click', () => overlay.remove());
        modal.appendChild(closeBtn);

        overlay.appendChild(modal);
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        document.body.appendChild(overlay);
    }

    /**
     * Show connection editor modal for editing arrow type/direction
     * @param {number} index - Index of the connection in editorState.connections
     * @param {Object} conn - The connection object
     */
    function showConnectionEditor(index, conn) {
        // Get node labels for display
        const fromLabel = conn.fromElement.querySelector('.plantuml-node-label').textContent;
        const toLabel = conn.toElement.querySelector('.plantuml-node-label').textContent;
        
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'connection-editor-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.7);
            z-index: 1000000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: #232F3E;
            padding: 20px;
            border-radius: 8px;
            max-width: 400px;
            width: 90%;
            color: #FAFAFA;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Edit Connection';
        title.style.cssText = 'margin: 0 0 15px 0; color: #00CAFF;';
        modal.appendChild(title);

        // Connection info
        const info = document.createElement('p');
        info.innerHTML = `<strong>${fromLabel}</strong> → <strong>${toLabel}</strong>`;
        info.style.cssText = 'margin: 0 0 15px 0; font-size: 14px; color: #DADADA;';
        modal.appendChild(info);

        // Arrow type selector
        const selectorLabel = document.createElement('label');
        selectorLabel.textContent = 'Arrow Type:';
        selectorLabel.style.cssText = 'display: block; margin-bottom: 8px; color: #DADADA; font-size: 12px;';
        modal.appendChild(selectorLabel);

        const arrowTypes = [
            { value: '->', label: '→ Solid Right (->)' },
            { value: '<-', label: '← Solid Left (<-)' },
            { value: '<->', label: '↔ Solid Both (<->)' },
            { value: '-->', label: '⇢ Dashed Right (-->)' },
            { value: '<--', label: '⇠ Dashed Left (<--)' },
            { value: '<-->', label: '⇔ Dashed Both (<-->)' },
            { value: '->>', label: '⇉ Async Right (->>)' },
            { value: '<<-', label: '⇇ Async Left (<<-)' }
        ];

        const select = document.createElement('select');
        select.style.cssText = `
            width: 100%;
            padding: 10px;
            background: #35485E;
            border: 1px solid #4A5F7F;
            border-radius: 4px;
            color: #FAFAFA;
            font-size: 14px;
            margin-bottom: 15px;
            cursor: pointer;
        `;

        arrowTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.label;
            if (type.value === conn.arrowType) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        modal.appendChild(select);

        // Swap direction button
        const swapBtn = document.createElement('button');
        swapBtn.textContent = '🔄 Swap Direction';
        swapBtn.style.cssText = `
            width: 100%;
            padding: 10px;
            background: #35485E;
            border: 1px solid #4A5F7F;
            border-radius: 4px;
            color: #FAFAFA;
            font-size: 14px;
            margin-bottom: 15px;
            cursor: pointer;
        `;
        swapBtn.addEventListener('click', () => {
            // Swap from and to
            const tempFrom = conn.from;
            const tempFromElement = conn.fromElement;
            conn.from = conn.to;
            conn.fromElement = conn.toElement;
            conn.to = tempFrom;
            conn.toElement = tempFromElement;
            
            // Update info display
            const newFromLabel = conn.fromElement.querySelector('.plantuml-node-label').textContent;
            const newToLabel = conn.toElement.querySelector('.plantuml-node-label').textContent;
            info.innerHTML = `<strong>${newFromLabel}</strong> → <strong>${newToLabel}</strong>`;
            
            updateConnections();
        });
        modal.appendChild(swapBtn);

        // Button container
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'display: flex; gap: 10px; margin-top: 10px;';

        // Save button
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '✓ Save';
        saveBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #00CAFF;
            border: none;
            border-radius: 4px;
            color: #232F3E;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        `;
        saveBtn.addEventListener('click', () => {
            conn.arrowType = select.value;
            updateConnections();
            overlay.remove();
        });
        btnContainer.appendChild(saveBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️ Delete';
        deleteBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #65151E;
            border: none;
            border-radius: 4px;
            color: #FAFAFA;
            font-size: 14px;
            cursor: pointer;
        `;
        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this connection?')) {
                editorState.connections.splice(index, 1);
                updateConnections();
                overlay.remove();
            }
        });
        btnContainer.appendChild(deleteBtn);

        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #1E2222;
            border: 1px solid #35485E;
            border-radius: 4px;
            color: #DADADA;
            font-size: 14px;
            cursor: pointer;
        `;
        cancelBtn.addEventListener('click', () => overlay.remove());
        btnContainer.appendChild(cancelBtn);

        modal.appendChild(btnContainer);
        overlay.appendChild(modal);
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        document.body.appendChild(overlay);
    }

    /**
     * Save diagram to localStorage
     */
    function saveDiagram() {
        try {
            const diagramData = {
                diagramType: editorState.diagramType,
                nodeCounter: editorState.nodeCounter,
                nodes: editorState.nodes.map(node => ({
                    id: node.id,
                    type: node.type,
                    label: node.element.querySelector('.plantuml-node-label').textContent,
                    left: node.element.style.left,
                    top: node.element.style.top
                })),
                connections: editorState.connections.map(conn => ({
                    from: conn.from,
                    to: conn.to,
                    arrowType: conn.arrowType || '->'
                }))
            };

            if (typeof GM_setValue !== 'undefined') {
                GM_setValue('plantUMLDiagram', JSON.stringify(diagramData));
            } else {
                localStorage.setItem('plantUMLDiagram', JSON.stringify(diagramData));
            }

            const btn = document.getElementById('save-diagram');
            const originalText = btn.textContent;
            btn.textContent = '✓ Saved!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);

            console.log('[PlantUML Visual Editor] Diagram saved successfully');
        } catch (error) {
            console.error('[PlantUML Visual Editor] Error saving diagram:', error);
            alert('Error saving diagram: ' + error.message);
        }
    }

    /**
     * Load diagram from localStorage
     */
    function loadDiagram() {
        try {
            let diagramDataStr;
            if (typeof GM_getValue !== 'undefined') {
                diagramDataStr = GM_getValue('plantUMLDiagram', null);
            } else {
                diagramDataStr = localStorage.getItem('plantUMLDiagram');
            }

            if (!diagramDataStr) {
                alert('No saved diagram found');
                return;
            }

            const diagramData = JSON.parse(diagramDataStr);

            // Clear current diagram
            clearCanvas(true); // Skip confirmation

            // Restore state
            editorState.diagramType = diagramData.diagramType;
            editorState.nodeCounter = diagramData.nodeCounter;

            // Update diagram type selector
            const typeSelect = document.getElementById('diagram-type');
            if (typeSelect) {
                typeSelect.value = diagramData.diagramType;
            }

            // Recreate nodes
            diagramData.nodes.forEach(nodeData => {
                const canvas = document.getElementById('plantuml-canvas');
                if (!canvas) return;

                const node = document.createElement('div');
                node.className = `plantuml-node ${nodeData.type}`;
                node.dataset.id = nodeData.id;
                node.dataset.type = nodeData.type;

                const label = document.createElement('div');
                label.className = 'plantuml-node-label';
                label.contentEditable = true;
                label.textContent = nodeData.label;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'plantuml-node-delete';
                deleteBtn.textContent = '×';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeNode(node);
                });

                node.appendChild(label);
                node.appendChild(deleteBtn);
                node.style.left = nodeData.left;
                node.style.top = nodeData.top;

                canvas.appendChild(node);
                makeDraggableNode(node);

                node.addEventListener('click', (e) => {
                    if (editorState.connectionMode) {
                        handleNodeConnectionClick(node);
                    } else {
                        selectNode(node);
                    }
                });

                editorState.nodes.push({
                    id: node.dataset.id,
                    type: nodeData.type,
                    element: node
                });
            });

            // Recreate connections
            diagramData.connections.forEach(connData => {
                const fromNode = editorState.nodes.find(n => n.id === connData.from);
                const toNode = editorState.nodes.find(n => n.id === connData.to);

                if (fromNode && toNode) {
                    editorState.connections.push({
                        from: connData.from,
                        to: connData.to,
                        fromElement: fromNode.element,
                        toElement: toNode.element,
                        arrowType: connData.arrowType || '->'
                    });
                }
            });

            updateConnections();

            const btn = document.getElementById('load-diagram');
            const originalText = btn.textContent;
            btn.textContent = '✓ Loaded!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);

            console.log('[PlantUML Visual Editor] Diagram loaded successfully');
        } catch (error) {
            console.error('[PlantUML Visual Editor] Error loading diagram:', error);
            alert('Error loading diagram: ' + error.message);
        }
    }

    /**
     * Try to load saved diagram on initialization
     */
    function tryLoadSavedDiagram() {
        // Don't auto-load, just check if there's a saved diagram
        try {
            let diagramDataStr;
            if (typeof GM_getValue !== 'undefined') {
                diagramDataStr = GM_getValue('plantUMLDiagram', null);
            } else {
                diagramDataStr = localStorage.getItem('plantUMLDiagram');
            }

            if (diagramDataStr) {
                console.log('[PlantUML Visual Editor] Saved diagram available - click Load to restore');
            }
        } catch (error) {
            console.error('[PlantUML Visual Editor] Error checking for saved diagram:', error);
        }
    }

    /**
     * Snap all nodes to a grid for clean alignment
     */
    function snapNodesToGrid() {
        const gridSize = editorState.gridSize;
        
        editorState.nodes.forEach(node => {
            const element = node.element;
            const currentLeft = parseInt(element.style.left) || 0;
            const currentTop = parseInt(element.style.top) || 0;
            
            // Snap to nearest grid point
            const snappedLeft = Math.round(currentLeft / gridSize) * gridSize;
            const snappedTop = Math.round(currentTop / gridSize) * gridSize;
            
            element.style.left = snappedLeft + 'px';
            element.style.top = snappedTop + 'px';
        });
        
        updateConnections();
        
        const btn = document.getElementById('snap-to-grid');
        const originalText = btn.textContent;
        btn.textContent = '✓ Snapped!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1500);
        
        console.log('[PlantUML Visual Editor] Nodes snapped to grid (size: ' + gridSize + 'px)');
    }

    /**
     * Toggle full page mode for the editor
     */
    function toggleFullPageMode() {
        editorState.isFullPage = !editorState.isFullPage;
        const panel = document.getElementById('plantuml-helper-panel');
        const btn = document.getElementById('full-page-mode');
        
        if (editorState.isFullPage) {
            // Store original styles
            panel.dataset.originalStyles = JSON.stringify({
                top: panel.style.top,
                right: panel.style.right,
                left: panel.style.left,
                width: panel.style.width,
                height: panel.style.height,
                maxHeight: panel.style.maxHeight,
                maxWidth: panel.style.maxWidth,
                borderRadius: panel.style.borderRadius
            });
            
            // Apply full page styles
            panel.style.top = '0';
            panel.style.left = '0';
            panel.style.right = '0';
            panel.style.width = '100vw';
            panel.style.height = '100vh';
            panel.style.maxHeight = '100vh';
            panel.style.maxWidth = '100vw';
            panel.style.borderRadius = '0';
            
            btn.textContent = '⛶ Exit Full';
            btn.classList.add('active');
            
            console.log('[PlantUML Visual Editor] Entered full page mode');
        } else {
            // Restore original styles
            try {
                const original = JSON.parse(panel.dataset.originalStyles || '{}');
                panel.style.top = original.top || '20px';
                panel.style.right = original.right || '20px';
                panel.style.left = original.left || 'auto';
                panel.style.width = original.width || '450px';
                panel.style.height = original.height || '600px';
                panel.style.maxHeight = original.maxHeight || '85vh';
                panel.style.maxWidth = original.maxWidth || '90vw';
                panel.style.borderRadius = original.borderRadius || '8px';
            } catch (e) {
                // Fallback to defaults
                panel.style.top = '20px';
                panel.style.right = '20px';
                panel.style.left = 'auto';
                panel.style.width = '450px';
                panel.style.height = '600px';
                panel.style.maxHeight = '85vh';
                panel.style.maxWidth = '90vw';
                panel.style.borderRadius = '8px';
            }
            
            btn.textContent = '⛶ Full Page';
            btn.classList.remove('active');
            
            console.log('[PlantUML Visual Editor] Exited full page mode');
        }
        
        // Update connections after resize
        setTimeout(updateConnections, 100);
    }

    /**
     * Export the diagram canvas as PNG image
     */
    function exportToPNG() {
        const canvas = document.getElementById('plantuml-canvas');
        const svg = document.getElementById('connection-svg');
        
        if (!canvas || editorState.nodes.length === 0) {
            alert('No diagram to export. Add some nodes first!');
            return;
        }
        
        // Create a canvas element for rendering
        const exportCanvas = document.createElement('canvas');
        const ctx = exportCanvas.getContext('2d');
        
        // Calculate bounds of all nodes
        let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
        
        editorState.nodes.forEach(node => {
            const rect = node.element.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            const left = rect.left - canvasRect.left;
            const top = rect.top - canvasRect.top;
            
            minX = Math.min(minX, left);
            minY = Math.min(minY, top);
            maxX = Math.max(maxX, left + rect.width);
            maxY = Math.max(maxY, top + rect.height);
        });
        
        // Add padding
        const padding = 40;
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX += padding;
        maxY += padding;
        
        const width = maxX - minX;
        const height = maxY - minY;
        
        exportCanvas.width = width * 2; // 2x for better quality
        exportCanvas.height = height * 2;
        ctx.scale(2, 2);
        
        // Fill background
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid (optional visual aid)
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < width; x += editorState.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += editorState.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw connections with edge-to-edge lines
        ctx.strokeStyle = '#00CAFF';
        ctx.lineWidth = 3;
        
        editorState.connections.forEach(conn => {
            const fromRect = conn.fromElement.getBoundingClientRect();
            const toRect = conn.toElement.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            // Calculate centers
            const fromCX = fromRect.left - canvasRect.left + fromRect.width / 2 - minX;
            const fromCY = fromRect.top - canvasRect.top + fromRect.height / 2 - minY;
            const toCX = toRect.left - canvasRect.left + toRect.width / 2 - minX;
            const toCY = toRect.top - canvasRect.top + toRect.height / 2 - minY;
            
            // Calculate edge intersection points
            const fromEdge = getEdgeIntersectionForExport(fromCX, fromCY, fromRect.width, fromRect.height, toCX, toCY);
            const toEdge = getEdgeIntersectionForExport(toCX, toCY, toRect.width, toRect.height, fromCX, fromCY);
            
            const x1 = fromEdge.x;
            const y1 = fromEdge.y;
            const x2 = toEdge.x;
            const y2 = toEdge.y;
            
            const arrowType = conn.arrowType || '->';
            
            // Set line style
            if (arrowType.includes('--')) {
                ctx.setLineDash([8, 4]);
            } else {
                ctx.setLineDash([]);
            }
            
            // Draw line
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            // Draw arrowhead(s)
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const arrowLength = 12;
            
            ctx.fillStyle = '#00CAFF';
            
            // Right arrow (at end)
            if (arrowType.includes('>')) {
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - arrowLength * Math.cos(angle - Math.PI / 6), y2 - arrowLength * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(x2 - arrowLength * Math.cos(angle + Math.PI / 6), y2 - arrowLength * Math.sin(angle + Math.PI / 6));
                ctx.closePath();
                ctx.fill();
            }
            
            // Left arrow (at start)
            if (arrowType.startsWith('<')) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x1 + arrowLength * Math.cos(angle - Math.PI / 6), y1 + arrowLength * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(x1 + arrowLength * Math.cos(angle + Math.PI / 6), y1 + arrowLength * Math.sin(angle + Math.PI / 6));
                ctx.closePath();
                ctx.fill();
            }
        });
        
        // Helper function for edge intersection in export
        function getEdgeIntersectionForExport(cx, cy, w, h, targetX, targetY) {
            const dx = targetX - cx;
            const dy = targetY - cy;
            
            if (dx === 0 && dy === 0) return { x: cx, y: cy };
            
            const halfW = w / 2;
            const halfH = h / 2;
            
            let t = Infinity;
            
            if (dx > 0) t = Math.min(t, halfW / dx);
            if (dx < 0) t = Math.min(t, -halfW / dx);
            if (dy > 0) t = Math.min(t, halfH / dy);
            if (dy < 0) t = Math.min(t, -halfH / dy);
            
            return { x: cx + dx * t, y: cy + dy * t };
        }
        
        ctx.setLineDash([]);
        
        // Draw nodes
        const nodeColors = {
            node: { bg: '#4a9eff', border: '#3a8eef' },
            actor: { bg: '#9b59b6', border: '#8e44ad' },
            class: { bg: '#27ae60', border: '#229954' },
            component: { bg: '#e67e22', border: '#d35400' },
            database: { bg: '#c0392b', border: '#a93226' }
        };
        
        editorState.nodes.forEach(node => {
            const rect = node.element.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            const x = rect.left - canvasRect.left - minX;
            const y = rect.top - canvasRect.top - minY;
            const w = rect.width;
            const h = rect.height;
            
            const colors = nodeColors[node.type] || nodeColors.node;
            
            // Draw node background
            ctx.fillStyle = colors.bg;
            ctx.strokeStyle = colors.border;
            ctx.lineWidth = 2;
            
            if (node.type === 'actor') {
                // Draw circle for actor
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            } else if (node.type === 'database') {
                // Draw rounded bottom for database
                ctx.beginPath();
                ctx.roundRect(x, y, w, h, [4, 4, 15, 15]);
                ctx.fill();
                ctx.stroke();
            } else {
                // Draw rounded rectangle
                ctx.beginPath();
                ctx.roundRect(x, y, w, h, 6);
                ctx.fill();
                ctx.stroke();
            }
            
            // Draw label
            const label = node.element.querySelector('.plantuml-node-label').textContent;
            ctx.fillStyle = '#ffffff';
            ctx.font = '11px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x + w / 2, y + h / 2);
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'diagram-' + new Date().toISOString().slice(0, 10) + '.png';
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
        
        const btn = document.getElementById('export-png');
        const originalText = btn.textContent;
        btn.textContent = '✓ Exported!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
        
        console.log('[PlantUML Visual Editor] Diagram exported as PNG');
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
