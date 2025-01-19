import { useCallback, useEffect, useState } from "react";
import {
  addEdge,
  Connection,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";

interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action";
  data: any;
  connections: {
    sources: string[];
    targets: string[];
  };
}

interface NodeDataUpdate {
  type: "updateNodeData";
  id: string;
  data: any;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const useFlowManagement = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodesData, setNodesData] = useState<Record<string, any>>({});

  // Listen for node data updates
  useEffect(() => {
    const handleNodeDataUpdate = (event: CustomEvent<NodeDataUpdate>) => {
      const { id, data } = event.detail;
      setNodesData((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...data },
      }));
    };

    window.addEventListener(
      "nodeDataUpdate",
      handleNodeDataUpdate as EventListener,
    );
    return () => {
      window.removeEventListener(
        "nodeDataUpdate",
        handleNodeDataUpdate as EventListener,
      );
    };
  }, []);

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

  // Get all node data in a structured format including connections
  const getWorkflowData = useCallback((): WorkflowNode[] => {
    // Create a map of connections with safe defaults
    const connections = nodes.reduce(
      (acc, node) => {
        acc[node.id] = {
          sources: [],
          targets: [],
        };
        return acc;
      },
      {} as Record<string, { sources: string[]; targets: string[] }>,
    );

    // Build connections from edges
    edges.forEach((edge) => {
      if (edge.source && connections[edge.source]) {
        connections[edge.source].targets.push(edge.target);
      }
      if (edge.target && connections[edge.target]) {
        connections[edge.target].sources.push(edge.source);
      }
    });

    // Return nodes with their data and connections
    return nodes.map((node) => ({
      id: node.id,
      type: node.type as WorkflowNode["type"], // We know these are valid node types
      data: nodesData[node.id] || {},
      connections: connections[node.id],
    }));
  }, [nodes, edges, nodesData]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    handleNodesChange,
    onEdgesChange,
    onConnect,
    getWorkflowData,
  };
};
