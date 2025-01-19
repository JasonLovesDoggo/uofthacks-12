import { useState } from "react";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";
import { Edge, Node, OnEdgesChange, OnNodesChange } from "reactflow";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface WorkspaceHeaderProps {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  onSubmit: () => void;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
}

export const WorkspaceHeader = ({
  title,
  onUpdateTitle,
  onSubmit,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
}: WorkspaceHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateTitle(currentTitle);
    toast.success("Workflow title updated");
  };

  const handleClearWorkflow = () => {
    // Remove all nodes
    const nodeChanges = nodes.map((node) => ({
      type: "remove" as const,
      id: node.id,
    }));
    onNodesChange(nodeChanges);

    // Remove all edges
    const edgeChanges = edges.map((edge) => ({
      type: "remove" as const,
      id: edge.id,
    }));
    onEdgesChange(edgeChanges);

    toast.success("Workflow cleared");
  };

  return (
    <nav className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="p-1 duration-300 hover:text-primary"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex items-center gap-1.5">
          {isEditing ? (
            <input
              type="text"
              value={currentTitle}
              onChange={handleTitleChange}
              onBlur={handleBlur}
              autoFocus
              className="border-b-2 border-gray-300 bg-transparent text-lg font-semibold focus:border-blue-500 focus:outline-none"
            />
          ) : (
            <div className="group flex items-center gap-1.5">
              <h1 className="cursor-pointer text-lg font-semibold text-gray-500">
                {currentTitle}
              </h1>
              <button
                className="text-gray-500 focus:outline-none group-hover:text-blue-500"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="duration-300 hover:text-primary"
          onClick={handleClearWorkflow}
        >
          <Trash2 className="size-5" />
        </Button>
        <Button onClick={onSubmit}>
          <Save className="mr-2 h-5 w-5" />
          Save
        </Button>
      </div>
    </nav>
  );
};
