import { GitBranch, GripVertical, Mail, Play, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

interface BlockPaletteItemProps {
  type: string;
  label: string;
  description?: string;
  color: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case "trigger":
      return <Mail className="size-5" />;
    case "condition":
      return <GitBranch className="size-5" />;
    case "action":
      return <Play className="size-5" />;
    default:
      return null;
  }
};

const BlockPaletteItem = ({
  type,
  label,
  description,
  color,
}: BlockPaletteItemProps) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`flex cursor-grab items-center gap-3 rounded-sm border bg-white p-3 shadow-sm transition-colors hover:bg-gray-50 active:cursor-grabbing`}
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-center gap-2 text-gray-500">
        <GripVertical className="size-4" />
      </div>
      <div className="flex items-center gap-3">
        <div
          className={cn("rounded p-2.5 text-background", {
            "bg-blue-500": type === "trigger",
            "bg-green-500": type === "condition",
            "bg-red-500": type === "action",
          })}
        >
          {getIcon(type)}
        </div>
        <div className="flex flex-col">
          <span className="font-bold">{label}</span>
          {description && (
            <span className="text-xs font-semibold text-gray-400">
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockPaletteItem;
