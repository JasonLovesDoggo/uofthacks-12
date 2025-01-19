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

import Image from "next/image";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";
import { Edge, Node } from "reactflow";

import { Button } from "@/components/ui/button";

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
  onUpdateTitle: (newTitle: string) => void;
  onSubmit: () => void;
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
  onUpdateTitle,
  onSubmit,
}: WorkspaceProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateTitle(currentTitle);
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

      // Generate a unique ID for the node
      const newNode = {
        id: crypto.randomUUID(),
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
    <div className="relative flex h-full w-full flex-col">
      <nav className="flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="p-1 duration-300 hover:text-primary"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex items-center gap-1.5">
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
              <div className="group flex items-center gap-1.5">
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
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="duration-300 hover:text-primary"
            onClick={() => {
              onNodesChange([
                { type: "remove", id: nodes.map((node) => node.id) },
              ]);
              onEdgesChange([
                { type: "remove", id: edges.map((edge) => edge.id) },
              ]);
              toast.success("Workflow cleared");
            }}
          >
            <Trash2 className="size-5" />
          </Button>
          <Button onClick={onSubmit}>
            <Save className="mr-2 h-5 w-5" />
            Save
          </Button>
        </div>
      </nav>

      <div className="relative flex-1">
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h3 className="font-montserrat text-xl font-semibold text-gray-500">
              Add a block to get started.
            </h3>
            <p className="mb-4 font-semibold text-gray-400">Drag and drop!🎉</p>
            <Image
              src="/empty-workspace.svg"
              alt="Empty workspace"
              width={1}
              height={1}
              className="w-60"
            />
          </div>
        )}

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
    </div>
  );
};
