import { useCallback } from "react";
import { toast } from "sonner";

interface BaseNode {
  id: string;
  next?: WorkflowNode[];
}

interface TriggerNode extends BaseNode {
  type: "trigger";
  data: Record<string, any>;
}

interface ActionNode extends BaseNode {
  type: "action";
  data: {
    selectedAction: string;
    [key: string]: any;
  };
}

interface ConditionNode extends BaseNode {
  type: "condition";
  data: {
    operator?: string;
    field?: string;
    [key: string]: any;
  };
  next?: WorkflowNode[];
}

type WorkflowNode = TriggerNode | ConditionNode | ActionNode;

const transformWorkflowData = (nodes: any[]): WorkflowNode | null => {
  // Find the trigger node (start of workflow)
  const triggerNode = nodes.find((node) => node.type === "trigger");
  if (!triggerNode) return null;

  const buildNodeTree = (node: any): WorkflowNode => {
    const baseNode = {
      id: node.id,
      type: node.type,
      data: node.data,
    };

    // Find connected nodes
    const connectedNodes = nodes.filter((n) =>
      node.connections.targets.includes(n.id),
    );

    // For all node types, maintain linear flow
    const flowNode = baseNode as WorkflowNode;
    if (connectedNodes.length > 0) {
      // For conditions, only take the first connection (true branch)
      if (node.type === "condition") {
        flowNode.next = connectedNodes.slice(0, 1).map(buildNodeTree);
      } else {
        flowNode.next = connectedNodes.map(buildNodeTree);
      }
    }
    return flowNode;
  };

  return buildNodeTree(triggerNode);
};

export const useFlowSubmission = () => {
  const handleSubmit = useCallback(async (workflowData: any[]) => {
    const structuredWorkflow = transformWorkflowData(workflowData);

    if (!structuredWorkflow) {
      toast.error("Invalid workflow - no trigger node found");
      return;
    }

    console.log("Structured workflow data:", structuredWorkflow);

    const response = await fetch("/api/workflows", {
      method: "POST",
      body: JSON.stringify(structuredWorkflow),
    });

    if (!response.ok) {
      toast.error("Failed to save workflow");
      return;
    }

    toast.success("Workflow saved");
  }, []);

  return {
    handleSubmit,
  };
};

const object: WorkflowNode = {
  id: "63c5d4a8-fd15-4c96-85ee-aeb8143728a8",
  type: "trigger",
  data: {},
  next: [
    {
      id: "c810fabf-ffbf-4dda-b47f-940f596b615c",
      type: "condition",
      data: {
        field: "location",
        operator: "greater",
        value: "canada",
      },
      next: [
        {
          id: "c797105a-73ca-4894-b457-e536b3b4fd26",
          type: "condition",
          data: {
            field: "amount",
            operator: "less",
            value: "200",
          },
          next: [
            {
              id: "d4d36268-a009-49e7-8d31-c8a393468523",
              type: "action",
              data: {
                selectedAction: "sendEmail",
              },
            },
          ],
        },
      ],
    },
  ],
};
