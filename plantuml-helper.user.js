// ==UserScript==
// @name         PlantUML Helper - Reference Guide & GUI Aid
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Comprehensive reference guide and visual GUI editor for PlantUML diagrams with syntax help, examples, and drag-and-drop diagram builder
// @author       Your Name
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles
    GM_addStyle(`
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
    `);

    // PlantUML reference data
    const plantUMLData = {
        basics: [
            {
                title: "Basic Diagram Structure",
                code: "@startuml\n' Your diagram content here\n@enduml",
                description: "Every PlantUML diagram starts with @startuml and ends with @enduml"
            },
            {
                title: "Comments",
                code: "' Single line comment\n/' Multi-line\n   comment '/",
                description: "Use ' for single-line or /' '/ for multi-line comments"
            },
            {
                title: "Title",
                code: "title My Diagram Title",
                description: "Add a title to your diagram"
            },
            {
                title: "Header and Footer",
                code: "header Page Header\nfooter Page Footer",
                description: "Add header and footer text to your diagram"
            }
        ],
        sequence: [
            {
                title: "Basic Message",
                code: "Alice -> Bob: Hello\nBob --> Alice: Hi back",
                description: "-> for solid arrow, --> for dashed arrow"
            },
            {
                title: "Participants",
                code: "participant Alice\nactor Bob\nboundary System\ncontrol Controller\nentity Database\ndatabase DB",
                description: "Different participant types for sequence diagrams"
            },
            {
                title: "Activation/Deactivation",
                code: "Alice -> Bob: Request\nactivate Bob\nBob --> Alice: Response\ndeactivate Bob",
                description: "Show when a participant is active"
            },
            {
                title: "Self Message",
                code: "Alice -> Alice: Think",
                description: "Message to self"
            },
            {
                title: "Alt/Else Block",
                code: "alt successful case\n  Alice -> Bob: Success\nelse failure case\n  Alice -> Bob: Failure\nend",
                description: "Alternative paths in sequence"
            },
            {
                title: "Loop",
                code: "loop 1000 times\n  Alice -> Bob: Request\n  Bob --> Alice: Response\nend",
                description: "Repeat a sequence"
            },
            {
                title: "Note",
                code: "note left of Alice: This is a note\nnote right of Bob: Another note\nnote over Alice,Bob: Note spanning both",
                description: "Add notes to sequence diagrams"
            }
        ],
        class: [
            {
                title: "Basic Class",
                code: "class ClassName {\n  +publicField\n  -privateField\n  #protectedField\n  ~packageField\n  +method()\n}",
                description: "+ public, - private, # protected, ~ package"
            },
            {
                title: "Relationships",
                code: "ClassA <|-- ClassB : Inheritance\nClassA *-- ClassB : Composition\nClassA o-- ClassB : Aggregation\nClassA --> ClassB : Association\nClassA ..> ClassB : Dependency\nClassA ..|> ClassB : Realization",
                description: "Different types of class relationships"
            },
            {
                title: "Abstract Class",
                code: "abstract class AbstractClass {\n  {abstract} +abstractMethod()\n}",
                description: "Define abstract classes and methods"
            },
            {
                title: "Interface",
                code: "interface InterfaceName {\n  +method1()\n  +method2()\n}",
                description: "Define an interface"
            },
            {
                title: "Enum",
                code: "enum Status {\n  PENDING\n  APPROVED\n  REJECTED\n}",
                description: "Define an enumeration"
            }
        ],
        usecase: [
            {
                title: "Basic Use Case",
                code: "actor User\nUser --> (Use Case)\n(Use Case) --> (Another Use Case)",
                description: "Basic use case diagram structure"
            },
            {
                title: "System Boundary",
                code: "rectangle System {\n  (Use Case 1)\n  (Use Case 2)\n}",
                description: "Define system boundaries"
            },
            {
                title: "Relationships",
                code: "(Base) <|-- (Extended) : extends\n(Base) <.. (Included) : includes",
                description: "Use case relationships: extends and includes"
            }
        ],
        activity: [
            {
                title: "Basic Activity",
                code: "start\n:Activity 1;\n:Activity 2;\nstop",
                description: "Basic activity diagram flow"
            },
            {
                title: "Conditional",
                code: "if (condition?) then (yes)\n  :Activity A;\nelse (no)\n  :Activity B;\nendif",
                description: "Conditional branching"
            },
            {
                title: "While Loop",
                code: "while (condition?) is (yes)\n  :Activity;\nendwhile (no)",
                description: "While loop in activity diagram"
            },
            {
                title: "Fork/Join",
                code: "fork\n  :Activity 1;\nfork again\n  :Activity 2;\nend fork",
                description: "Parallel activities"
            }
        ],
        state: [
            {
                title: "Basic State",
                code: "[*] --> State1\nState1 --> State2\nState2 --> [*]",
                description: "Basic state machine with start and end"
            },
            {
                title: "State with Actions",
                code: "State1 : entry / action1\nState1 : do / action2\nState1 : exit / action3",
                description: "States with entry, do, and exit actions"
            },
            {
                title: "Composite State",
                code: "state CompositeState {\n  [*] --> SubState1\n  SubState1 --> SubState2\n  SubState2 --> [*]\n}",
                description: "State containing sub-states"
            }
        ],
        component: [
            {
                title: "Basic Component",
                code: "[Component1]\n[Component2]\nComponent1 --> Component2",
                description: "Basic component diagram"
            },
            {
                title: "Component Types",
                code: "component [Component]\ninterface Interface\ndatabase Database\ncloud Cloud\nnode Node",
                description: "Different component types"
            }
        ],
        styling: [
            {
                title: "Colors",
                code: "class MyClass #lightblue\nMyClass : field #pink",
                description: "Add colors using # followed by color name or hex"
            },
            {
                title: "Skinparam",
                code: "skinparam backgroundColor #EEEBDC\nskinparam handwritten true\nskinparam classBackgroundColor lightblue",
                description: "Global styling with skinparam"
            },
            {
                title: "Line Style",
                code: "A -[bold]-> B\nC -[dashed]-> D\nE -[dotted]-> F",
                description: "Different line styles"
            }
        ]
    };

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

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'plantuml-toggle-btn';
    toggleBtn.className = 'plantuml-toggle-btn';
    toggleBtn.textContent = '📊 PlantUML Helper';
    toggleBtn.addEventListener('click', togglePanel);
    document.body.appendChild(toggleBtn);

    // Create main panel
    const panel = document.createElement('div');
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

    // Generate tab contents
    const tabContents = document.getElementById('plantuml-tab-contents');

    // Add Visual Editor tab first
    const editorTab = createVisualEditorTab();
    tabContents.appendChild(editorTab);

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
                <div class="plantuml-code">${escapeHtml(item.code)}</div>
                <div class="plantuml-description">${item.description}</div>
                <button class="plantuml-copy-btn" data-code="${escapeHtml(item.code)}">Copy Code</button>
            `;
            section.appendChild(itemDiv);
        });

        tabContent.appendChild(section);
        tabContents.appendChild(tabContent);
    });

    // Event listeners
    document.getElementById('plantuml-close').addEventListener('click', togglePanel);

    document.querySelectorAll('.plantuml-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;

            // Update active tab
            document.querySelectorAll('.plantuml-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update active content
            document.querySelectorAll('.plantuml-tab-content').forEach(c => c.classList.remove('active'));
            document.querySelector(`.plantuml-tab-content[data-tab="${tabName}"]`).classList.add('active');
        });
    });

    // Copy button functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('plantuml-copy-btn')) {
            const code = e.target.dataset.code;
            copyToClipboard(unescapeHtml(code));

            const originalText = e.target.textContent;
            e.target.textContent = '✓ Copied!';
            setTimeout(() => {
                e.target.textContent = originalText;
            }, 2000);
        }
    });

    // Search functionality
    document.getElementById('plantuml-search').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.plantuml-item');

        items.forEach(item => {
            const title = item.querySelector('.plantuml-item-title').textContent.toLowerCase();
            const code = item.querySelector('.plantuml-code').textContent.toLowerCase();
            const description = item.querySelector('.plantuml-description').textContent.toLowerCase();

            if (title.includes(searchTerm) || code.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Make panel draggable
    makeDraggable(panel, document.querySelector('.plantuml-header'));

    // Initialize editor after DOM is ready
    setTimeout(() => {
        initializeVisualEditor();
    }, 100);

    // Visual Editor Functions
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

    function initializeVisualEditor() {
        const canvas = document.getElementById('plantuml-canvas');
        if (!canvas) return;

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

    function selectNode(node) {
        document.querySelectorAll('.plantuml-node').forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');
        editorState.selectedNode = node;
    }

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

    function copyGeneratedCode() {
        const code = document.getElementById('output-code').textContent;
        if (code && !code.includes('Click "Generate Code"')) {
            copyToClipboard(code);
            const btn = document.getElementById('copy-generated');
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    }

    // Helper functions
    function togglePanel() {
        panel.classList.toggle('visible');
        if (panel.classList.contains('visible')) {
            toggleBtn.style.display = 'none';
        } else {
            toggleBtn.style.display = 'block';
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function unescapeHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent;
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
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
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Load saved state
    const savedState = GM_getValue('panelVisible', false);
    if (savedState) {
        togglePanel();
    }

    // Save state on close
    window.addEventListener('beforeunload', function() {
        GM_setValue('panelVisible', panel.classList.contains('visible'));
    });

    console.log('PlantUML Helper with Visual Editor loaded successfully!');
})();
