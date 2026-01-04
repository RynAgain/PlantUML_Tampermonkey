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
        gridSize: 20,            // Grid size for snap
        showGrid: true,          // Show grid on canvas
        // Pan and zoom state
        zoom: 1,                 // Current zoom level (1 = 100%)
        minZoom: 0.25,           // Minimum zoom (25%)
        maxZoom: 3,              // Maximum zoom (300%)
        panX: 0,                 // Pan offset X
        panY: 0,                 // Pan offset Y
        isPanning: false,        // Is currently panning
        panStartX: 0,            // Pan start position X
        panStartY: 0             // Pan start position Y
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
                    <button class="plantuml-editor-btn secondary" id="snap-to-grid">📐 Snap</button>
                    <button class="plantuml-editor-btn secondary" id="auto-layout">🔀 Auto Layout</button>
                    <button class="plantuml-editor-btn secondary active" id="toggle-grid">▦ Grid</button>
                    <button class="plantuml-editor-btn secondary" id="full-page-mode">⛶ Full Page</button>
                    <button class="plantuml-editor-btn" id="export-png">📷 Export PNG</button>
                </div>

                <div class="plantuml-zoom-controls">
                    <button class="plantuml-editor-btn secondary" id="zoom-out" title="Zoom Out">−</button>
                    <span class="plantuml-zoom-level" id="zoom-level">100%</span>
                    <button class="plantuml-editor-btn secondary" id="zoom-in" title="Zoom In">+</button>
                    <button class="plantuml-editor-btn secondary" id="zoom-reset" title="Reset View">⟲ Reset</button>
                    <button class="plantuml-editor-btn secondary" id="zoom-fit" title="Fit to View">⊡ Fit</button>
                    <span class="plantuml-pan-hint">Hold Ctrl + drag to pan</span>
                </div>

                <div class="plantuml-canvas-container" id="canvas-container">
                    <div class="plantuml-canvas-viewport" id="canvas-viewport">
                        <svg class="plantuml-connection" id="connection-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
                        </svg>
                        <div class="plantuml-canvas show-grid" id="plantuml-canvas"></div>
                    </div>
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

        // Auto layout
        document.getElementById('auto-layout')?.addEventListener('click', autoLayoutNodes);

        // Toggle grid
        document.getElementById('toggle-grid')?.addEventListener('click', toggleGrid);

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

        // Zoom controls
        document.getElementById('zoom-in')?.addEventListener('click', () => zoomCanvas(0.25));
        document.getElementById('zoom-out')?.addEventListener('click', () => zoomCanvas(-0.25));
        document.getElementById('zoom-reset')?.addEventListener('click', resetView);
        document.getElementById('zoom-fit')?.addEventListener('click', fitToView);

        // Mouse wheel zoom on canvas container
        const canvasContainer = document.getElementById('canvas-container');
        canvasContainer?.addEventListener('wheel', handleWheelZoom, { passive: false });

        // Pan functionality (Shift + drag or middle mouse button)
        canvasContainer?.addEventListener('mousedown', handlePanStart);
        document.addEventListener('mousemove', handlePanMove);
        document.addEventListener('mouseup', handlePanEnd);

        // Load persisted settings
        loadPersistedSettings();

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
     * Accounts for zoom level when calculating drag distance
     * @param {HTMLElement} node - Node element to make draggable
     */
    function makeDraggableNode(node) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        node.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target.contentEditable === 'true') return;
            // Don't start drag if we're in panning mode (Ctrl+click)
            if (e.ctrlKey) return;
            e.preventDefault();
            e.stopPropagation();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            // Calculate delta in screen coordinates
            const deltaX = e.clientX - pos3;
            const deltaY = e.clientY - pos4;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Adjust delta by zoom level - divide by zoom to get actual canvas movement
            const adjustedDeltaX = deltaX / editorState.zoom;
            const adjustedDeltaY = deltaY / editorState.zoom;
            
            // Apply adjusted movement
            node.style.top = (node.offsetTop + adjustedDeltaY) + "px";
            node.style.left = (node.offsetLeft + adjustedDeltaX) + "px";
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
     * Uses node positions (style.left/top) instead of getBoundingClientRect
     * to work correctly with zoom/pan transforms
     */
    function updateConnections() {
        const svg = document.getElementById('connection-svg');
        const canvas = document.getElementById('plantuml-canvas');
        if (!svg || !canvas) return;

        // Calculate the required size based on all nodes using their actual positions
        let maxX = 250, maxY = 250;
        editorState.nodes.forEach(node => {
            const left = parseInt(node.element.style.left) || 0;
            const top = parseInt(node.element.style.top) || 0;
            const width = node.element.offsetWidth;
            const height = node.element.offsetHeight;
            const right = left + width + 20;
            const bottom = top + height + 20;
            maxX = Math.max(maxX, right);
            maxY = Math.max(maxY, bottom);
        });

        // Set SVG size to cover all content
        svg.style.width = maxX + 'px';
        svg.style.height = maxY + 'px';
        svg.setAttribute('viewBox', `0 0 ${maxX} ${maxY}`);
        
        // Also ensure canvas is big enough
        canvas.style.minWidth = maxX + 'px';
        canvas.style.minHeight = maxY + 'px';

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
            // Use actual node positions instead of getBoundingClientRect
            // This ensures connections work correctly with zoom/pan
            const fromLeft = parseInt(conn.fromElement.style.left) || 0;
            const fromTop = parseInt(conn.fromElement.style.top) || 0;
            const fromWidth = conn.fromElement.offsetWidth;
            const fromHeight = conn.fromElement.offsetHeight;
            
            const toLeft = parseInt(conn.toElement.style.left) || 0;
            const toTop = parseInt(conn.toElement.style.top) || 0;
            const toWidth = conn.toElement.offsetWidth;
            const toHeight = conn.toElement.offsetHeight;

            // Calculate centers
            const fromCX = fromLeft + fromWidth / 2;
            const fromCY = fromTop + fromHeight / 2;
            const toCX = toLeft + toWidth / 2;
            const toCY = toTop + toHeight / 2;
            
            // Calculate edge intersection points (so arrows don't go through nodes)
            const fromEdge = getEdgeIntersection(fromCX, fromCY, fromWidth, fromHeight, toCX, toCY);
            const toEdge = getEdgeIntersection(toCX, toCY, toWidth, toHeight, fromCX, fromCY);

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
     * Auto-layout nodes based on their connections using a force-directed algorithm
     * This arranges nodes so connected nodes are closer together and non-connected nodes spread out
     * Takes into account actual node sizes to prevent overlapping
     */
    function autoLayoutNodes() {
        if (editorState.nodes.length === 0) {
            alert('No nodes to layout. Add some nodes first!');
            return;
        }

        const gridSize = editorState.gridSize;
        const minNodeSpacing = 40; // Minimum gap between nodes (for arrows)
        const iterations = 150; // Number of simulation iterations
        
        // Build adjacency information with actual node sizes
        const nodeMap = new Map();
        editorState.nodes.forEach((node, index) => {
            const element = node.element;
            const width = element.offsetWidth || 80;
            const height = element.offsetHeight || 40;
            
            nodeMap.set(node.id, {
                index: index,
                node: node,
                x: parseInt(element.style.left) || 50 + index * 150,
                y: parseInt(element.style.top) || 50,
                width: width,
                height: height,
                vx: 0,
                vy: 0,
                connections: [],
                outgoing: [],
                incoming: []
            });
        });
        
        // Map connections with direction
        editorState.connections.forEach(conn => {
            const fromNode = nodeMap.get(conn.from);
            const toNode = nodeMap.get(conn.to);
            if (fromNode && toNode) {
                fromNode.connections.push(conn.to);
                fromNode.outgoing.push(conn.to);
                toNode.connections.push(conn.from);
                toNode.incoming.push(conn.from);
            }
        });
        
        const nodes = Array.from(nodeMap.values());
        
        // Find root nodes (nodes with no incoming connections or actors)
        const incomingCount = new Map();
        editorState.nodes.forEach(n => incomingCount.set(n.id, 0));
        editorState.connections.forEach(conn => {
            incomingCount.set(conn.to, (incomingCount.get(conn.to) || 0) + 1);
        });
        
        // Identify layers using topological sort (for hierarchical layout)
        const layers = [];
        const visited = new Set();
        const nodeLayer = new Map();
        
        // Start with root nodes (no incoming connections or actors)
        let currentLayer = nodes.filter(n =>
            incomingCount.get(n.node.id) === 0 || n.node.type === 'actor'
        );
        
        if (currentLayer.length === 0) {
            // No clear roots, start with first node
            currentLayer = [nodes[0]];
        }
        
        let layerIndex = 0;
        while (currentLayer.length > 0 && visited.size < nodes.length) {
            layers.push(currentLayer);
            currentLayer.forEach(n => {
                visited.add(n.node.id);
                nodeLayer.set(n.node.id, layerIndex);
            });
            
            // Find next layer (nodes connected from current layer via outgoing connections)
            const nextLayerSet = new Set();
            currentLayer.forEach(n => {
                n.outgoing.forEach(connId => {
                    if (!visited.has(connId)) {
                        const connNode = nodeMap.get(connId);
                        if (connNode) {
                            nextLayerSet.add(connNode);
                        }
                    }
                });
            });
            
            currentLayer = Array.from(nextLayerSet);
            layerIndex++;
            
            // Safety check to prevent infinite loop
            if (layerIndex > nodes.length) break;
        }
        
        // Add any remaining unvisited nodes to the last layer
        const remaining = nodes.filter(n => !visited.has(n.node.id));
        if (remaining.length > 0) {
            layers.push(remaining);
        }
        
        // Calculate layer widths based on actual node sizes
        const layerWidths = layers.map(layer => {
            return Math.max(...layer.map(n => n.width));
        });
        
        // Position nodes based on layers (hierarchical layout)
        const startX = 60;
        const startY = 60;
        const arrowSpace = 60; // Space for arrows between layers
        
        let currentX = startX;
        layers.forEach((layer, lIndex) => {
            // Calculate total height needed for this layer
            const totalHeight = layer.reduce((sum, n) => sum + n.height + minNodeSpacing, 0) - minNodeSpacing;
            let currentY = Math.max(startY, (500 - totalHeight) / 2); // Center vertically
            
            layer.forEach((nodeData) => {
                nodeData.x = currentX;
                nodeData.y = currentY;
                currentY += nodeData.height + minNodeSpacing;
            });
            
            // Move to next layer position
            currentX += layerWidths[lIndex] + arrowSpace;
        });
        
        // Apply force-directed refinement for better spacing
        // Use stronger repulsion to prevent overlap
        const repulsionStrength = 8000;
        const attractionStrength = 0.03;
        const damping = 0.85;
        const coolingFactor = 0.98; // Gradually reduce movement
        
        let temperature = 1.0;
        
        for (let i = 0; i < iterations; i++) {
            // Reset velocities
            nodes.forEach(n => {
                n.vx = 0;
                n.vy = 0;
            });
            
            // Repulsion between all nodes - based on actual overlap
            for (let j = 0; j < nodes.length; j++) {
                for (let k = j + 1; k < nodes.length; k++) {
                    const n1 = nodes[j];
                    const n2 = nodes[k];
                    
                    // Calculate center-to-center distance
                    const cx1 = n1.x + n1.width / 2;
                    const cy1 = n1.y + n1.height / 2;
                    const cx2 = n2.x + n2.width / 2;
                    const cy2 = n2.y + n2.height / 2;
                    
                    const dx = cx2 - cx1;
                    const dy = cy2 - cy1;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    
                    // Calculate minimum distance to avoid overlap (including arrow space)
                    const minDistX = (n1.width + n2.width) / 2 + minNodeSpacing;
                    const minDistY = (n1.height + n2.height) / 2 + minNodeSpacing;
                    const minDist = Math.sqrt(minDistX * minDistX + minDistY * minDistY) / 1.5;
                    
                    // Apply repulsion if nodes are too close
                    if (dist < minDist * 1.5) {
                        const force = repulsionStrength / (dist * dist);
                        const fx = (dx / dist) * force * temperature;
                        const fy = (dy / dist) * force * temperature;
                        
                        n1.vx -= fx;
                        n1.vy -= fy;
                        n2.vx += fx;
                        n2.vy += fy;
                    }
                    
                    // Extra strong repulsion if actually overlapping
                    const overlapX = (n1.width + n2.width) / 2 + minNodeSpacing - Math.abs(dx);
                    const overlapY = (n1.height + n2.height) / 2 + minNodeSpacing - Math.abs(dy);
                    
                    if (overlapX > 0 && overlapY > 0) {
                        // Nodes are overlapping - apply strong separation force
                        const separationForce = 50;
                        const fx = (dx === 0 ? (Math.random() - 0.5) : dx / Math.abs(dx)) * separationForce;
                        const fy = (dy === 0 ? (Math.random() - 0.5) : dy / Math.abs(dy)) * separationForce;
                        
                        n1.vx -= fx;
                        n1.vy -= fy;
                        n2.vx += fx;
                        n2.vy += fy;
                    }
                }
            }
            
            // Attraction along connections
            editorState.connections.forEach(conn => {
                const n1 = nodeMap.get(conn.from);
                const n2 = nodeMap.get(conn.to);
                
                if (n1 && n2) {
                    const cx1 = n1.x + n1.width / 2;
                    const cy1 = n1.y + n1.height / 2;
                    const cx2 = n2.x + n2.width / 2;
                    const cy2 = n2.y + n2.height / 2;
                    
                    const dx = cx2 - cx1;
                    const dy = cy2 - cy1;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    
                    // Ideal distance for connected nodes (enough space for arrow)
                    const idealDist = (n1.width + n2.width) / 2 + arrowSpace;
                    
                    // Only apply attraction if nodes are far apart
                    if (dist > idealDist) {
                        const force = (dist - idealDist) * attractionStrength * temperature;
                        const fx = (dx / dist) * force;
                        const fy = (dy / dist) * force;
                        
                        n1.vx += fx;
                        n1.vy += fy;
                        n2.vx -= fx;
                        n2.vy -= fy;
                    }
                }
            });
            
            // Apply velocities with damping
            nodes.forEach(n => {
                n.x += n.vx * damping;
                n.y += n.vy * damping;
                
                // Keep nodes within bounds
                n.x = Math.max(20, n.x);
                n.y = Math.max(20, n.y);
            });
            
            // Cool down
            temperature *= coolingFactor;
        }
        
        // Final overlap resolution pass
        for (let pass = 0; pass < 10; pass++) {
            let hasOverlap = false;
            
            for (let j = 0; j < nodes.length; j++) {
                for (let k = j + 1; k < nodes.length; k++) {
                    const n1 = nodes[j];
                    const n2 = nodes[k];
                    
                    const overlapX = (n1.width + n2.width) / 2 + minNodeSpacing - Math.abs((n1.x + n1.width/2) - (n2.x + n2.width/2));
                    const overlapY = (n1.height + n2.height) / 2 + minNodeSpacing - Math.abs((n1.y + n1.height/2) - (n2.y + n2.height/2));
                    
                    if (overlapX > 0 && overlapY > 0) {
                        hasOverlap = true;
                        // Push apart in the direction of least overlap
                        if (overlapX < overlapY) {
                            const pushX = overlapX / 2 + 5;
                            if (n1.x < n2.x) {
                                n1.x -= pushX;
                                n2.x += pushX;
                            } else {
                                n1.x += pushX;
                                n2.x -= pushX;
                            }
                        } else {
                            const pushY = overlapY / 2 + 5;
                            if (n1.y < n2.y) {
                                n1.y -= pushY;
                                n2.y += pushY;
                            } else {
                                n1.y += pushY;
                                n2.y -= pushY;
                            }
                        }
                    }
                }
            }
            
            if (!hasOverlap) break;
        }
        
        // Snap to grid and apply positions
        nodes.forEach(nodeData => {
            const snappedX = Math.round(Math.max(20, nodeData.x) / gridSize) * gridSize;
            const snappedY = Math.round(Math.max(20, nodeData.y) / gridSize) * gridSize;
            
            nodeData.node.element.style.left = snappedX + 'px';
            nodeData.node.element.style.top = snappedY + 'px';
        });
        
        updateConnections();
        
        const btn = document.getElementById('auto-layout');
        const originalText = btn.textContent;
        btn.textContent = '✓ Arranged!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1500);
        
        console.log('[PlantUML Visual Editor] Auto-layout applied (' + layers.length + ' layers, ' + nodes.length + ' nodes)');
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
        
        // Persist the setting
        savePersistedSettings();
        
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

    /**
     * Zoom the canvas by a delta amount
     * @param {number} delta - Amount to zoom (positive = zoom in, negative = zoom out)
     */
    function zoomCanvas(delta) {
        const newZoom = Math.max(editorState.minZoom, Math.min(editorState.maxZoom, editorState.zoom + delta));
        
        if (newZoom !== editorState.zoom) {
            editorState.zoom = newZoom;
            applyViewTransform();
            updateZoomDisplay();
            console.log('[PlantUML Visual Editor] Zoom level:', Math.round(newZoom * 100) + '%');
        }
    }

    /**
     * Set zoom to a specific level
     * @param {number} level - Zoom level (1 = 100%)
     */
    function setZoom(level) {
        editorState.zoom = Math.max(editorState.minZoom, Math.min(editorState.maxZoom, level));
        applyViewTransform();
        updateZoomDisplay();
    }

    /**
     * Handle mouse wheel zoom
     * @param {WheelEvent} e - Wheel event
     */
    function handleWheelZoom(e) {
        // Only zoom if Ctrl is held or if it's a pinch gesture
        if (!e.ctrlKey && !e.metaKey) return;
        
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(editorState.minZoom, Math.min(editorState.maxZoom, editorState.zoom + delta));
        
        if (newZoom !== editorState.zoom) {
            // Get mouse position relative to canvas container
            const container = document.getElementById('canvas-container');
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Calculate the point under the mouse in canvas coordinates
            const canvasX = (mouseX - editorState.panX) / editorState.zoom;
            const canvasY = (mouseY - editorState.panY) / editorState.zoom;
            
            // Update zoom
            editorState.zoom = newZoom;
            
            // Adjust pan to keep the point under the mouse
            editorState.panX = mouseX - canvasX * newZoom;
            editorState.panY = mouseY - canvasY * newZoom;
            
            applyViewTransform();
            updateZoomDisplay();
        }
    }

    /**
     * Handle pan start (Ctrl + drag or middle mouse button)
     * @param {MouseEvent} e - Mouse event
     */
    function handlePanStart(e) {
        // Start panning with Ctrl + left click or middle mouse button
        if ((e.ctrlKey && e.button === 0) || e.button === 1) {
            e.preventDefault();
            editorState.isPanning = true;
            editorState.panStartX = e.clientX - editorState.panX;
            editorState.panStartY = e.clientY - editorState.panY;
            
            const container = document.getElementById('canvas-container');
            if (container) {
                container.style.cursor = 'grabbing';
            }
        }
    }

    /**
     * Handle pan move
     * @param {MouseEvent} e - Mouse event
     */
    function handlePanMove(e) {
        if (!editorState.isPanning) return;
        
        e.preventDefault();
        editorState.panX = e.clientX - editorState.panStartX;
        editorState.panY = e.clientY - editorState.panStartY;
        
        applyViewTransform();
    }

    /**
     * Handle pan end
     * @param {MouseEvent} e - Mouse event
     */
    function handlePanEnd(e) {
        if (editorState.isPanning) {
            editorState.isPanning = false;
            
            const container = document.getElementById('canvas-container');
            if (container) {
                container.style.cursor = '';
            }
        }
    }

    /**
     * Apply the current zoom and pan transform to the viewport
     */
    function applyViewTransform() {
        const viewport = document.getElementById('canvas-viewport');
        if (!viewport) return;
        
        viewport.style.transform = `translate(${editorState.panX}px, ${editorState.panY}px) scale(${editorState.zoom})`;
        viewport.style.transformOrigin = '0 0';
        
        // Update connections after transform
        updateConnections();
    }

    /**
     * Update the zoom level display
     */
    function updateZoomDisplay() {
        const zoomLevel = document.getElementById('zoom-level');
        if (zoomLevel) {
            zoomLevel.textContent = Math.round(editorState.zoom * 100) + '%';
        }
    }

    /**
     * Reset view to default (100% zoom, no pan)
     */
    function resetView() {
        editorState.zoom = 1;
        editorState.panX = 0;
        editorState.panY = 0;
        
        applyViewTransform();
        updateZoomDisplay();
        
        const btn = document.getElementById('zoom-reset');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✓ Reset!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1000);
        }
        
        console.log('[PlantUML Visual Editor] View reset to default');
    }

    /**
     * Fit all nodes into the visible viewport
     */
    function fitToView() {
        if (editorState.nodes.length === 0) {
            resetView();
            return;
        }
        
        const container = document.getElementById('canvas-container');
        const canvas = document.getElementById('plantuml-canvas');
        if (!container || !canvas) return;
        
        // Calculate bounds of all nodes
        let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
        
        editorState.nodes.forEach(node => {
            const left = parseInt(node.element.style.left) || 0;
            const top = parseInt(node.element.style.top) || 0;
            const width = node.element.offsetWidth;
            const height = node.element.offsetHeight;
            
            minX = Math.min(minX, left);
            minY = Math.min(minY, top);
            maxX = Math.max(maxX, left + width);
            maxY = Math.max(maxY, top + height);
        });
        
        // Add padding
        const padding = 40;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;
        
        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;
        
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Calculate zoom to fit
        const zoomX = containerWidth / contentWidth;
        const zoomY = containerHeight / contentHeight;
        const newZoom = Math.min(zoomX, zoomY, editorState.maxZoom);
        
        // Calculate pan to center
        const scaledWidth = contentWidth * newZoom;
        const scaledHeight = contentHeight * newZoom;
        
        editorState.zoom = Math.max(editorState.minZoom, newZoom);
        editorState.panX = (containerWidth - scaledWidth) / 2 - minX * editorState.zoom;
        editorState.panY = (containerHeight - scaledHeight) / 2 - minY * editorState.zoom;
        
        applyViewTransform();
        updateZoomDisplay();
        
        const btn = document.getElementById('zoom-fit');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✓ Fit!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1000);
        }
        
        console.log('[PlantUML Visual Editor] View fitted to content');
    }

    /**
     * Toggle grid visibility on the canvas
     */
    function toggleGrid() {
        editorState.showGrid = !editorState.showGrid;
        const btn = document.getElementById('toggle-grid');
        const canvas = document.getElementById('plantuml-canvas');
        
        if (editorState.showGrid) {
            btn.classList.add('active');
            btn.textContent = '▦ Grid';
            canvas?.classList.add('show-grid');
        } else {
            btn.classList.remove('active');
            btn.textContent = '▢ Grid';
            canvas?.classList.remove('show-grid');
        }
        
        // Persist the setting
        savePersistedSettings();
        
        console.log('[PlantUML Visual Editor] Grid visibility:', editorState.showGrid);
    }

    /**
     * Load persisted settings from storage
     */
    function loadPersistedSettings() {
        try {
            let settingsStr;
            if (typeof GM_getValue !== 'undefined') {
                settingsStr = GM_getValue('plantUMLSettings', null);
            } else {
                settingsStr = localStorage.getItem('plantUMLSettings');
            }

            if (settingsStr) {
                const settings = JSON.parse(settingsStr);
                
                // Apply full page mode if it was enabled
                if (settings.isFullPage) {
                    // Delay to ensure DOM is ready
                    setTimeout(() => {
                        if (!editorState.isFullPage) {
                            toggleFullPageMode();
                        }
                    }, 100);
                }
                
                // Apply grid visibility
                if (settings.showGrid !== undefined) {
                    editorState.showGrid = settings.showGrid;
                    const btn = document.getElementById('toggle-grid');
                    const canvas = document.getElementById('plantuml-canvas');
                    
                    if (editorState.showGrid) {
                        btn?.classList.add('active');
                        if (btn) btn.textContent = '▦ Grid';
                        canvas?.classList.add('show-grid');
                    } else {
                        btn?.classList.remove('active');
                        if (btn) btn.textContent = '▢ Grid';
                        canvas?.classList.remove('show-grid');
                    }
                }
                
                console.log('[PlantUML Visual Editor] Settings loaded:', settings);
            }
        } catch (error) {
            console.error('[PlantUML Visual Editor] Error loading settings:', error);
        }
    }

    /**
     * Save persisted settings to storage
     */
    function savePersistedSettings() {
        try {
            const settings = {
                isFullPage: editorState.isFullPage,
                showGrid: editorState.showGrid
            };

            if (typeof GM_setValue !== 'undefined') {
                GM_setValue('plantUMLSettings', JSON.stringify(settings));
            } else {
                localStorage.setItem('plantUMLSettings', JSON.stringify(settings));
            }
            
            console.log('[PlantUML Visual Editor] Settings saved:', settings);
        } catch (error) {
            console.error('[PlantUML Visual Editor] Error saving settings:', error);
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
