"use client";

import React, { useCallback } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";

import { Edge, Node } from "reactflow";

interface WorkspaceProps {
  nodes: Node[];
  edges: any[];
  nodeTypes: any;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onPaneClick: () => void;
  onEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
  selectedNode: Node | null;
  selectedEdge: Edge | null;
}

export const Workspace = ({
  nodes,
  edges,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  selectedNode,
  selectedEdge,
  onEdgeClick,
}: WorkspaceProps) => {
  const reactFlowInstance = useReactFlow();

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // Get the current viewport scroll and zoom
      const { project } = reactFlowInstance;

      // Calculate the position relative to the ReactFlow viewport
      const position = project({
        x: event.clientX - event.currentTarget.getBoundingClientRect().left,
        y: event.clientY - event.currentTarget.getBoundingClientRect().top,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      onNodesChange([
        {
          type: "add",
          item: newNode,
        },
      ]);
    },
    [onNodesChange, reactFlowInstance],
  );

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  return (
    <div className="flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        onEdgeClick={onEdgeClick}
        multiSelectionKeyCode={null}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
