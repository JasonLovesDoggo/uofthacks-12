import { useCallback } from "react";
import { toast } from "sonner";

interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action";
  data: Record<string, any>;
  next?: WorkflowNode[];
  conditions?: WorkflowNode[];
}

const transformWorkflowData = (nodes: any[]): WorkflowNode | null => {
  // Find the trigger node (start of workflow)
  const triggerNode = nodes.find((node) => node.type === "trigger");
  if (!triggerNode) return null;

  const buildNodeTree = (node: any): WorkflowNode => {
    const transformedNode: WorkflowNode = {
      id: node.id,
      type: node.type,
      data: node.data,
    };

    // Find connected nodes
    const connectedNodes = nodes.filter((n) =>
      node.connections.targets.includes(n.id),
    );

    if (node.type === "condition") {
      // For conditions, we need to handle multiple branches
      transformedNode.conditions = connectedNodes.map(buildNodeTree);
    } else {
      // For actions/triggers, we have a linear flow
      if (connectedNodes.length > 0) {
        transformedNode.next = connectedNodes.map(buildNodeTree);
      }
    }

    return transformedNode;
  };

  return buildNodeTree(triggerNode);
};

export const useFlowSubmission = () => {
  const handleSubmit = useCallback((workflowData: any[]) => {
    const structuredWorkflow = transformWorkflowData(workflowData);

    if (!structuredWorkflow) {
      toast.error("Invalid workflow - no trigger node found");
      return;
    }

    console.log("Structured workflow data:", structuredWorkflow);
    toast.success("Workflow saved");
  }, []);

  return {
    handleSubmit,
  };
};
