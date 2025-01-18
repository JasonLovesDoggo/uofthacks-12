"use client";

import React, { useCallback, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from "reactflow";
import { toast } from "sonner";

import "reactflow/dist/style.css";

import { Pencil } from "lucide-react";
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
  title: string;
  onSubmit: (newTitle: string) => void;
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
  title,
  onSubmit,
}: WorkspaceProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSubmit(currentTitle);
    toast.success("Workflow title updated");
  };

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
    <div className="relative flex-1">
      <div className="absolute left-4 top-4 z-50">
        {isEditing ? (
          <input
            type="text"
            value={currentTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            autoFocus
            className="border-b-2 border-gray-300 bg-transparent text-lg font-semibold focus:border-blue-500 focus:outline-none"
          />
        ) : (
          <div className="group flex items-center gap-1.5 border-b-2">
            <h1 className="cursor-pointer text-lg font-semibold text-gray-500">
              {currentTitle}
            </h1>
            <button
              className="text-gray-500 focus:outline-none group-hover:text-blue-500"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="size-4" />
            </button>
          </div>
        )}
      </div>

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
