import { useCallback } from "react";
import { Ellipsis } from "lucide-react";
import { Handle, Position } from "reactflow";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NodeData {
  label: string;
  actions?: string[];
  selectedAction?: string;
}

export const ActionNode = ({
  data,
  selected,
  id,
}: {
  data: NodeData;
  selected?: boolean;
  id: string;
}) => {
  const updateNodeData = useCallback(
    (newData: Partial<NodeData>) => {
      const updateEvent = {
        type: "updateNodeData",
        id,
        data: newData,
      };
      window.dispatchEvent(
        new CustomEvent("nodeDataUpdate", { detail: updateEvent }),
      );
    },
    [id],
  );

  return (
    <div
      className={cn(
        "group w-full min-w-[300px] overflow-hidden rounded-sm border border-transparent bg-white shadow-lg transition-all hover:border-blue-600",
        {
          "border-blue-600": selected,
        },
      )}
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-red-600 px-4 py-2">
        <span className="font-medium text-white">Action</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full text-white hover:bg-white/10"
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Choose Action Type
          </label>
          <Select
            onValueChange={(value) => updateNodeData({ selectedAction: value })}
            value={data.selectedAction}
          >
            <SelectTrigger className="w-full border-gray-200 hover:border-gray-300">
              <SelectValue placeholder="Select Action" />
            </SelectTrigger>
            <SelectContent>
              {data.actions?.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!size-2 !bg-red-300 group-hover:!bg-red-600"
      />
    </div>
  );
};
