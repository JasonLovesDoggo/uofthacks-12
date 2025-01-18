"use client";

import React, { useCallback, useState } from "react";
import {
  addEdge,
  Connection,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { BlockPalette } from "./components/BlockPalette";
import { Workspace } from "./components/Workspace";

interface NodeData {
  label: string;
}

// Basic node components
const TriggerNode = ({ data }: { data: NodeData }) => (
  <div className="rounded-lg bg-blue-100 p-3 shadow">
    <div className="flex items-center gap-2">
      <span>⚡</span>
      <span>{data.label}</span>
    </div>
  </div>
);

const ConditionNode = ({ data }: { data: NodeData }) => (
  <div className="rounded-lg bg-green-100 p-3 shadow">
    <div className="flex items-center gap-2">
      <span>🔗</span>
      <span>{data.label}</span>
    </div>
  </div>
);

const ActionNode = ({ data }: { data: NodeData }) => (
  <div className="rounded-lg bg-red-100 p-3 shadow">
    <div className="flex items-center gap-2">
      <span>⚙️</span>
      <span>{data.label}</span>
    </div>
  </div>
);

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

  return (
    <div className="flex h-full">
      <BlockPalette />

      <Workspace
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />

      {selectedNode && (
        <div className="w-96 border-l bg-gray-50 p-4">
          <h2 className="mb-4 text-lg font-semibold">Node Configuration</h2>
          {/* Configuration form will go here */}
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
