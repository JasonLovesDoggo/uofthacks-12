"use client";

import React, { useCallback, useState } from "react";
import {
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";

import {
  ActionNode,
  ConditionNode,
  TriggerNode,
} from "@/components/workflow/nodes";

import { BlockPalette } from "./components/BlockPalette";
import { Workspace } from "./components/Workspace";

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [workflowTitle, setWorkflowTitle] = useState("New Workflow");

  const handleTitleUpdate = (newTitle: string) => {
    setWorkflowTitle(newTitle);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      // Handle node creation from drag-and-drop
      if (changes.type === "add") {
        const newNode = changes.item;
        setNodes((nds) => [...nds, newNode]);
      } else {
        onNodesChange(changes);
      }
    },
    [onNodesChange, setNodes],
  );

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle edge selection
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  // Handle background click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // Handle delete key press
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedNode) {
          setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
          setSelectedNode(null);
        }
        if (selectedEdge) {
          setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
          setSelectedEdge(null);
        }
      }
    },
    [selectedNode, selectedEdge, setNodes, setEdges],
  );

  // Add and remove keyboard listener
  React.useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <ReactFlowProvider>
      <div className="flex h-full">
        <BlockPalette />

        <Workspace
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onEdgeClick={onEdgeClick}
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          title={workflowTitle}
          onSubmit={handleTitleUpdate}
        />

        {selectedNode && (
          <div className="w-96 border-l bg-gray-50 p-4">
            <h2 className="mb-4 text-lg font-semibold">Node Configuration</h2>
            {/* Configuration form will go here */}
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
