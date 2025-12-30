// PlantUML Helper - Data Module
// This module contains all PlantUML reference data and examples

(function() {
    'use strict';

    console.log('[PlantUML Data] Module loaded');

    // Make data globally accessible for other modules
    window.PlantUMLData = {
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

    // Export for testing
    try {
        module.exports = { data: window.PlantUMLData };
    } catch (e) {
        // Browser environment
    }
})();
