"use client";

import React from "react";
import { ReactFlowProvider } from "reactflow";

import {
  ActionNode,
  ConditionNode,
  TriggerNode,
} from "@/components/workflow/nodes";

import { BlockPalette } from "./components/BlockPalette";
import { Workspace } from "./components/Workspace";
import {
  useFlowManagement,
  useSelectionManagement,
  useWorkflowTitle,
} from "./hooks";

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};

const WorkflowBuilder = () => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    handleNodesChange,
    onEdgesChange,
    onConnect,
  } = useFlowManagement();

  const { selectedNode, selectedEdge, onNodeClick, onEdgeClick, onPaneClick } =
    useSelectionManagement(setNodes, setEdges);

  const { workflowTitle, handleTitleUpdate } = useWorkflowTitle();

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
