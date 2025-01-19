"use client";

import React, { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";

import { Button } from "@/components/ui/button";
import {
  ActionNode,
  ConditionNode,
  TriggerNode,
} from "@/components/workflow/nodes";
import { WorkflowDataDisplay } from "@/components/workflow/WorkflowDataDisplay";

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
    getWorkflowData,
  } = useFlowManagement();

  // Keep workflow data updated
  const [workflowData, setWorkflowData] = useState(getWorkflowData());

  // Update workflow data whenever nodes, edges, or node data changes
  useEffect(() => {
    setWorkflowData(getWorkflowData());
  }, [nodes, edges, getWorkflowData]);

  const { selectedNode, selectedEdge, onNodeClick, onEdgeClick, onPaneClick } =
    useSelectionManagement(setNodes, setEdges);

  const { workflowTitle, handleTitleUpdate } = useWorkflowTitle();

  return (
    <ReactFlowProvider>
      <div className="flex h-full">
        {/* The left sidebar containing block items */}
        <BlockPalette />

        {/* The workspace containing the nodes and edges */}
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

        {/* Right sidebar */}
        <div className="w-96 border-l bg-gray-50 p-4">
          {workflowData.length > 0 ? (
            <WorkflowDataDisplay data={workflowData} />
          ) : (
            <div className="text-center text-gray-500">
              Add nodes to see workflow data
            </div>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
