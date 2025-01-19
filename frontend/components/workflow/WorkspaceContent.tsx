import { useCallback } from "react";
import {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlow,
  useReactFlow,
} from "reactflow";

import { EmptyWorkspace } from "./EmptyWorkspace";

interface WorkspaceContentProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onPaneClick: () => void;
  onEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
}

export const WorkspaceContent = ({
  nodes,
  edges,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onEdgeClick,
}: WorkspaceContentProps) => {
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
      const newNode: Node = {
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
    <div className="relative flex-1">
      {nodes.length === 0 && <EmptyWorkspace />}

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
