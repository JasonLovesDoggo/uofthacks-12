import { cn } from "@/lib/utils";

interface WorkflowNode {
  id: string;
  type: string;
  data: any;
  connections: {
    sources: string[];
    targets: string[];
  };
}

interface WorkflowDataDisplayProps {
  data: WorkflowNode[];
  className?: string;
}

export const WorkflowDataDisplay = ({
  data,
  className,
}: WorkflowDataDisplayProps) => {
  const formatNodeData = (node: WorkflowNode) => {
    switch (node.type) {
      case "trigger":
        return (
          <div className="flex items-center gap-2">
            <span>📨</span>
            <span>When an email arrives</span>
          </div>
        );
      case "condition":
        return (
          <div className="flex items-center gap-2">
            <span>🔍</span>
            <span>
              If {node.data.field || "..."} {node.data.operator || "..."}{" "}
              {node.data.value || "..."}
            </span>
          </div>
        );
      case "action":
        return (
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span>{node.data.selectedAction || "Perform action"}</span>
          </div>
        );
      default:
        return "Unknown node type";
    }
  };

  interface WorkflowTreeItem {
    node: WorkflowNode;
    level: number;
    isLastInGroup: boolean;
    path: string[];
  }

  const buildWorkflowTree = (nodes: WorkflowNode[]): WorkflowTreeItem[] => {
    const trigger = nodes.find((n) => n.type === "trigger");
    if (!trigger) return [];

    // Keep track of processed nodes to avoid duplicates
    const processedNodes = new Set<string>();

    const buildBranch = (
      node: WorkflowNode,
      level: number,
      parentPath: string[] = [],
    ): WorkflowTreeItem[] => {
      // Create a unique path for this node including its ancestors
      const currentPath = [...parentPath, node.id].join("-");

      // If we've seen this exact path before, skip it to avoid duplicates
      if (processedNodes.has(currentPath)) {
        return [];
      }
      processedNodes.add(currentPath);

      const children = nodes.filter((n) =>
        node.connections.targets.includes(n.id),
      );

      return [
        {
          node,
          level,
          isLastInGroup: children.length === 0,
          path: [...parentPath, node.id],
        },
        ...children.flatMap((child) =>
          buildBranch(child, level + 1, [...parentPath, node.id]),
        ),
      ];
    };

    return buildBranch(trigger, 0);
  };

  const getConnectionDescription = (
    node: WorkflowNode,
    nodes: WorkflowNode[],
  ) => {
    if (node.type === "trigger") {
      const targetCount = node.connections.targets.length;

      if (targetCount === 0) return "No actions configured";
      return `Triggers ${targetCount} possible ${
        targetCount === 1 ? "action" : "actions"
      }`;
    }

    if (node.type === "condition") {
      const targets = node.connections.targets
        .map((id) => nodes.find((n) => n.id === id))
        .filter(Boolean) as WorkflowNode[];

      if (targets.length === 0) return "No actions configured";

      if (targets.length > 1) {
        return `When true → Triggers ${targets.length} actions`;
      }

      return `When true → Triggers ${targets[0]?.type === "action" ? "an action" : "next condition"}`;
    }

    return "";
  };

  const getIndentation = (level: number, isLastInGroup: boolean) => {
    if (level === 0) return "";
    return Array(level)
      .fill("")
      .map((_, i) => (
        <span
          key={i}
          className={cn(
            "inline-block w-4",
            i === level - 1 && isLastInGroup ? "border-l" : "border-l",
            i === level - 1 && !isLastInGroup ? "border-l-2" : "border-l-2",
            "h-6",
            i === level - 1 && "border-gray-300",
          )}
        />
      ));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-medium text-gray-500">Workflow Structure</h3>
      <div className="space-y-2">
        {buildWorkflowTree(data).map(({ node, level, isLastInGroup, path }) => (
          <div
            key={path.join("-")}
            className={cn(
              "rounded-md border bg-white p-3 shadow-sm",
              level > 0 && "ml-4",
            )}
          >
            <div className="flex items-start gap-2 font-medium">
              {getIndentation(level, isLastInGroup)}
              <div className="flex-1">
                {formatNodeData(node)}
                {node.connections.targets.length > 0 && (
                  <div className="mt-1 text-sm text-gray-500">
                    {getConnectionDescription(node, data)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
