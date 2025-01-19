"use client";

import React, { useEffect, useState } from "react";
import { NodeTypes, ReactFlowProvider } from "reactflow";

import {
  ActionNode,
  ConditionNode,
  TriggerNode,
} from "@/components/workflow/nodes";
import { WorkflowDataDisplay } from "@/components/workflow/WorkflowDataDisplay";

import {
  useFlowManagement,
  useFlowSubmission,
  useSelectionManagement,
  useWorkflowTitle,
} from "../../hooks";
import { BlockPalette } from "./BlockPalette";
import { Workspace } from "./Workspace";

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};

const WorkflowBuilder = () => {
  const { handleSubmit } = useFlowSubmission();
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
          onUpdateTitle={handleTitleUpdate}
          onSubmit={() => handleSubmit(workflowData)}
        />

        {/* Right sidebar */}
        <div className="w-[360px] shrink-0 border-l bg-gray-50 p-4">
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
