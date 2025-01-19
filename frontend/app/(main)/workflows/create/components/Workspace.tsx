"use client";

import { Edge, Node } from "reactflow";

import "reactflow/dist/style.css";

import { WorkspaceContent } from "./WorkspaceContent";
import { WorkspaceHeader } from "./WorkspaceHeader";

interface WorkspaceProps {
  nodes: Node[];
  edges: Edge[];
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
  onEdgeClick,
  title,
  onUpdateTitle,
  onSubmit,
}: WorkspaceProps) => {
  return (
    <div className="relative flex h-full w-full flex-col">
      <WorkspaceHeader
        title={title}
        onUpdateTitle={onUpdateTitle}
        onSubmit={onSubmit}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
      <WorkspaceContent
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onEdgeClick={onEdgeClick}
      />
    </div>
  );
};
