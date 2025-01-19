import { useCallback } from "react";
import {
  addEdge,
  Connection,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const useFlowManagement = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodesChange = useCallback(
    (changes: any[]) => {
      // Process all changes and track if we need to update trigger node state
      let shouldUpdateTriggerState = false;

      changes.forEach((change) => {
        if (change.type === "add" && change.item.type === "trigger") {
          // Check current nodes for existing trigger
          const hasTrigger = nodes.some((node) => node.type === "trigger");
          if (hasTrigger) {
            // Remove the change to prevent adding multiple triggers
            changes = changes.filter((c) => c !== change);
          } else {
            shouldUpdateTriggerState = true;
          }
        } else if (change.type === "remove") {
          // Check if we're removing a trigger node
          const removedNode = nodes.find((n) => n.id === change.id);
          if (removedNode?.type === "trigger") {
            shouldUpdateTriggerState = true;
          }
        }
      });

      // Apply the filtered changes
      onNodesChange(changes);

      // Update trigger state if needed
      if (shouldUpdateTriggerState) {
        setNodes((currentNodes) => currentNodes);
      }
    },
    [nodes, onNodesChange, setNodes],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    handleNodesChange,
    onEdgesChange,
    onConnect,
  };
};
