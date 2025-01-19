import { useCallback, useEffect, useState } from "react";
import { Edge, Node } from "reactflow";

export const useSelectionManagement = (
  setNodes: (updater: (nodes: Node[]) => Node[]) => void,
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void,
) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedNode) {
          setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
          setSelectedNode(null);
        }
        if (selectedEdge) {
          setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
          setSelectedEdge(null);
        }
      }
    },
    [selectedNode, selectedEdge, setNodes, setEdges],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return {
    selectedNode,
    selectedEdge,
    onNodeClick,
    onEdgeClick,
    onPaneClick,
  };
};
